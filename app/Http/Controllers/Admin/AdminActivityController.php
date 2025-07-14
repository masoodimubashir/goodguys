<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Models\BillItemList;
use App\Models\ClientAccount;
use App\Models\PaymentDeleteRefrence;
use App\Models\PurchasedItem;
use App\Models\PurchaseList;
use App\Models\PurchaseListPayment;
use App\Models\ReturnList;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActivityRequest $request)
    {
        try {

            $data = $request->validated();

            Activity::create([
                'client_id' => $data['client_id'],
                'unit_type' => $data['unit_type'],
                'description' => $data['description'],
                'qty' => $data['qty'],
                'price' => $data['price'],
                'narration' => $data['narration'],
                'total' => $data['total'],
                'created_at' => $data['created_at'],
                'is_credited' => false,
                'multiplier' => $data['multiplier'],
                'created_by' => auth()->user()->id,
                'payment_flow' => true,
                'model_type' => Activity::class,
            ]);

            return redirect()->back()->with('message', 'Activity created successfully');

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(UpdateActivityRequest $request, string $id)
    {
        try {


            $data = $request->validated();

            $activity = Activity::find($id);

            $activity->update([
                'unit_type' => $data['unit_type'],
                'description' => $data['description'],
                'qty' => $data['qty'],
                'price' => $data['price'],
                'narration' => $data['narration'],
                'total' => $data['total'],
                'created_at' => $data['created_at'],
                'is_credited' => false,
                'multiplier' => $data['multiplier'],
                'updated_by' => auth()->user()->id,
                'payment_flow' => true,
                'model_type' => Activity::class,
            ]);

            return redirect()->back()->with('message', 'record updated');

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {


        DB::transaction(function () use ($id) {
            try {
                // Find the purchased item with its polymorphic relationship
                $activity = Activity::with('paymentDeleteRefrence')->findOrFail($id);

                if ($activity->paymentDeleteRefrence === null) {
                    $activity->delete();
                    return redirect()->back()->with('message', 'Record deleted');
                }

                $class = $activity->paymentDeleteRefrence->refrence_type;
                $referenceId = $activity->paymentDeleteRefrence->refrence_id;
                $purchasedItemId = $activity->paymentDeleteRefrence->purchased_item_id;

                // dd($class, $referenceId, $purchasedItemId);

                switch ($class) {
                    case ClientAccount::class:
                        ClientAccount::findOrFail($referenceId)->delete();
                        if ($purchasedItemId) {
                            PurchasedItem::findOrFail($purchasedItemId)->delete();
                        }
                        break;

                    case PurchaseListPayment::class:
                        PurchaseListPayment::findOrFail($referenceId)->delete();
                        if ($purchasedItemId) {
                            PurchasedItem::findOrFail($purchasedItemId)->delete();
                        }
                        break;

                    case ReturnList::class:
                        ReturnList::findOrFail($referenceId)->delete();
                        if ($purchasedItemId) {
                            PurchasedItem::findOrFail($purchasedItemId)->delete();
                        }
                        break;

                    case PurchaseList::class:

                        $purchaseList = PurchaseList::with(['returnLists', 'billItemLists'])->findOrFail($referenceId);

                        // 1. Get all related IDs
                        $returnListIds = $purchaseList->returnLists->pluck('id')->toArray();
                        $billItemListIds = $purchaseList->billItemLists->pluck('id')->toArray();

                        // 2. Get all related payments
                        $purchaseListPayments = PurchaseListPayment::where([
                            'client_id' => $purchaseList->client_id,
                            'vendor_id' => $purchaseList->vendor_id,
                        ])->get();


                        $paymentIds = $purchaseListPayments->pluck('id')->toArray();

                        // 3. Get all purchased item IDs from multiple sources
                        $activityIds = collect();
                        $purchasedItemIds = collect();

                        // 1. From payment delete references
                        $paymentDeleteRefs = PaymentDeleteRefrence::whereIn(
                            'refrence_id',
                            array_merge([$referenceId], $returnListIds, $billItemListIds, $paymentIds)
                        )->get();

                        $activityIds = $activityIds->merge($paymentDeleteRefs->pluck('activity_id')->filter());
                        $purchasedItemIds = $purchasedItemIds->merge($paymentDeleteRefs->pluck('purchased_item_id')->filter());


                        // 4. Delete all purchased items
                        if (!empty($purchasedItemIds)) {
                            PurchasedItem::whereIn('id', $purchasedItemIds)->delete();
                        }

                        // Delete ReturnList references and ReturnLists
                        if (!empty($returnListIds)) {
                            PaymentDeleteRefrence::where('refrence_type', ReturnList::class)
                                ->whereIn('refrence_id', $returnListIds)
                                ->delete();
                            ReturnList::whereIn('id', $returnListIds)->delete();
                        }

                        // Delete BillItemList references and BillItemLists
                        if (!empty($billItemListIds)) {
                            PaymentDeleteRefrence::where('refrence_type', BillItemList::class)
                                ->whereIn('refrence_id', $billItemListIds)
                                ->delete();
                            BillItemList::whereIn('id', $billItemListIds)->delete();
                        }

                        // Delete PurchaseListPayment references and payments
                        if (!empty($paymentIds)) {
                            PaymentDeleteRefrence::where('refrence_type', PurchaseListPayment::class)
                                ->whereIn('refrence_id', $paymentIds)
                                ->delete();
                            PurchaseListPayment::whereIn('id', $paymentIds)->delete();
                        }

                        // Delete associated bill file
                        if ($purchaseList->bill && Storage::disk('public')->exists($purchaseList->bill)) {
                            Storage::disk('public')->delete($purchaseList->bill);
                        }

                        if (!empty($activityIds)) {
                            // dd('in empty');
                            Activity::whereIn('id', $activityIds)->delete();
                        }

                        $purchaseList->delete();
                        break;
                    case PurchasedItem::class:
                        PurchasedItem::findOrFail($referenceId)->delete();
                        break;
                }

                $activity->delete();
                return redirect()->back()->with('message', 'Record deleted successfully');

            } catch (Exception $e) {
                Log::error('Failed to delete activity: ' . $e->getMessage());
                return redirect()->back()->with('error', 'Failed to delete the record');
            }
        });

    }


}
