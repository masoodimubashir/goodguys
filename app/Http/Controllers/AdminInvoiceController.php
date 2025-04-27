<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\Invoice;
use App\Models\InvoiceRefrence;
use App\Models\Module;
use App\Models\Product;
use App\Models\ProformaRefrence;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminInvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Invoices/Invoice', [
            'invoices' => Invoice::with([
                'client',
                'module'
            ])->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Invoices/CreateInvoice', [
            'client' => Client::with('serviceCharge')->findOrFail($request->get('client_id')),
            'modules' => Module::all(),
            'inventories' => Inventory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        DB::beginTransaction();

        try {


            $data = $request->validated();

            $invoice_refrence = InvoiceRefrence::create([
                'invoice_number' => uniqid('INV-'),
                'client_id' => $data['client_id'],
            ]);

            foreach ($data['products'] as $productData) {

                $product = Product::create([
                    'invoice_refrence_id' => $invoice_refrence->id,
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

                    Invoice::create([
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
            return redirect()->route('clients.show', [$invoice_refrence->client_id])
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

            $invoice = InvoiceRefrence::with([
                'products' => fn($query) => $query->with('invoices'),
                'client' => fn($query) => $query->with('serviceCharge'),
            ])->findOrFail($id);

            $modules = Module::all();
            $inventories = Inventory::all();

            return Inertia::render('Invoices/EditInvoice', [
                'invoice' => $invoice,
                'modules' => $modules,
                'inventories' => $inventories,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('Invoice not found', ['exception' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Invoice not found');
        } catch (Exception $e) {

            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $invoice = InvoiceRefrence::findOrFail($id);

            // Get existing product IDs for this invoice
            $existingProductIds = Product::where('invoice_refrence_id', $invoice->id)
                ->pluck('id')
                ->toArray();

            $processedProductIds = [];

            // Process each product in the request
            foreach ($data['products'] as $productData) {
                // Create or update the product
                $product = Product::updateOrCreate(
                    ['id' => $productData['id'] ?? null],
                    [
                        'invoice_refrence_id' => $invoice->id,
                        'product_name' => $productData['product_name'],
                    ]
                );

                $processedProductIds[] = $product->id;

                // Get existing invoice item IDs for this product
                $existingItemIds = Invoice::where('product_id', $product->id)
                    ->pluck('id')
                    ->toArray();

                $processedItemIds = [];

                // Process each item in the product
                foreach ($productData['items'] as $itemData) {
                    // Convert item dimensions to JSON
                    $itemDimensions = json_encode($itemData['item_dimensions']);

                    // Create or update the invoice item
                    $invoiceItem = Invoice::updateOrCreate(
                        ['id' => $itemData['id'] ?? null],
                        [
                            'invoice_refrence_id' => $invoice->id,
                            'product_id' => $product->id,
                            'item_name' => $itemData['name'],
                            'description' => $itemData['description'] ?? null,
                            'additional_description' => $itemDimensions,
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

                    $processedItemIds[] = $invoiceItem->id;
                }

                // Delete items that were removed from the product
                Invoice::where('product_id', $product->id)
                    ->whereNotIn('id', $processedItemIds)
                    ->delete();
            }

            // Delete products that were removed from the invoice
            Product::where('invoice_refrence_id', $invoice->id)
                ->whereNotIn('id', $processedProductIds)
                ->delete();

            DB::commit();

            return redirect()->route('clients.show', [$invoice->client_id])
                ->with('message', 'Invoice Updated Successfully');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating Invoice: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to Update Invoice: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            $invoice = InvoiceRefrence::findOrFail($id);

            $invoice->delete();

            return redirect()->back()->with('message', 'Invoice deleted.');
        } catch (ModelNotFoundException  $e) {
            return redirect()->back() > with('error', 'Invoice not found');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete Invoice');
        }
    }


    public function createInvoiceFromPdf($id)
    {

        DB::beginTransaction();

        

        try {

            $proforma_ref = ProformaRefrence::with([
                'products' => fn($query) => $query->with('proformas'),
                'client' => fn($query) => $query->with('serviceCharge'),
            ])->findOrFail($id);

            // Create new invoice
            $invoice = InvoiceRefrence::create([
                'invoice_number' => uniqid('INV-'),
                'client_id' => $proforma_ref->client_id,
            ]);

            // Copy products and items
            foreach ($proforma_ref->products as $product) {

                $newProduct = $invoice->products()->create([
                    'product_name' => $product->product_name,
                    'invoice_refrence_id' => $invoice->id,
                ]);

                foreach ($product->proformas as $item) {

                    $newProduct->invoices()->create([
                        'item_name' => $item->item_name,
                        'product_id' => $newProduct->id,
                        'description' => $item->description,
                        'additional_description' => $item->additional_description,
                        'count' => $item->count,
                        'price' => $item->price,
                        'tax' => $item->tax,
                        'service_charge' => $item->service_charge,
                        'source_type' => $item->source_type,
                        'source_id' => $item->source_id,
                        'is_price_visible' => $item->is_price_visible,
                    ]);

                }
            }

            DB::commit();

            return redirect()->back()->with('message' , 'Invoice created successfully');

        } catch (Exception $e) {
            Log::error('Error creating invoice: ' . $e->getMessage());
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create invoice');
        }
    }
}
