<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReturnListrequest;
use App\Http\Requests\UpdateReturnListrequest;
use App\Models\ReturnList;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminReturnListController extends Controller
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
    public function store(StoreReturnListrequest $request)
    {
        try {

            $validated = $request->validated();

            if ($request->hasFile('bill')) {
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            }

            ReturnList::create($validated);

            return redirect()->back()->with('message', 'Return list created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating return list: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create Return List');
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
    public function update(UpdateReturnListRequest $request, ReturnList $returnList)
    {
        try {
            // Get validated data from the form request
            $validated = $request->validated();

            // Handle file upload
            if ($request->hasFile('bill')) {
                // Delete old file if it exists
                if ($returnList->bill) {
                    Storage::disk('public')->delete($returnList->bill);
                }
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            } else {
                // Keep the existing bill if no new file was uploaded
                $validated['bill'] = $returnList->bill;
            }

            $returnList->update($validated);

            return redirect()->back()->with('message', 'Return updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update Return: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            $returnlist = ReturnList::findOrFail($id);

            $returnlist->delete();

            return redirect()->back()->with('message', 'Return list deleted successfully');
        } catch (\Exception $e) {

            return redirect()->back()->with('error', 'Failed to delete Return list');
        }
    }
}
