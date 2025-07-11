<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBillItemListRequest;
use App\Http\Requests\UpdateBillItemListRequest;
use App\Models\BillItemList;
use App\Models\PurchaseList;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillItemListController extends Controller
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
    public function store(StoreBillItemListRequest $request)
    {
        try {

            DB::beginTransaction();

            $validatedData = $request->validated();

            $bill_item = BillItemList::create($validatedData);

            $purchase_list = PurchaseList::find($validatedData['purchase_list_id']);

            $purchase_list->update([
                'bill_total' => $purchase_list->bill_total + ($bill_item->item_price * $bill_item->item_quantity)
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Item Added Successfully');

        } catch (Exception $e) {
            Log::error($e->getMessage());
            DB::rollback();
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
    public function update(UpdateBillItemListRequest $request, string $id)
    {
        try {
            DB::beginTransaction();

            $item = BillItemList::find($id);

            if (!$item) {
                return redirect()->back()->with('error', 'Item Not Found');
            }

            $validatedData = $request->validated();

            // Update the item
            $item->update($validatedData);

            // Calculate the new bill_total (sum of price * quantity for all items)
            $bill_total = BillItemList::where('purchase_list_id', $validatedData['purchase_list_id'])
                ->selectRaw('SUM(item_price * item_quantity) as total')
                ->value('total');

            // Update the purchase_list's bill_total
            PurchaseList::where('id', $validatedData['purchase_list_id'])
                ->update(['bill_total' => $bill_total]);

            DB::commit();

            return redirect()->back()->with('success', 'Item Updated Successfully');

        } catch (Exception $th) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error Occurred While Updating Item');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            DB::beginTransaction();

            $item = BillItemList::find($id);

            $item->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Item Deleted Successfully');

        } catch (Exception $th) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Error Occured While Deleting Item');

        }
    }
}
