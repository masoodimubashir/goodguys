<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseListRequest;
use App\Http\Requests\UpdatePurchaseListRequest;
use App\Models\PurchaseList;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminPurchaseListController extends Controller
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
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseListRequest $request)
    {
        try {

            $validated = $request->validated();

            if ($request->hasFile('bill')) {
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            }

            PurchaseList::create($validated);

            return redirect()->back()->with('message', 'Purchase list created successfully');
        } catch (\Throwable $e) {
            Log::error('Error creating purchase list: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Failed to create purchase list');
        }
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $search = request('search');

        $purchaseList = PurchaseList::with([
            'purchasedProducts' => function ($query) use ($search) {
                $query->when($search, function ($query) use ($search) {
                    $query->where('product_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                    ->with(['returnLists']);
            },
            'client' => with(['serviceCharge']),
        ])
            ->findOrFail($id);

        return Inertia::render('PurchasedProduct/PurchasedProduct', [
            'purchaseList' => $purchaseList,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // app/Http/Controllers/Admin/AdminPurchaseListController.php

    public function update(UpdatePurchaseListRequest $request, PurchaseList $purchaseList)
    {
        try {
            $validated = $request->validated();

            // Handle file upload
            if ($request->hasFile('bill')) {
                // Delete old file if needed
                Storage::disk('public')->delete($purchaseList->bill);
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            }

            $purchaseList->update($validated);

            return redirect()->back()->with('message', 'Purchase list updated successfully');
        } catch (\Throwable $e) {
            Log::error('Error updating purchase list: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update purchase list');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            $purchaseList = PurchaseList::findOrFail($id);

            $purchaseList->delete();

            return redirect()->back()->with('message', 'Purchase list deleted successfully');
        } catch (Exception $e) {

            return redirect()->back()->with('error', 'Failed to delete purchase list');
        }
    }
}
