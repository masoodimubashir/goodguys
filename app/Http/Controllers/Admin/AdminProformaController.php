<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProformaRequest;
use App\Http\Requests\UpdateProformaRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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

            // Create the proforma reference
            $proforma_refrence = ProformaRefrence::create([
                'proforma_number' => uniqid('PRF-'),
                'client_id' => $data['client_id'],
            ]);

            // Loop through each product in the products array
            foreach ($data['products'] as $productData) {
                // Create the product
                $product = Product::create([
                    'proforma_refrence_id' => $proforma_refrence->id,
                    'product_name' => $productData['product_name'],
                ]);

                // Loop through each item in the product's items array
                foreach ($productData['items'] as $item) {
                    $item_dimensions = [];

                    // Process item dimensions if they exist
                    if (!empty($item['item_dimensions']) && is_array($item['item_dimensions'])) {
                        foreach ($item['item_dimensions'] as $dimension) {
                            $item_dimensions[] = [
                                'type' => $dimension['type'] ?? '',
                                'value' => $dimension['value'] ?? '',
                                'si' => $dimension['si'] ?? '',
                            ];
                        }
                    }

                    // Create the proforma entry with tax from the current item
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

            $proforma_ref = ProformaRefrence::with([
                'products' => fn($query) => $query->with('proformas'),
                'client' => fn($query) => $query->with('serviceCharge'),
            ])->findOrFail($id);
            $modules = Module::all();
            $inventories = Inventory::all();

            return Inertia::render('Invoices/EditProforma', [
                'proforma_ref' => $proforma_ref,
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

            // Get incoming product and proforma item IDs
            $incomingProductIds = collect($data['products'])->pluck('id')->filter()->all();
            $incomingItemIds = collect($data['products'])
                ->flatMap(fn($product) => collect($product['items'])->pluck('id')->filter())
                ->all();

            // First: delete proformas related to this reference, via products, that are not in request
            $existingProductIds = Product::where('proforma_refrence_id', $proformaReference->id)->pluck('id');

            Proforma::whereIn('product_id', $existingProductIds)
                ->whereNotIn('id', $incomingItemIds)
                ->delete();

            // Then: delete products that are no longer in the request
            Product::where('proforma_refrence_id', $proformaReference->id)
                ->whereNotIn('id', $incomingProductIds)
                ->delete();

            // Now handle create/update
            foreach ($data['products'] as $productData) {
                $product = Product::updateOrCreate(
                    ['id' => $productData['id'] ?? null],
                    [
                        'proforma_refrence_id' => $proformaReference->id,
                        'product_name' => $productData['product_name'],
                    ]
                );

                foreach ($productData['items'] as $itemData) {
                    $itemDimensions = collect($itemData['item_dimensions'])->map(fn($dim) => [
                        'type' => $dim['type'],
                        'value' => $dim['value'],
                        'si' => $dim['si'],
                    ]);

                    Proforma::updateOrCreate(
                        ['id' => $itemData['id'] ?? null],
                        [
                            'proforma_refrence_id' => $proformaReference->id,
                            'product_id' => $product->id,
                            'item_name' => $itemData['name'],
                            'description' => $itemData['description'],
                            'additional_description' => json_encode($itemDimensions),
                            'count' => $itemData['quantity'],
                            'price' => $itemData['price'],
                            'tax' => $itemData['tax'],
                            'service_charge' => $data['service_charge'],
                            'source_type' => $itemData['source'],
                            'source_id' => $itemData['source_id'],
                            'updated_by' => auth()->id(),
                            'created_by' => isset($itemData['id']) ? null : auth()->id(),
                        ]
                    );
                }
            }

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
