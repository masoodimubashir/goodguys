<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientAccountRequest;
use App\Models\ClientAccount;
use App\Models\PurchasedItem;
use Exception;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log as FacadesLog;

class AdminClientAccountController extends Controller
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
    public function store(StoreClientAccountRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {

                $validatedData = $request->validated();

                $account = ClientAccount::create([
                    "client_id" => $validatedData["client_id"],
                    "payment_type" => $validatedData["payment_type"],
                    "payment_flow" => $validatedData['payment_flow'] === 'in' ? true : false,
                    "amount" => $validatedData["amount"],
                    "narration" => $validatedData["narration"],
                ]);


                PurchasedItem::create([
                    'client_id' => $validatedData["client_id"],
                    'unit_type' => $validatedData['payment_flow'],
                    'description' => $validatedData["payment_type"],
                    'qty' => 1,
                    'price' => $validatedData["amount"],
                    'narration' => $validatedData["narration"],
                    'total' => $validatedData["amount"],
                    'created_by' => auth()->id(),
                ]);

            });

            return redirect()->back()->with('message', 'Payment Done');
        } catch (Exception $e) {
            FacadesLog::error($e->getMessage());
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
