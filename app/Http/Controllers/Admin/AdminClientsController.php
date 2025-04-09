<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\Module;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminClientsController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Client', [
            'clients' => Client::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/CreateClient');
    }

    public function store(StoreClientRequest $request)
    {
        try {

            Client::create(array_merge($request->validated(), [
                'created_by' => auth()->id(),
            ]));

            return redirect()->route('clients.index')->with('message', 'Client Created');
        } catch (Exception $e) {
            return redirect()->route('clients.index')
                ->with('error', 'Failed to create client');
        }
    }

    public function show(Client $client)
    {

        $client->load([
            'invoiceRefrences' => fn($query) => $query->with('invoices'),
            'proformaRefrences' => fn($query) => $query->with('proformas'),
            'accounts'
        ]);

        return Inertia::render('Clients/ShowClient', [
            'client' => $client,
            'modules' => Module::latest()->get(),
            'inventoryOptions' => Inventory::latest()->get(),
        ]);
    }

    public function edit(Client $client)
    {
        return Inertia::render('Clients/EditClient', [
            'client' => $client
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        try {
            $client->update($request->validated() + ['updated_by' => auth()->user()->id]);

            return redirect()->route('clients.index')->with('message', 'Client Updated');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update client');
        }
    }

    public function destroy(Client $client)
    {
        try {
            $client->delete();

            return redirect()->route('clients.index')
                ->with('message', 'Client Deleted');
        } catch (Exception $e) {
            return redirect()->route('clients.index')
                ->with('error', 'Failed to delete client');
        }
    }
}
