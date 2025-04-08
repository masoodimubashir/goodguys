<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProformaRequest;
use App\Http\Requests\UpdateProformaRequest;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\Module;
use App\Models\Proforma;
use App\Models\ProformaRefrence;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use function Illuminate\Log\log;

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
            'client' => Client::findOrFail($request->get('client_id')),
            'modules' => Module::all(),
            'inventories' => Inventory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProformaRequest $request)
    {
        try {

            DB::beginTransaction();

            $data = $request->validated();


            $proforma_refrence = ProformaRefrence::create([
                'proforma_number' => uniqid('PRF-'),
                'client_id' => $data['client_id'],
            ]);

            foreach ($data['items'] as $index => $item) {

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

                // Create the proforma entry
                Proforma::create([
                    'client_id' => $data['client_id'],
                    'item_name' => $item['name'],
                    'proforma_refrence_id' => $proforma_refrence->id,
                    'description' => $item['description'],
                    'additional_description' => json_encode($item_dimensions),
                    'count' => $item['quantity'],
                    'price' => $item['price'],
                    'tax' => $data['tax'] ?? 0,
                    'service_charge' => $data['service_charge'] ?? 0,
                    'created_by' => auth()->id(),
                ]);

            }

            DB::commit();

            return redirect()->back()->with('message', 'Proforma Created Successfully');
            
        } catch (Exception $e) {
            Log::error('Error creating proforma: ' . $e->getMessage());
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProformaRequest $request, string $id)
    {
        try {
            $validatedData = $request->validated();

            // Find the proforma to update
            $proforma = Proforma::findOrFail($id);

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

            // Update the existing Proforma with new data
            $proforma->update([
                'tax' => $validatedData['tax'],
                'service_charge' => $validatedData['service_charge'],
                'price' => $totalPrice,
                'client_id' => $validatedData['client_id'],
                'module_id' => $validatedData['module_id'],
                'item_name' => $validatedData['item_name'],
                'description' => $validatedData['description'],
                'count' => $validatedData['count'],
                'updated_by' => auth()->id(), // Track who updated it
            ]);

            return redirect()->back()->with('message', 'Proforma Updated Successfully');
        } catch (Exception $e) {
            FacadesLog::error($e->getMessage());
            return redirect()->back()->with('error', 'Failed to Update Proforma: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            $proforma = Proforma::findOrFail($id);

            $proforma->delete();

            return redirect()->back()->with('message', 'Proforma deleted successfully');
        } catch (ModelNotFoundException $e) {
            return redirect()->back() > with('error', 'Proforma not found');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete proforma');
        }
    }
}
