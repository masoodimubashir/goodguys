<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseListPaymentForm;
use App\Http\Requests\UpdatePurchaseListPaymentForm;
use App\Models\PurchasedItem;
use App\Models\PurchaseListPayment;
use Illuminate\Http\Request;

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
        $data = $request->validated();


        PurchaseListPayment::create(array_merge($data, [
            'created_by' => auth()->user()->id
        ]));

        PurchasedItem::create([
            'client_id' => $request->client_id,
            'narration' => $request->narration,
            'description' => $request->narration,
            'price' => $request->amount,
            'total' => $request->amount,
            'created_by' => auth()->id(),
            'is_credited' => false,
            'created_at' => $data['transaction_date']

        ]);

        return redirect()->back()->with('message', 'Purchase created successfully');
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
        $data = $request->validated();

        $purchase = PurchaseListPayment::find($id);

        $purchase->update(array_merge($data, [
            'updated_by' => auth()->user()->id
        ]));

        return redirect()->back()->with('message', 'Purchase updated successfully');
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
