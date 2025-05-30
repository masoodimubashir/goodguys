<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseListRequest;
use App\Http\Requests\UpdatePurchaseListRequest;
use App\Models\PurchasedItem;
use App\Models\PurchaseList;
use App\Models\Vendor;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminPurchaseListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("PurchaseManagment/purchases", [
            'vendor' => Vendor::with([
                'purchaseLists' => function ($query) {
                    $query->with([
                        'purchaseManagments',
                        'returnLists',
                        'client',
                    ]);
                }
            ])->find($request->vendor_id),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseListRequest $request)
    {
        try {

            $validated = $request->validated();


            if ($request->hasFile('bill')) {
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            }


            $purchase_list = PurchaseList::create($validated);

            PurchasedItem::create([
                'client_id' => $purchase_list->client_id,
                'unit_type' => $purchase_list->list_name,
                'description' => $purchase_list->vendor->vendor_name,
                'qty' => 0,
                'price' => $purchase_list->bill_total,
                'narration' => $purchase_list->bill_description,
                'total' => $purchase_list->bill_total,
                'created_by' => auth()->id(),
            ]);

            return redirect()->back()->with('message', 'Purchase list created successfully');
        } catch (\Throwable $e) {
          
            return redirect()->back()->with('error', 'Failed to create purchase list');
        }
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
    // app/Http/Controllers/Admin/AdminPurchaseListController.php

    public function update(UpdatePurchaseListRequest $request, PurchaseList $purchaseList)
    {
        try {


            $validated = $request->validated();

            // Handle file upload
            if ($request->hasFile('bill')) {
                // Delete old file if it exists
                if ($purchaseList->bill) {
                    Storage::disk('public')->delete($purchaseList->bill);
                }
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            } else {
                // If no new file uploaded, keep the existing bill
                $validated['bill'] = $purchaseList->bill;
            }

            $purchaseList->update(array_merge($validated, [
                'updated_by' => auth()->id(),
            ]));

            return redirect()->back()->with('message', 'Purchase list updated successfully');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update purchase list');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $purchaseList = PurchaseList::findOrFail($id);
            // Delete the bill file if it exists
            if ($purchaseList->bill) {
                Storage::disk('public')->delete($purchaseList->bill);
            }
            $purchaseList->delete();

            return redirect()->back()->with('message', 'Purchase list deleted successfully');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete purchase list');
        }
    }
}
