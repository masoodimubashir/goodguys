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
            'vendors' => Vendor::orderBy('vendor_name')->paginate(10),
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
        // Load vendor with relationships
        $vendor = Vendor::with([
            'purchaseLists.client', // Load client with each purchase list
            'purchaseLists.returnLists', // Load return lists for each purchase list
            'purchaseListPayments' // Load payments made by this vendor
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
