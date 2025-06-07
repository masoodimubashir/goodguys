<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\BankAccount;
use App\Models\Client;
use App\Models\CompanyProfile;
use App\Models\Inventory;
use App\Models\Module;
use App\Models\PurchasedItem;
use App\Models\ServiceCharge;
use App\Models\Vendor;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminClientsController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Client', [
            'clients' => Client::with('serviceCharge')->latest()->paginate(10),
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
                'invoices.invoiceModule',
            ]),
            'proformaRefrences' => fn($query) => $query->with([
                'proformas.proformaModule',
            ]),
            'purchaseLists.vendor',
            'accounts',
            'serviceCharge',
            'purchaseItems',
            'projectDocuments',
        ]);


        $clientVendorIds = $client->purchaseLists->pluck('vendor_id')->unique();

        $clientVendors = Vendor::whereIn('id', $clientVendorIds)->orderBy('vendor_name')->get();

        $purchase_items = PurchasedItem::where('client_id', $client->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        if ($client->client_type === 'Service Client') {

            return Inertia::render('Clients/ShowServiceClient', [
                'client' => $client,
                'client_vendors' => $clientVendors,
                'vendors' => Vendor::orderBy('vendor_name')->get(),
                'purchase_items' => $purchase_items,
                'BankProfile' => BankAccount::first(),
            ]);
        } else {

            return Inertia::render('Clients/ShowProductClient', [
                'client' => $client,
                'modules' => Module::latest()->get(),
                'inventoryOptions' => Inventory::latest()->get(),
                'company_profile' => CompanyProfile::first(),
                'vendors' => Vendor::orderBy('vendor_name')->get(),
                'purchase_items' => $purchase_items,
                'BankProfile' => BankAccount::first(),

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


            // dd($request->all());
            $data = $request->validated();

            $data['updated_by'] = auth()->id();

            if ($data['client_type'] === 'Service Client') {

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
