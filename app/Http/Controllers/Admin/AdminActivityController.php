<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminActivityController extends Controller
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
    public function store(StoreActivityRequest $request)
    {
        try {
            
            $data = $request->validated();


             Activity::create([
                'client_id' => $data['client_id'],
                'unit_type' => $data['unit_type'],
                'description' => $data['description'],
                'qty' => $data['qty'],
                'price' => $data['price'],
                'narration' => $data['narration'],
                'total' => $data['total'],
                'created_at' => $data['created_at'],
                'multiplier' => $data['multiplier'],
                'created_by' => auth()->user()->id,
                'payment_flow' => false,
            ]);

            return redirect()->back()->with('success', 'Activity created successfully');


        } catch (\Exception $e) {
            Log::error($e->getMessage());
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
