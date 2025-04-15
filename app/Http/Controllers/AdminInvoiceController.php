<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\Invoice;
use App\Models\InvoiceRefrence;
use App\Models\Module;
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
        try {


            DB::beginTransaction();

            $data = $request->validated();

            $invoice_refrence = InvoiceRefrence::create([
                'invoice_number' => uniqid('INV-'),
                'client_id' => $data['client_id'],

            ]);

            foreach ($data['items'] as $index => $item) {


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
                    'item_name' => $item['name'],
                    'description' => $item['description'],
                    'additional_description' => json_encode($item_dimensions),
                    'invoice_refrence_id' => $invoice_refrence->id,
                    'count' => $item['quantity'],
                    'price' => $item['price'],
                    'tax' => $data['tax'] ?? 0,
                    'service_charge' => $data['service_charge'] ?? 0,
                    'created_by' => auth()->id(),
                ]);
            }

            DB::commit();

            return redirect()->route('clients.show', [$invoice_refrence->client_id])->with('message', 'Invoice Created Successfully');
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to Create Invoice: ' . $e->getMessage());
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

            $invoice_ref = InvoiceRefrence::with([
                'invoices',
                'client' => fn ($query) => $query->with('serviceCharge'),
            ])->findOrFail($id);
            $modules = Module::all();
            $inventories = Inventory::all();

            return Inertia::render('Invoices/EditInvoice', [
                'invoice_ref' => $invoice_ref,
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
    public function update(UpdateInvoiceRequest $request, $id)
    {
        try {

            DB::beginTransaction();

            $data = $request->validated();

            $invoiceReference = InvoiceRefrence::findOrFail($id);

            $incomingItemIds = collect($data['items'])->pluck('id')->filter()->all();

            Invoice::where('invoice_refrence_id', $invoiceReference->id)
                ->whereNotIn('id', $incomingItemIds)
                ->delete();

            foreach ($data['items'] as $item) {



                $itemDimensions = [];

                if (!empty($item['item_dimensions']) && is_array($item['item_dimensions'])) {
                    foreach ($item['item_dimensions'] as $dimension) {
                        $itemDimensions[] = [
                            'type' => $dimension['type'] ?? '',
                            'value' => $dimension['value'] ?? '',
                            'si' => $dimension['si'] ?? '',
                        ];
                    }
                }


                if (!empty($item['id'])) {
                    // Update existing invoice item
                    Invoice::where('id', $item['id'])
                        ->update([
                            'item_name' => $item['name'],
                            'description' => $item['description'],
                            'additional_description' => json_encode($itemDimensions),
                            'count' => $item['quantity'],
                            'price' => $item['price'],
                            'tax' => $data['tax'] ?? 0,
                            'service_charge' => $data['service_charge'] ?? 0,
                            'updated_by' => auth()->id(),
                        ]);
                } else {
                    // Create new invoice item
                    Invoice::create([
                        'item_name' => $item['name'],
                        'description' => $item['description'],
                        'additional_description' => json_encode($itemDimensions),
                        'invoice_refrence_id' => $invoiceReference->id,
                        'count' => $item['quantity'],
                        'price' => $item['price'],
                        'tax' => $data['tax'] ?? 0,
                        'service_charge' => $data['service_charge'] ?? 0,
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('clients.show', [$invoiceReference->client_id])->with('message', 'Invoice Updated Successfully');
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to Update Invoice: ' . $e->getMessage());
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
}
