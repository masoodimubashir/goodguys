<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Models\Inventory;
use App\Models\Sale;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AdminSaleController extends Controller
{
    /**
     * Display a listing of sales.
     */
    public function index()
    {
        return Inertia::render('Sales/Sale', [
            'sales' => Sale::with('inventory')->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new sale.
     */
    public function create()
    {

        return Inertia::render('Sales/CreateSale', [
            'inventories' => Inventory::latest()->get(),
        ]);
    }

    /**
     * Store a newly created sale in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        try {

            $validatedData = $request->validated();

            $profit = ($validatedData['selling_price'] - $validatedData['buying_price']) * $validatedData['count'];

            Sale::create(array_merge($validatedData, [
                'profit' => $profit,
                'created_by' => auth()->id(),
            ]));

            return redirect()->route('sale.index')->with('message', 'Sale Recorded');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Failed to record sale');
        }
    }

    /**
     * Show the form for editing a sale.
     */
    public function edit($id)
    {
        return Inertia::render('Sales/Edit', [
            'sale' => Sale::find($id),
            'inventories' => Inventory::latest()->get(),
        ]);
    }

    /**
     * Update the specified sale in storage.
     */
    public function update(UpdateSaleRequest $request, $id)
    {
        try {

            $sale = Sale::find($id);

            if (!$sale) {
                throw new Exception('Sale record not found', 404);
            }

            $profit = ($request->selling_price - $request->buying_price) * $request->count;

            $sale->update([
                'inventory_id' => $request->inventory_id,
                'item_name' => $request->item_name,
                'selling_price' => $request->selling_price,
                'buying_price' => $request->buying_price,
                'count' => $request->count,
                'profit' => $profit,
                'updated_by' => auth()->id(),
            ]);

            return redirect()->route('sale.index')->with('message', 'Sale Updated');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update sale');
        }
    }

    /**
     * Remove the specified sale from storage.
     */
    public function destroy($id)
    {
        try {
            $sale = Sale::find($id);

            if (!$sale) {
                throw new Exception('Sale record not found', 404);
            }

            $sale->delete();

            return redirect()->route('sale.index')->with('message', 'Sale Deleted');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (Exception $e) {
            return redirect()->route('sale.index')->with('error', 'Failed to delete sale');
        }
    }
}
