<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryRequest;
use App\Models\Inventory;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminInventoryController extends Controller
{

    public function index()
    {
        return Inertia::render('Inventory/Inventory', [
            'inventories' => Inventory::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventory/CreateInventory');
    }


    public function store(StoreInventoryRequest $request)
    {
        try {
            $request->merge([
                'created_by' => auth()->user()->id,
            ]);

            $dimensions = collect($request->item_dimensions)
                ->map(fn($dim) => implode(',', [$dim['type'], $dim['value'], $dim['unit']]))
                ->toArray();


            Inventory::create([
                'item_name' => $request->item_name,
                'selling_price' => $request->selling_price,
                'buying_price' => $request->buying_price,
                'item_type' => $request->item_type,
                'item_dimensions' => $dimensions,
                'item_sub_type' => $request->item_sub_type,
                'description' => $request->description,
                'count' => $request->count,
                'created_by' => $request->created_by,
            ]);

            return redirect()->route('inventory.index')
                ->with('message', 'Inventory Created');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->route('inventory.index')
                ->with('error', 'Failed to create inventory');
        }
    }



    public function edit(Inventory $inventory)
    {
        return Inertia::render('Inventory/EditInventory', [
            'inventory' => $inventory
        ]);
    }

    public function update(StoreInventoryRequest $request, Inventory $inventory)
    {
        try {
            $request->merge([
                'updated_by' => auth()->user()->id,
            ]);

            $dimensions = collect($request->item_dimensions)
                ->map(fn($dim) => implode(',', [$dim['type'], $dim['value'], $dim['unit']]))
                ->toArray();

            $inventory->update([
                'item_name' => $request->item_name,
                'selling_price' => $request->selling_price,
                'buying_price' => $request->buying_price,
                'item_type' => $request->item_type,
                'item_dimensions' => $dimensions,
                'item_sub_type' => $request->item_sub_type,
                'description' => $request->description,
                'count' => $request->count,
                'updated_by' => $request->updated_by,
            ]);

            return redirect()->route('inventory.index')
                ->with('message', 'Inventory Updated');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->route('inventory.index')
                ->with('error', 'Failed to update inventory');
        }
    }



    public function destroy(Inventory $inventory)
    {
        try {


            $inventory->delete();

            return redirect()->route('inventory.index')
                ->with('message', 'Inventory Deleted ');
        } catch (Exception $e) {
            Log::error($e);
            return redirect()->route('inventory.index')
                ->with('error', 'Failed to delete inventory');
        }
    }
}
