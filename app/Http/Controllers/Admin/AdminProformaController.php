<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProformaRequest;
use App\Http\Requests\UpdateProformaRequest;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\Module;
use App\Models\Product;
use App\Models\Proforma;
use App\Models\ProformaModule;
use App\Models\ProformaRefrence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;




class AdminProformaController extends Controller
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
    public function create(Request $request)
    {
        return Inertia::render('Proformas/CreateProforma', [
            'client' => Client::with('serviceCharge')->findOrFail($request->get('client_id')),
            'modules' => Module::all(),
            'inventories' => Inventory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProformaRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();



            // Step 1: Create Proforma Reference
            $proformaRefrence = ProformaRefrence::create([
                'proforma_number' => uniqid('PRF-'),
                'client_id' => $data['client_id'],
            ]);

            // Step 2: Loop through each module (product)
            foreach ($data['products'] as $moduleData) {

                // Step 2a: Create ProformaModule
                $proformaModule = ProformaModule::create([
                    'module_name' => $moduleData['module_name'],
                ]);

                // Step 2b: Loop through each item in the module
                foreach ($moduleData['items'] as $item) {
                    $item_dimensions = [];

                    if (!empty($item['item_dimensions']) && is_array($item['item_dimensions'])) {
                        foreach ($item['item_dimensions'] as $dimension) {
                            $item_dimensions[] = [
                                'type' => $dimension['type'] ?? '',
                                'value' => $dimension['value'] ?? '',
                                'si' => $dimension['si'] ?? '',
                            ];
                        }
                    }

                    // Step 2c: Save Proforma
                    Proforma::create([
                        'item_name' => $item['name'],
                        'proforma_module_id' => $proformaModule->id,
                        'proforma_refrence_id' => $proformaRefrence->id,
                        'description' => $item['description'],
                        'additional_description' => json_encode($item_dimensions),
                        'count' => $item['quantity'],
                        'price' => $item['price'],
                        'service_charge' => $data['service_charge'] ?? 0,
                        'is_price_visible' => $data['show_all_prices'],
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('clients.show', [$proformaRefrence->client_id])
                ->with('message', 'Proforma Created Successfully');
        } catch (Exception $e) {
            Log::error('Failed to create proforma: ' . $e->getMessage());
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to Create Proforma: ' . $e->getMessage());
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
        try {

            $proforma = ProformaRefrence::with([
                'proformas.proformaModule',
                'client',
            ])->findOrFail($id);

            $modules = Module::all();
            $inventories = Inventory::all();

            return Inertia::render('Invoices/EditProforma', [
                'proforma' => $proforma,
                'modules' => $modules,
                'inventories' => $inventories,
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Invoice not found');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProformaRequest $request, $id)
    {
        $data = $request->validated();

        // Find the existing proforma reference
        $proformaReference = ProformaRefrence::findOrFail($id);

        // Reset conversion status on update
        $proformaReference->update([
            'is_converted_to_invoice' => 0
        ]);

        // Track processed modules and items
        $processedModuleIds = [];
        $processedItemIds = [];

        // Process each module (product) in the request
        foreach ($data['products'] as $moduleData) {

            // Create or update the module using the module_id from the request
            $module = ProformaModule::updateOrCreate(
                [
                    'id' => $moduleData['module_id'] ?? null,
                ],
                [
                    'proforma_refrence_id' => $proformaReference->id,
                    'module_name' => $moduleData['module_name'],
                ]
            );

            $processedModuleIds[] = $module->id;

            // First, delete all existing items for this module to avoid duplicates
            // since items don't have IDs in the request
            Proforma::where('proforma_module_id', $module->id)->delete();

            // Process each item in the module (create new items)
            foreach ($moduleData['items'] as $itemData) {
                // Prepare item dimensions
                $itemDimensions = [];
                if (!empty($itemData['item_dimensions'])) {
                    foreach ($itemData['item_dimensions'] as $dimension) {
                        $itemDimensions[] = [
                            'type' => $dimension['type'] ?? '',
                            'value' => $dimension['value'] ?? '',
                            'si' => $dimension['si'] ?? '',
                        ];
                    }
                }

                // Create new proforma item
                $proformaItem = Proforma::create([
                    'proforma_refrence_id' => $proformaReference->id,
                    'proforma_module_id' => $module->id,
                    'item_name' => $itemData['name'],
                    'description' => $itemData['description'] ?? null,
                    'additional_description' => json_encode($itemDimensions),
                    'count' => $itemData['quantity'],
                    'price' => $itemData['price'],
                    'service_charge' => $data['service_charge'] ?? 0,
                    'source_type' => $itemData['source'] ?? null,
                    'source_id' => $itemData['source_id'] ?? null,
                    'is_price_visible' => $itemData['is_price_visible'] ?? $data['show_all_prices'],
                    'updated_by' => auth()->id(),
                ]);

                $processedItemIds[] = $proformaItem->id;
            }
        }

        // Delete modules that weren't processed (modules removed from the form)
        ProformaModule::whereNotIn('id', $processedModuleIds)
            ->delete();

        DB::commit();

        return redirect()->route('clients.show', [$proformaReference->client_id])
            ->with('message', 'Proforma Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            DB::beginTransaction();

            $proformaReference = ProformaRefrence::findOrFail($id);

            $proforma_module_ids = Proforma::where('proforma_refrence_id', $proformaReference->id)->pluck('proforma_module_id');

            foreach ($proforma_module_ids as $module_id) {
                ProformaModule::find($module_id)->delete();
            }

            $proformaReference->delete();

            DB::commit();

            return redirect()->back()->with('message', 'Proforma and all related data deleted successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Proforma not found');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to delete proforma: ' . $e->getMessage());
        }
    }
}
