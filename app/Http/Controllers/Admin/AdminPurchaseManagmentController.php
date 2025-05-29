<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseManagmentRequest;
use App\Http\Requests\UpdatePurchaseListRequest;
use App\Http\Requests\UpdatePurchaseManagmentRequest;
use App\Models\PurchaseList;
use App\Models\PurchaseManagment;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPurchaseManagmentController extends Controller
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseManagmentRequest $request)
    {
        $data = $request->validated();

        PurchaseManagment::create(array_merge($data, [
            'created_by' => auth()->user()->id
        ]));

        return redirect()->back()->with('message', 'Purchase created successfully');
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
    public function update(UpdatePurchaseManagmentRequest $request, string $id)
    {

        $data = $request->validated();

        $purchase = PurchaseManagment::find($id);

        $purchase->update(array_merge($data, [
            'updated_by' => auth()->user()->id
        ]));

        return redirect()->back()->with('message', 'Purchase updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $purchase = PurchaseManagment::find($id);

        $purchase->delete();

        return redirect()->back()->with('message', 'Purchase deleted successfully');
    }
}
