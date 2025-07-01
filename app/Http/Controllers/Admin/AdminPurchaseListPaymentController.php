<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseListPaymentForm;
use App\Http\Requests\UpdatePurchaseListPaymentForm;
use App\Models\Activity;
use App\Models\PaymentDeleteRefrence;
use App\Models\PurchasedItem;
use App\Models\PurchaseListPayment;
use App\Models\Vendor;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminPurchaseListPaymentController extends Controller
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
    public function store(StorePurchaseListPaymentForm $request)
    {

        try {

            DB::beginTransaction();

            $data = $request->validated();

            $vendor = Vendor::find($data['vendor_id']);

            $purchase_list_payment = PurchaseListPayment::create([
                'vendor_id' => $data['vendor_id'],
                'client_id' => $data['client_id'],
                'amount' => $data['amount'],
                'narration' => $data['narration'],
                'transaction_date' => Carbon::parse($data['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'created_by' => auth()->user()->id,
                'created_at' => Carbon::parse($data['created_at'])->setTimeFromTimeString(now()->format('H:i:s'))
            ]);

            $purchase = PurchasedItem::create([
                'client_id' => $data['client_id'],
                'narration' => $data['narration'],
                'description' => $vendor->vendor_name,
                'price' => $data['amount'],
                'total' => $data['amount'],
                'multiplier' => 1,
                'created_by' => auth()->id(),
                'payment_flow' => false,
                'created_at' => Carbon::parse($data['created_at'])->setTimeFromTimeString(now()->format('H:i:s'))

            ]);

            $activity = Activity::create([
                'client_id' => $data['client_id'],
                'narration' => $data['narration'],
                'description' => $vendor->vendor_name,
                'price' => $data['amount'],
                'total' => $data['amount'],
                'multiplier' => 1,
                'created_by' => auth()->id(),
                'payment_flow' => false,
                'created_at' => Carbon::parse($data['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'model_type' => PurchaseListPayment::class,
            ]);

            PaymentDeleteRefrence::create([
                'purchased_item_id' => $purchase->id,
                'refrence_id' => $purchase_list_payment->id,
                'refrence_type' => PurchaseListPayment::class,
                'activity_id' => $activity->id,

            ]);

            DB::commit();

            return redirect()->back()->with('message', 'Payment created successfully');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            DB::rollback();
            return redirect()->back()->with('error', 'Failed! Something went Wrong');
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
    public function update(UpdatePurchaseListPaymentForm $request, string $id)
    {

        try {

            DB::beginTransaction();

            $validated = $request->validated();

            $vendor = Vendor::where('id', $validated['description'])->first();

            $activity = Activity::find($id);

            $activity->update([
                'description' => $vendor->vendor_name,
                'narration' => $validated['narration'],
                'price' => $validated['amount'],
                'total' => $validated['amount'],
                'updated_by' => auth()->id(),
                'payment_flow' => false,
                'created_at' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'model_type' => PurchaseListPayment::class,
            ]);

            $paymentRef = PaymentDeleteRefrence::where('activity_id', $activity->id)
                ->where('refrence_type', PurchaseListPayment::class)
                ->first();

            PurchaseListPayment::find($paymentRef->refrence_id)->update([
                'vendor_id' => $vendor->id,
                'amount' => $validated['amount'],
                'narration' => $validated['narration'],
                'transaction_date' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'updated_by' => auth()->user()->id,
                'created_at' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s'))
            ]);

            PurchasedItem::find($paymentRef->purchased_item_id)->update([
                'description' => $vendor->vendor_name,
                'price' => $validated['amount'],
                'total' => $validated['amount'],
                'created_at' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'updated_by' => auth()->user()->id,
                'narration' => $validated['narration'],

            ]);


            DB::commit();

            return redirect()->back()->with('message', 'record updated..');

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating purchase list payment : ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to update client account: ' . $e->getMessage());
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $purchase = PurchaseListPayment::find($id);

        $purchase->delete();

        return redirect()->back()->with('message', 'Purchase deleted successfully');
    }
}
