<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChallanRequest;
use App\Models\Challan;
use App\Models\ChallanRefrence;
use App\Models\Client;
use App\Models\PurchaseList;
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
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

       
    }

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

            // dd($challanReference);

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
            }
        ])->find($id);

        return Inertia::render("Challan/ViewChallans", [
            'product_list' => $product_list,
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
