<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
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

        return redirect()->route('client-vendor.show', $vendor->id)
            ->with('message', 'Party created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {


        DB::enableQueryLog();


        // Load vendor with necessary relationships in one query
        $vendor = Vendor::with([
            'purchaseLists.client',
            'purchaseLists.returnLists',
            'purchaseListPayments' => function ($query) {
                $query->select('id', 'client_id', 'vendor_id', 'amount');
            }
        ])->findOrFail($id);

        // Get all purchase lists (already loaded via eager loading)
        $purchaseLists = $vendor->purchaseLists;

        // Calculate payments by client using collection methods
        $paymentsByClient = $vendor->purchaseListPayments
            ->groupBy('client_id')
            ->map(fn($payments) => $payments->sum('amount'));

        // Group purchase lists by client using collection
        $groupedPurchaseLists = $purchaseLists->groupBy('client_id');

        // Build client accounts
        $clientAccounts = [];

        foreach ($groupedPurchaseLists as $clientId => $lists) {
            $client = $lists->first()->client;

            $totalPurchases = $lists->sum('bill_total');
            $totalReturns = $lists->flatMap->returnLists->sum('price');
            $totalPayments = $paymentsByClient[$clientId] ?? 0;
            $balance = ($totalPurchases - $totalReturns) - $totalPayments;

            $clientAccounts[$clientId] = [
                'client' => $client,
                'total_purchases' => $totalPurchases,
                'total_returns' => $totalReturns,
                'total_payments' => $totalPayments,
                'balance' => $balance,
                'purchase_lists' => $lists,
            ];
        }

        // Paginate the already loaded purchase lists for display
        $paginatedPurchaseLists = new \Illuminate\Pagination\LengthAwarePaginator(
            $purchaseLists->forPage(request('page', 1), 10),
            $purchaseLists->count(),
            10,
            request('page', 1),
            ['path' => request()->url()]
        );

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
