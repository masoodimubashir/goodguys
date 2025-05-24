<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseListRequest;
use App\Http\Requests\StorePurchaseProductRequest;
use App\Models\PurchasedProduct;
use Illuminate\Http\Request;

class AdminPurchasedProductController extends Controller
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseProductRequest $request)
    {

        try {


            PurchasedProduct::create([
                'purchase_list_id' => $request->purchase_list_id,
                'product_name' => $request->product_name,
                'price' => $request->price,
                'unit_count' => $request->unit_count,
                'description' => $request->description,
                'created_by' => auth()->id(),
            ]);

            return redirect()->back()->with('message', 'Product added.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, PurchasedProduct $purchasedProduct)
    {

        try {

            $request->validate([
                'product_name' => 'required|string',
                'price' => 'required|numeric',
                'unit_count' => 'required|integer',
                'description'=> 'required|string',
            ]);

            $purchasedProduct->update([
                'product_name' => $request->product_name,
                'price' => $request->price,
                'unit_count' => $request->unit_count,
                'description' => $request->description,
                'updated_by' => auth()->id(),
            ]);

            return redirect()->back()->with('message', 'Product updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update product');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchasedProduct $purchasedProduct)
    {

        try {
            $purchasedProduct->delete();
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete product');
        }
    }
}
