<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use App\Models\CompanyProfile;
use App\Models\Inventory;
use App\Models\Module;
use App\Models\ServiceCharge;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminClientsController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Client', [
            'clients' => Client::with('serviceCharge')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/CreateClient');
    }

    public function store(StoreClientRequest $request)
    {

        try {

            DB::beginTransaction();

            $validatedData = $request->validated();

            $client = Client::create(array_merge($validatedData, [
                'created_by' => auth()->id(),
            ]));

            if (isset($validatedData['service_charge'])) {
                ServiceCharge::create([
                    'client_id' => $client->id,
                    'service_charge' => $validatedData['service_charge'],
                    'created_by' => auth()->id(),
                ]);
            }

            DB::commit();
            return redirect()->route('clients.index')->with('message', 'Client Created Successfully');
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->route('clients.index')
                ->with('error', 'Failed to create client. Please try again.');
        }
    }

    public function show(Client $client)
    {

        $client->load([
            'invoiceRefrences' => fn($query) => $query->with([
                'products' => fn($query) => $query->with('invoices'),
            ]),
            'proformaRefrences' => fn($query) => $query->with([
                'products' => fn($query) => $query->with('proformas'),
            ]),
            'purchaseLists' => fn($query) => $query->with(['returnLists']),
            'costIncurreds',
            'accounts',
            'serviceCharge',
            'bankAccount'
        ]);



        if ($client->client_type === 'Service Client') {
            return Inertia::render('Clients/ShowServiceClient', [
                'client' => $client,
                'modules' => Module::latest()->get(),
                'inventoryOptions' => Inventory::latest()->get(),
                'company_profile' => CompanyProfile::first()

            ]);
        } else {
            return Inertia::render('Clients/ShowProductClient', [
                'client' => $client,
                'modules' => Module::latest()->get(),
                'inventoryOptions' => Inventory::latest()->get(),
                'company_profile' => CompanyProfile::first()

            ]);
        }
    }

    public function edit(Client $client)
    {


        return Inertia::render('Clients/EditClient', [
            'client' => $client->load('serviceCharge'),
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        try {


            $data = $request->validated();

            $data['updated_by'] = auth()->id();

            if ($data['client_type'] === 'SERVICE') {

                $serviceChargeValue = $data['service_charge'] ?? null;
                unset($data['service_charge']);

                if ($serviceChargeValue !== null) {
                    $client->serviceCharge()->updateOrCreate(
                        ['client_id' => $client->id],
                        ['service_charge' => $serviceChargeValue]
                    );
                }
            } else {
                unset($data['service_charge']);

                $client->serviceCharge()->delete();
            }

            // Update client details
            $client->update($data);

            return redirect()->route('clients.index')->with('message', 'Client Updated');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update client');
        }
    }



    public function destroy(Client $client)
    {
        try {
            $client->delete();

            return redirect()->route('clients.index')->with('message', 'Client Deleted');
        } catch (Exception $e) {
            return redirect()->route('clients.index')->with('error', 'Failed to delete client');
        }
    }
}
