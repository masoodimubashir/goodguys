<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use App\Models\Vendor;
use Inertia\Inertia;

class AdminVendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Vendor/vendor", [
            'vendors' => Vendor::orderBy('vendor_name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Vendor/CreateVendor');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVendorRequest $request)
    {
        $validated = $request->validated();


        Vendor::create(array_merge($validated, [
            'created_by' => auth()->user()->id,
        ]));

        return redirect()->route('vendor.index')
            ->with('message', 'Vendor created successfully');
    }



    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        $vendor = Vendor::with(['purchaseLists' => function ($list) {
            $list->with(['client' => function ($client) {
                $client->with([
                    'serviceCharge',
                    'clientAccounts'
                ]);
            }])->paginate(10); // Add pagination here
        }])->findOrFail($id);

        $groupedPurchaseLists = $vendor->purchaseLists->groupBy('client_id');

        // Append client account totals (in/out) to each client
        $groupedPurchaseLists->transform(function ($lists) {
            $client = $lists->first()->client;

            $client_id = $client->id;

            $clientAccountInTotal = \App\Models\ClientAccount::where([
                ['client_id', '=', $client_id],
                ['payment_flow', '=', 1]
            ])->sum('amount');

            $clientAccountOutTotal = \App\Models\ClientAccount::where([
                ['client_id', '=', $client_id],
                ['payment_flow', '=', 0]
            ])->sum('amount');

            $client->clientAccountInTotal = $clientAccountInTotal;
            $client->clientAccountOutTotal = $clientAccountOutTotal;

            return $lists;
        });

        return Inertia::render('PurchasedProduct/PurchasedProduct', [
            'vendor' => $vendor,
            'groupedPurchaseLists' => $groupedPurchaseLists,
            'purchaseListsPagination' => $vendor->purchaseLists()->paginate(10), 
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $vendor = Vendor::findOrFail($id);

        return Inertia::render('Vendor/EditVendor', [
            'vendor' => $vendor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    // app/Http/Controllers/Admin/AdminVendorController.php

    public function update(UpdateVendorRequest $request, Vendor $vendor)
    {
        $validated = $request->validated();

        $vendor->update(array_merge($validated, [
            'updated_by' => auth()->user()->id,
        ]));

        return redirect()->route('vendor.index')->with('message', 'Vendor updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $vendor = Vendor::findOrFail($id);


        $vendor->delete();

        return redirect()->route('vendor.index')
            ->with('message', 'Vendor deleted successfully');
    }
}
