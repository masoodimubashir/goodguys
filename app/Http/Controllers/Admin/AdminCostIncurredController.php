<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCostIncurredRequest;
use App\Http\Requests\UpdateCostIncurredRequest;
use App\Models\CostIncurred;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AdminCostIncurredController extends Controller
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
    public function store(StoreCostIncurredRequest $request)
    {
        try {

            $validatedData = $request->validated();

            $validatedData['created_by'] = auth()->user()->id;

             // Handle file upload
             if ($request->hasFile('bill')) {
                // Delete old file if needed
                Storage::disk('public')->delete($purchaseList->bill);
                $validated['bill'] = $request->file('bill')->store('purchase-lists', 'public');
            }

            CostIncurred::create($validatedData);

            return redirect()->back()->with('message', 'Cost incurred created successfully');
        } catch (Exception $e) {

            return redirect()->back()->with('error', 'Something went wrong');
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
    public function update(UpdateCostIncurredRequest $request, string $id)
    {
        try {

            $validatedData = $request->validated();

            $cost_incurred = CostIncurred::find($id);

            if (!$cost_incurred) {
                throw new Exception('Record not found', 404);
            }

            $validatedData['updated_by'] = auth()->user()->id;

            $cost_incurred->update($validatedData);

            return redirect()->back()->with('message', 'Cost incurred updated successfully');

        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', 'Record not found');
        } catch (Exception $e) {

            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {

            $cost_incurred = CostIncurred::find($id);


            if (!$cost_incurred) {
                throw new Exception(' record not found', 404);
            }

            $cost_incurred->delete();

            return redirect()->back()->with('message', 'Record Deleted');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', 'Record not found');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete Record');
        }
    }
}
