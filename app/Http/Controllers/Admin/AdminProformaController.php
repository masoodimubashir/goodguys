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
use Inertia\Inertia;


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

            return redirect()->route('clients.show', [$proforma_refrence->client_id])->with('message', 'Proforma Created Successfully');
        } catch (Exception $e) {
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
                'proformas',
                'client' => fn ($query) => $query->with('serviceCharge'),
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
        try {

            DB::beginTransaction();

            $data = $request->validated();

            $proformaReference = ProformaRefrence::findOrFail($id);


            $incomingItemIds = collect($data['items'])->pluck('id')->filter()->all();

            Proforma::where('proforma_refrence_id', $proformaReference->id)
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
                    // Update existing proforma item
                    Proforma::where('id', $item['id'])->update([
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
                    // Create new proforma item
                    Proforma::create([
                        'proforma_refrence_id' => $proformaReference->id,
                        'item_name' => $item['name'],
                        'description' => $item['description'],
                        'additional_description' => json_encode($itemDimensions),
                        'count' => $item['quantity'],
                        'price' => $item['price'],
                        'tax' => $data['tax'] ?? 0,
                        'service_charge' => $data['service_charge'] ?? 0,
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('clients.show', [$proformaReference->client_id])->with('message', 'Proforma Updated Successfully');
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to Update Proforma: ' . $e->getMessage());
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
