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

            $proforma_refrence = ProformaRefrence::create([
                'proforma_number' => uniqid('PRF-'),
                'client_id' => $data['client_id'],
            ]);

            foreach ($data['products'] as $productData) {

                $product = Product::create([
                    'proforma_refrence_id' => $proforma_refrence->id,
                    'product_name' => $productData['product_name'],
                ]);

                foreach ($productData['items'] as $item) {
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

                    Proforma::create([
                        'client_id' => $data['client_id'],
                        'item_name' => $item['name'],
                        'product_id' => $product->id,
                        'description' => $item['description'],
                        'additional_description' => json_encode($item_dimensions),
                        'count' => $item['quantity'],
                        'price' => $item['price'],
                        'tax' => $item['tax'] ?? 0,
                        'service_charge' => $data['service_charge'] ?? 0,
                        'is_price_visible' => $data['show_all_prices'],
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('clients.show', [$proforma_refrence->client_id])
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
                'products' => fn($query) => $query->with('proformas'),
                'client' => fn($query) => $query->with('serviceCharge'),
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
        DB::beginTransaction();

        try {

            $data = $request->validated();

            $proformaReference = ProformaRefrence::findOrFail($id);

            // Get existing product IDs for this proforma reference
            $existingProductIds = Product::where('proforma_refrence_id', $proformaReference->id)->pluck('id')->toArray();

            // Track the products we process to determine which ones to delete later
            $processedProductIds = [];

            // Process each product in the request
            foreach ($data['products'] as $productData) {
                // Create or update the product
                $product = Product::updateOrCreate(
                    // If product has an ID in incoming data, use it for lookup
                    ['id' => $productData['id'] ?? null],
                    [
                        'proforma_refrence_id' => $proformaReference->id,
                        'product_name' => $productData['product_name'],
                    ]
                );

                $processedProductIds[] = $product->id;

                // Get existing proforma item IDs for this product
                $existingItemIds = Proforma::where('product_id', $product->id)->pluck('id')->toArray();
                $processedItemIds = [];

                // Process each item in the product
                foreach ($productData['items'] as $itemData) {
                    // Convert item dimensions to the expected format
                    $itemDimensions = collect($itemData['item_dimensions'])->map(fn($dim) => [
                        'type' => $dim['type'],
                        'value' => $dim['value'],
                        'si' => $dim['si'],
                    ]);

                    // Create or update the proforma item
                    $proformaItem = Proforma::updateOrCreate(
                        ['id' => $itemData['id'] ?? null],
                        [
                            'proforma_refrence_id' => $proformaReference->id,
                            'product_id' => $product->id,
                            'item_name' => $itemData['name'],
                            'description' => $itemData['description'] ?? null,
                            'additional_description' => json_encode($itemDimensions),
                            'count' => $itemData['quantity'],
                            'price' => $itemData['price'],
                            'tax' => $itemData['tax'] ?? 0,
                            'service_charge' => $data['service_charge'] ?? 0,
                            'source_type' => $itemData['source'],
                            'source_id' => $itemData['source_id'],
                            'updated_by' => auth()->id(),
                            'created_by' => isset($itemData['id']) ? null : auth()->id(),
                            'is_price_visible' => $data['show_all_prices'],
                        ]
                    );

                    $processedItemIds[] = $proformaItem->id;
                }

                Proforma::where('product_id', $product->id)
                    ->whereNotIn('id', $processedItemIds)
                    ->delete();
            }

            Product::where('proforma_refrence_id', $proformaReference->id)
                ->whereNotIn('id', $processedProductIds)
                ->delete();

            DB::commit();

            return redirect()->route('clients.show', [$proformaReference->client_id])
                ->with('message', 'Proforma Updated Successfully');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating proforma: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to Update Proforma: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            $proforma = ProformaRefrence::findOrFail($id);

            $proforma->delete();

            return redirect()->back()->with('message', 'Proforma deleted successfully');
        } catch (ModelNotFoundException $e) {
            return redirect()->back() > with('error', 'Proforma not found');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete proforma');
        }
    }
}
