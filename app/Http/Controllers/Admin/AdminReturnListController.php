<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReturnListrequest;
use App\Http\Requests\UpdateReturnListrequest;
use App\Models\Activity;
use App\Models\PaymentDeleteRefrence;
use App\Models\PurchasedItem;
use App\Models\ReturnList;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminReturnListController extends Controller
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
    public function store(StoreReturnListrequest $request)
    {
        try {

            DB::beginTransaction();

            $validated = $request->validated();

            $return = ReturnList::create(array_merge($validated, [
                'created_by' => auth()->id(),
            ]));

            Activity::create([
                'client_id' => $validated['client_id'],
                'description' => $validated['item_name'],
                'unit_type' => $validated['item_name'],
                'qty' => 1,
                'price' => $validated['price'],
                'narration' => $validated['narration'],
                'total' => $validated['price'],
                'created_at' => Carbon::parse($validated['return_date'])->setTimeFromTimeString(now()->format('H:i:s')),
                'multiplier' => 1,
                'created_by' => auth()->user()->id,
                'payment_flow' => true,
            ]);


            $purchase = PurchasedItem::create([
                'client_id' => $validated['client_id'],
                'unit_type' => $validated['item_name'],
                'narration' => $validated['narration'],
                'description' => $validated['item_name'],
                'price' => $validated['price'],
                'total' => $validated['price'],
                'multiplier' => 1,
                'created_by' => auth()->id(),
                'created_at' => Carbon::parse($validated['return_date'])->setTimeFromTimeString(now()->format('H:i:s')),
            ]);

            PaymentDeleteRefrence::create([
                'purchased_item_id' => $purchase->id,
                'refrence_id' => $return->id,
                'refrence_type' => ReturnList::class,

            ]);

            DB::commit();

            return redirect()->back()->with('message', 'Return list created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating return list: ' . $e->getMessage());
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create Return List');
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
    public function update(UpdateReturnListRequest $request, ReturnList $returnList)
    {
        try {
            // Get validated data from the form request
            $validated = $request->validated();

            $returnList->update(array_merge($validated, [
                'updated_by' => auth()->id(),
            ]));

            return redirect()->back()->with('message', 'Return updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update Return: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            $returnlist = ReturnList::findOrFail($id);

            $returnlist->delete();

            return redirect()->back()->with('message', 'Return list deleted successfully');
        } catch (\Exception $e) {

            return redirect()->back()->with('error', 'Failed to delete Return list');
        }
    }
}
