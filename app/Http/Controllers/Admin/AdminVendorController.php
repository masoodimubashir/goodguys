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
        $search = request('search');
        $startDate = request('start_date');
        $endDate = request('end_date');

        $Vendor = Vendor::with([
            'purchasedProducts' => function ($query) use ($search, $startDate, $endDate) {
                $query->when($search, function ($query) use ($search) {
                    $query->where('product_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                    ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                        $query->whereBetween('created_at', [$startDate, $endDate]);
                    })
                    ->with(['returnLists']);
            },
            'client' => function ($query) {
                $query->with(['serviceCharge']);
            },
        ])
            ->findOrFail($id);


        return Inertia::render('PurchasedProduct/PurchasedProduct', [
            'Vendor' => $Vendor,
            'filters' => [
                'search' => $search,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
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
