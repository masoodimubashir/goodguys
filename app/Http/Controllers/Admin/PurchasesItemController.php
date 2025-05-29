<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchasedItemRequest;
use App\Http\Requests\UpdatePurchasedItemRequest;
use App\Models\Client;
use App\Models\PurchasedItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchasesItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('PurchasedItems/PurchaseItem', [
            'client' => Client::with('purchaseItems')->find($request->client_id),
        ]);
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
    public function store(StorePurchasedItemRequest $request)
    {

        $data = $request->validated();

        $data['total'] = $data['qty'] * $data['price'];

        PurchasedItem::create(array_merge($data, [
            'total' => $data['total'],
            'created_by' => auth()->id(),
        ]));

        return redirect()->back()->with('message', 'Item created successfully');
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
    public function update(UpdatePurchasedItemRequest $request, $id)
    {
        $data = $request->validated();

        $purchasedItem = PurchasedItem::findOrFail($id);

        $data['total'] = $data['qty'] * $data['price'];

        $purchasedItem->update(array_merge($data, [
            'updated_by' => auth()->id(),
        ]));

        return redirect()->back()->with('message', 'Item updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        $purchasedItem = PurchasedItem::findOrFail($id);

        $purchasedItem->delete();

        return redirect()->back()->with('message', 'Item deleted successfully');
    }
}
