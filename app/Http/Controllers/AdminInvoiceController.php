<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class AdminInvoiceController extends Controller
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
    public function store(StoreInvoiceRequest $request)
    {
        try {
            $validatedData = $request->validated();

            // Calculate service charge
            $basePrice = $validatedData['price'];
            $serviceChargePercentage = $validatedData['service_charge'] ?? 0;
            $serviceChargeAmount = $basePrice * ($serviceChargePercentage / 100);

            // Calculate price after service charge
            $priceAfterServiceCharge = $basePrice + $serviceChargeAmount;

            // Calculate tax
            $taxPercentage = $validatedData['tax'] ?? 0;
            $taxAmount = $priceAfterServiceCharge * ($taxPercentage / 100);

            // Calculate final total price
            $totalPrice = $priceAfterServiceCharge + $taxAmount;

            // Generate a unique invoice number (you can improve this logic as needed)
            $invoiceNumber = 'INV-' . strtoupper(uniqid());

            // Create Invoice
            Invoice::create([
                'invoice_number' => $invoiceNumber,
                'client_id' => $validatedData['client_id'],
                'module_id' => $validatedData['module_id'],
                'item_name' => $validatedData['item_name'],
                'description' => $validatedData['description'],
                'count' => $validatedData['count'],
                'price' => $totalPrice,
                'tax' => $validatedData['tax'],
                'service_charge' => $validatedData['service_charge'],
                'created_by' => auth()->id(),
            ]);

            return redirect()->back()->with('message', 'Invoice Created Successfully');
        } catch (\Exception $e) {
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        try {
            $validatedData = $request->validated();

            // Calculate service charge
            $basePrice = $validatedData['price'];
            $serviceChargePercentage = $validatedData['service_charge'] ?? 0;
            $serviceChargeAmount = $basePrice * ($serviceChargePercentage / 100);

            // Calculate price after service charge
            $priceAfterServiceCharge = $basePrice + $serviceChargeAmount;

            // Calculate tax
            $taxPercentage = $validatedData['tax'] ?? 0;
            $taxAmount = $priceAfterServiceCharge * ($taxPercentage / 100);

            // Calculate final total price
            $totalPrice = $priceAfterServiceCharge + $taxAmount;

            // Update Invoice
            $invoice->update([
                'client_id' => $validatedData['client_id'],
                'module_id' => $validatedData['module_id'],
                'item_name' => $validatedData['item_name'],
                'description' => $validatedData['description'],
                'count' => $validatedData['count'],
                'price' => $totalPrice,
                'tax' => $validatedData['tax'],
                'service_charge' => $validatedData['service_charge'],
                'updated_by' => auth()->id(),
            ]);

            return redirect()->back()->with('message', 'Invoice Updated Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to Update Invoice: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            $invoice = Invoice::findOrFail($id);

            $invoice->delete();

            return redirect()->back()->with('message', 'Invoice deleted.');
        } catch (ModelNotFoundException  $e) {
            return redirect()->back() > with('error', 'Invoice not found');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete Invoice');
        }
    }
}
