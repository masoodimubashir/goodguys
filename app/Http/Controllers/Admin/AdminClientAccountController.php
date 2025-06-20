<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientAccountRequest;
use App\Models\Activiity;
use App\Models\Activity;
use App\Models\ClientAccount;
use App\Models\PaymentDeleteRefrence;
use App\Models\PurchasedItem;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

                $payment_flow = $validatedData['payment_flow'] === true ? 1 : 0;

                $client = ClientAccount::create([
                    "client_id" => $validatedData["client_id"],
                    "payment_type" => $validatedData["payment_type"],
                    "amount" => $validatedData["amount"],
                    "narration" => $validatedData["narration"],
                    'created_at' => Carbon::parse($validatedData['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                    'payment_flow' => $payment_flow,
                ]);

                $purchase = PurchasedItem::create([
                    'client_id' => $validatedData["client_id"],
                    'description' => $validatedData["payment_type"],
                    'qty' => 1,
                    'price' => $validatedData["amount"],
                    'narration' => $validatedData["narration"],
                    'total' => $validatedData["amount"],
                    'created_by' => auth()->id(),
                    'multiplier' => 1,
                    'created_at' => Carbon::parse($validatedData['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                    'payment_flow' => $payment_flow
                ]);

                PaymentDeleteRefrence::create([
                    'purchased_item_id' => $purchase->id,
                    'refrence_id' => $client->id,
                    'refrence_type' => ClientAccount::class,

                ]);

                Activity::create([
                    'client_id' => $validatedData["client_id"],
                    'description' => $validatedData["payment_type"],
                    'qty' => 1,
                    'price' => $validatedData["amount"],
                    'narration' => $validatedData["narration"],
                    'total' => $validatedData["amount"],
                    'created_by' => auth()->id(),
                    'multiplier' => 1,
                    'created_at' => Carbon::parse($validatedData['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                    'payment_flow' => $payment_flow
                ]);
            });

            return redirect()->back()->with('message', 'Payment Done');
        } catch (Exception $e) {
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
