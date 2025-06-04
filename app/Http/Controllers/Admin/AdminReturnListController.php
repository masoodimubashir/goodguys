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

            ReturnList::create(array_merge($validated, [
                'created_by' => auth()->id(),
            ]));

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

            $returnList->update(array_merge($validated, [
                'updated_by' => auth()->id(),
            ]));

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
