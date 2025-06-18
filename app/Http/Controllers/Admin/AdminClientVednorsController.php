<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use App\Models\Vendor;
use Inertia\Inertia;

class AdminClientVednorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("ClientVendors/clientVendor", [
            'vendors' => Vendor::orderBy('vendor_name')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ClientVendors/CreateClientVendor');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVendorRequest $request)
    {
        $validated = $request->validated();


        $vendor = Vendor::create(array_merge($validated, [
            'created_by' => auth()->user()->id,
        ]));

        return redirect()->route('client-vendor.show', $vendor->id )
            ->with('message', 'Party created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Load vendor with relationships
        $vendor = Vendor::with([
            'purchaseLists.client',
            'purchaseLists.returnLists',
            'purchaseListPayments'
        ])->findOrFail($id);

        // Get paginated purchase lists separately to avoid N+1 issues
        $paginatedPurchaseLists = $vendor->purchaseLists()->with(['client', 'returnLists'])->paginate(10);

        // Group all purchase lists by client for calculations
        $groupedPurchaseLists = $vendor->purchaseLists->groupBy('client_id');

        // Calculate totals for each client
        $clientAccounts = [];

        foreach ($groupedPurchaseLists as $clientId => $lists) {
            $client = $lists->first()->client;

            // Calculate total purchases (amount vendor owes client)
            $totalPurchases = $lists->sum('bill_total');

            // Calculate total returns (reduces amount vendor owes)
            $totalReturns = $lists->flatMap(function ($purchaseList) {
                return $purchaseList->returnLists;
            })->sum('price');

            // Calculate total payments (amount vendor has paid to client)
            $totalPayments = $vendor->purchaseListPayments
                ->where('client_id', $clientId)
                ->sum('amount');

            // Calculate current balance (positive means vendor owes client)
            $balance = ($totalPurchases - $totalReturns) - $totalPayments;

            $clientAccounts[$clientId] = [
                'client' => $client,
                'total_purchases' => $totalPurchases,
                'total_returns' => $totalReturns,
                'total_payments' => $totalPayments,
                'balance' => $balance,
                'purchase_lists' => $lists
            ];
        }

        return Inertia::render('PurchasedProduct/PurchasedProduct', [
            'vendor' => $vendor,
            'clientAccounts' => $clientAccounts,
            'purchaseListsPagination' => $paginatedPurchaseLists,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $vendor = Vendor::findOrFail($id);

        return Inertia::render('ClientVendors/EditClientVendor', [
            'vendor' => $vendor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVendorRequest $request, string $id)
    {
        $validated = $request->validated();

        $vendor = Vendor::findOrFail($id);

        $vendor->update(array_merge($validated, [
            'updated_by' => auth()->user()->id,
        ]));

        return redirect()->route('client-vendor.show', $vendor->id)->with('message', 'Party updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $vendor = Vendor::findOrFail($id);


        $vendor->delete();

        return redirect()->route('client-vendor.index')
            ->with('message', 'Party deleted successfully');
    }
}
