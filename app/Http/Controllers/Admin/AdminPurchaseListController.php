<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseListRequest;
use App\Http\Requests\UpdatePurchaseListRequest;
use App\Models\Activity;
use App\Models\BillItemList;
use App\Models\ClientAccount;
use App\Models\PaymentDeleteRefrence;
use App\Models\PurchaseList;
use App\Models\PurchaseListPayment;
use App\Models\Vendor;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminPurchaseListController extends Controller
{
    /**
     * Display a listing of the resource.
     */



    public function index(Request $request)
    {


        $client_id = $request->client_id;
        $vendor_id = $request->vendor_id;

        // 1. Get vendor with minimal data
        $vendor = Vendor::select(['id', 'vendor_name'])
            ->findOrFail($vendor_id);

        // 2. Optimized purchase lists query with eager loading
        $purchaseLists = PurchaseList::query()
            ->with([
                'returnLists:id,purchase_list_id,return_date,item_name,price,narration',
                'client:id,client_name,client_phone,client_address',
                'billItemLists:id,purchase_list_id,item_description,item_quantity,item_price'
            ])
            ->where('client_id', $client_id)
            ->where('vendor_id', $vendor_id)
            ->select([
                'id',
                'client_id',
                'vendor_id',
                'list_name',
                'purchase_date',
                'bill_total',
                'bill_description',
                'bill',
                'created_at'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // 3. Optimized payments query
        $purchaseListPayments = PurchaseListPayment::query()
            ->where('vendor_id', $vendor_id)
            ->where('client_id', $client_id)
            ->select([
                'id',
                'client_id',
                'vendor_id',
                'amount',
                'transaction_date',
                'narration',
                'created_at'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // 4. Optimized client account totals (single query)
        $clientAccountTotals = ClientAccount::query()
            ->where('client_id', $client_id)
            ->selectRaw('SUM(CASE WHEN payment_flow = 1 THEN amount ELSE 0 END) as in_total')
            ->selectRaw('SUM(CASE WHEN payment_flow = 0 THEN amount ELSE 0 END) as out_total')
            ->first();

        return Inertia::render("PurchaseManagment/purchases", [
            'vendor' => $vendor,
            'purchaseLists' => $purchaseLists,
            'purchaseListPayments' => $purchaseListPayments,
            'Client' => $purchaseLists->first()?->client,
            'filters' => $request->only(['search']),
            'clientAccountInTotal' => $clientAccountTotals->in_total ?? 0,
            'clientAccountOutTotal' => $clientAccountTotals->out_total ?? 0,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseListRequest $request)
    {
        try {

            DB::beginTransaction();

            $validated = $request->validated();

            if ($request->hasFile('bill')) {
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            }

            $purchase_list = PurchaseList::create(array_merge($validated, [
                'created_at' => Carbon::parse($validated['purchase_date'])->setTimeFromTimeString(now()->format('H:i:s')),
            ]));


            if (!empty($validated['items'])) {  // Better check for array existence and content
                foreach ($validated['items'] as $item) {
                    BillItemList::create([
                        'purchase_list_id' => $purchase_list->id,
                        'item_description' => $item['description'],
                        'item_quantity' => $item['quantity'],
                        'item_price' => $item['price'],
                    ]);
                }
            }


            $activity = Activity::create([
                'client_id' => $purchase_list->client_id,
                'unit_type' => $purchase_list->list_name,
                'description' => $purchase_list->vendor->vendor_name,
                'qty' => 1,
                'price' => $purchase_list->bill_total,
                'narration' => $purchase_list->bill_description,
                'total' => $purchase_list->bill_total,
                'created_by' => auth()->id(),
                'is_credited' => false,
                'multiplier' => 1,
                'created_at' => Carbon::parse($validated['purchase_date'])->setTimeFromTimeString(now()->format('H:i:s')),
                'model_type' => PurchaseList::class,
            ]);

            PaymentDeleteRefrence::create([
                'refrence_id' => $purchase_list->id,
                'refrence_type' => PurchaseList::class,
                'activity_id' => $activity->id,
            ]);

            DB::commit();

            return redirect()->back()->with('message', 'Purchase list created successfully');
        } catch (Exception $e) {

            Log::error('Error creating purchase list: ' . $e->getMessage());

            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create purchase list');
        }
    }


    // Add this method to handle file downloads
    public function downloadBill(PurchaseList $purchaseList)
    {
        // Check if file exists
        if (!Storage::disk('public')->exists($purchaseList->bill)) {
            abort(404);
        }

        // Get the original file extension
        $extension = pathinfo($purchaseList->bill, PATHINFO_EXTENSION);

        // Create filename using vendor name and original extension
        $fileName = Str::slug($purchaseList->vendor->vendor_name) . '.' . $extension;

        // Get file details
        $filePath = Storage::disk('public')->path($purchaseList->bill);
        $mimeType = Storage::disk('public')->mimeType($purchaseList->bill);

        $headers = [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        return response()->file($filePath, $headers);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $search = request('search');
        $startDate = request('start_date');
        $endDate = request('end_date');

        $purchaseList = PurchaseList::with([
            'purchasedProducts' => function ($query) use ($search, $startDate, $endDate) {
                $query->when($search, function ($query) use ($search) {
                    $query->where('product_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                    ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                        $query->whereBetween('created_at', [$startDate, $endDate]);
                    })
                    ->with(['returnLists']);
            },
            'client' => function ($query) {
                $query->with(['serviceCharge']);
            },
        ])
            ->findOrFail($id);


        return Inertia::render('PurchasedProduct/PurchasedProduct', [
            'purchaseList' => $purchaseList,
            'filters' => [
                'search' => $search,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseListRequest $request, $id)
    {
        try {

            DB::beginTransaction();

            $validated = $request->validated();

            $vendor = Vendor::where('id', $validated['description'])->first();

            $activity = Activity::find($id);

            $activity->update([
                'unit_type' => $validated['unit_type'],
                'description' => $vendor->vendor_name,
                'narration' => $validated['narration'],
                'price' => $validated['total'],
                'total' => $validated['total'],
                'model_type' => PurchaseList::class,
                'updated_by' => auth()->id(),
                'payment_flow' => false,
                'created_at' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
            ]);

            $paymentRef = PaymentDeleteRefrence::where('activity_id', $activity->id)
                ->where('refrence_type', PurchaseList::class)
                ->first();

            $purchase_list = PurchaseList::find($paymentRef->refrence_id);

            if ($request->hasFile('bill')) {

                if ($purchase_list->bill && Storage::disk('public')->exists($purchase_list->bill)) {
                    Storage::disk('public')->delete($purchase_list->bill);
                }

                $path = $request->file('bill')->store('purchase-lists', 'public');
                $validated['bill'] = $path;

            } else {
                $validated['bill'] = $purchase_list->bill;
            }

            $purchase_list->update([
                'purchase_date' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'list_name' => $validated['unit_type'],
                'bill' => $validated['bill'],
                'bill_total' => $validated['total'],
                'bill_description' => $validated['narration'],
                'updated_by' => auth()->id(),
            ]);

            DB::commit();

            return redirect()->back()->with('message', 'record updated..');

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating clinet account: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to update client account: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            DB::beginTransaction();

            $purchaseList = PurchaseList::with('vendor')->findOrFail($id);

            // Delete the bill file if it exists
            if ($purchaseList->bill && Storage::disk('public')->exists($purchaseList->bill)) {
                Storage::disk('public')->delete($purchaseList->bill);
            }

            $purchaseList->delete();

            DB::commit();

            return redirect()->route('clients.show', $purchaseList->client_id)
                ->with('message', 'bill deleted successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            Log::error('Purchase list not found: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Purchase list not found');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error deleting entry');
            return redirect()->back()
                ->with('error', 'Failed to delete purchase list. Please try again.');
        }
    }


}
