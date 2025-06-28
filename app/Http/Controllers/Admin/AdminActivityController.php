<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Models\Activity;
use App\Models\ClientAccount;
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
                'payment_flow' => false,
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
    public function update(Request $request, string $id)
    {
        //
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

                if ($class === ClientAccount::class) {
                    ClientAccount::find($activity->paymentDeleteRefrence->refrence_id)->delete();
                    PurchasedItem::find($activity->paymentDeleteRefrence->purchased_item_id)->delete();
                } else if ($class === PurchaseListPayment::class) {
                    PurchaseListPayment::find($activity->paymentDeleteRefrence->refrence_id)->delete();
                    PurchasedItem::find($activity->paymentDeleteRefrence->purchased_item_id)->delete();
                } else if ($class === ReturnList::class) {
                    ReturnList::find($activity->paymentDeleteRefrence->refrence_id)->delete();
                    PurchasedItem::find($activity->paymentDeleteRefrence->purchased_item_id)->delete();
                } elseif ($class === PurchaseList::class) {

                    $purchaseList = PurchaseList::find($activity->paymentDeleteRefrence->refrence_id);
                    // Delete the bill file if it exists
                    if ($purchaseList->bill && Storage::disk('public')->exists($purchaseList->bill)) {
                        Storage::disk('public')->delete($purchaseList->bill);
                    }

                    $purchaseList->delete();

                } elseif ($class === PurchasedItem::class) {
                    PurchasedItem::find($activity->paymentDeleteRefrence->refrence_id)->delete();
                }

                $activity->delete();

                return redirect()->back()->with('message', 'Record deleted...');
            } catch (Exception $e) {
                Log::error($e->getMessage());

                return redirect()->back()->with('error', 'Failed to delete Record');
            }
        });

    }


}
