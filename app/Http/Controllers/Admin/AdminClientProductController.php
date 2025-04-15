<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\ClientProduct;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminClientProductController extends Controller
{

    public function index()
    {
        return Inertia::render('ClientProduct/ClientProducts', [
            'clients' => ClientProduct::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('ClientProduct/CreateClientProduct');
    }

    public function store(StoreClientRequest $request)
    {
        try {

            ClientProduct::create(array_merge($request->validated(), [
                'created_by' => auth()->id(),
            ]));

            return redirect()->route('client-product.index')->with('message', 'Client Created');
        } catch (Exception $e) {
            return redirect()->route('client-product.index')
                ->with('error', 'Failed to create client');
        }
    }

    public function show(ClientProduct $clientprofuct)
    {

        // Note: This has to be implemented in the future
        $clientprofuct->load([
            'invoiceRefrences' => fn($query) => $query->with('invoices'),
            'proformaRefrences' => fn($query) => $query->with('proformas'),
            'accounts'
        ]);

        return Inertia::render('ClientProduct/ShowClient', [
            'client' => $clientprofuct,
            'modules' => Module::latest()->get(),
            'inventoryOptions' => Inventory::latest()->get(),
        ]);
    }

    public function edit(ClientProduct $client_product)
    {

        return Inertia::render('ClientProduct/EditClientProduct', [
            'client_product' => $client_product
        ]);
    }

    public function update(UpdateClientRequest $request, ClientProduct $client_product)
    {
        try {

            $client_product->update($request->validated() + [
                'updated_by' => auth()->user()->id
            ]);

            return redirect()->route('client-product.index')->with('message', 'Client Product Updated');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update client');
        }
    }

    public function destroy(ClientProduct $client_product)
    {
        try {

            $client_product->delete();

            return redirect()->route('client-product.index')->with('message', 'Client Product Deleted');

        } catch (Exception $e) {
            return redirect()->route('client-product.index')->with('error', 'Failed to delete client product');
        }
    }
}
