<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchasedItemRequest;
use App\Http\Requests\UpdatePurchasedItemRequest;
use App\Models\Activity;
use App\Models\Client;
use App\Models\ClientAccount;
use App\Models\PaymentDeleteRefrence;
use App\Models\PurchasedItem;
use App\Models\PurchaseListPayment;
use App\Models\ReturnList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $data['total'] = ($data['qty'] * $data['amount']) * $data['multiplier'];

        $purchase = PurchasedItem::create(array_merge($data, [
            'client_id' => $data['client_id'],
            'unit_type' => $data['unit_type'],
            'narration' => $data['narration'],
            'description' => $data['description'],
            'price' => $data['amount'],
            'total' => $data['total'],
            'multiplier' => $data['multiplier'],
            'created_by' => auth()->id(),
            'payment_flow' => false,
            'created_at' => $data['created_at']
        ]));

        PaymentDeleteRefrence::create([
            'purchased_item_id' => $purchase->id,
            'refrence_id' => $purchase->id,
            'refrence_type' => PurchasedItem::class,

        ]);

        Activity::create([
            'client_id' => $data['client_id'],
            'unit_type' => $data['unit_type'],
            'narration' => $data['narration'],
            'description' => $data['description'],
            'price' => $data['amount'],
            'total' => $data['total'],
            'multiplier' => $data['multiplier'],
            'created_by' => auth()->id(),
            'payment_flow' => false,
            'created_at' => $data['created_at']
        ]);

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
        DB::transaction(function () use ($id) {
            // Find the purchased item with its polymorphic relationship
            $purchasedItem = PurchasedItem::with('payemntDeleteRefrence')->findOrFail($id);

            $class = $purchasedItem->payemntDeleteRefrence->refrence_type;

            if ($class === ClientAccount::class) {
                ClientAccount::find($purchasedItem->payemntDeleteRefrence->refrence_id)->delete();
            } else if ($class === PurchaseListPayment::class) {
                PurchaseListPayment::find($purchasedItem->payemntDeleteRefrence->refrence_id)->delete();
            } else if ($class === ReturnList::class) {
                ReturnList::find($purchasedItem->payemntDeleteRefrence->refrence_id)->delete();
            }

            $purchasedItem->delete();
        });

        return redirect()->back()->with('message', 'Item deleted successfully');
    }
}
