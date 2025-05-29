<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChallanRequest;
use App\Http\Requests\UpdateChallanRequest;
use App\Models\Challan;
use App\Models\ChallanRefrence;
use App\Models\Client;
use App\Models\CompanyProfile;
use App\Models\PurchasedProduct;
use App\Models\PurchaseList;
use App\Models\ReturnList;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;;

use Inertia\Inertia;

class AdminChallanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreChallanRequest $request)
    {


        $validated = $request->validated();

        DB::beginTransaction();


        try {
            // Create Challan Reference
            $challanReference = ChallanRefrence::create([
                'purchase_list_id' => $validated['purchase_list_id'],
                'service_charge' => $validated['service_charge'],
                'challan_number' => uniqid('CH'),
            ]);

            // Create Challan Items
            $challanItems = [];
            foreach ($validated['challan'] as $item) {
                $challanItems[] = [
                    'challan_refrence_id' => $challanReference->id,
                    'item_name' => $item['item_name'],
                    'price' => $item['price'],
                    'unit_count' => $item['unit_count'],
                    'description' => $item['description'],
                    'is_price_visible' => $item['is_price_visible'],
                    'created_by' => auth()->user()->id,
                    'created_at' => now(),
                ];
            }

            // Bulk insert for better performance
            Challan::insert($challanItems);

            DB::commit();

            return redirect()->route('clients.show', $validated['client_id'])->with('success', 'Challan created successfully.');
        } catch (\Exception $e) {

            Log::error($e->getMessage());
            DB::rollBack();

            return redirect()->back()->with('error', 'Failed to create Challan. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product_list = PurchaseList::with([
            'ChallanRefrences' => function ($query) {
                $query->with(['challans']);
            },
            'client'
        ])->find($id);


        return Inertia::render("Challan/ViewChallans", [
            'product_list' => $product_list,
            'company_profile' => CompanyProfile::first()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {

            $challan_ref = ChallanRefrence::with([
                'challans',
                'purchaseList' => fn($list) => $list->with('purchasedProducts.returnLists'),
            ])->findOrFail($id);

            return Inertia::render('Challan/EditChallan', [
                'purchaseData' => $challan_ref,
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Invoice not found');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateChallanRequest $request, $id)
    {
        $validated = $request->validated();

        $challan_ref = ChallanRefrence::findOrFail($id);

        if (isset($validated['purchase_list']['purchased_products'])) {
            $this->syncChallanItems($challan_ref, $validated['purchase_list']['purchased_products']);
        }

        return redirect()->route('challan.show', $challan_ref->purchaseList->id)->with('success', 'Challan updated successfully.');
    }





    private function syncChallanItems($challan_ref, $products)
    {
        // Delete existing items for this challan reference
        Challan::where('challan_refrence_id', $challan_ref->id)->delete();

        foreach ($products as $product) {
            // Sum all returned units
            $returnedUnits = collect($product['return_lists'] ?? [])->sum('unit_count');

            // Calculate net unit count
            $netUnitCount = $product['unit_count'] - $returnedUnits;

            // Skip if nothing remains
            if ($netUnitCount <= 0) {
                continue;
            }

            // Create Challan item
            Challan::create([
                'challan_refrence_id' => $challan_ref->id,
                'item_name' => $product['product_name'],
                'unit_count' => $netUnitCount,
                'price' => $product['price'],
                'description' => $product['description'],
                'is_price_visible' => true, // or set based on input
                'created_by' => auth()->id(),
            ]);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            $challan = ChallanRefrence::findOrFail($id);

            $challan->delete();

            return redirect()->back()->with('success', 'Challan deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete Challan. Please try again.');
        }
    }


    public function createChallanPdf($id) {}
}
