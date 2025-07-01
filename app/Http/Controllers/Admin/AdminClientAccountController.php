<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientAccountRequest;
use App\Http\Requests\UpdateClientAccountRequest;
use App\Http\Requests\UpdateClientRequest;
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

                $activity = Activity::create([
                    'client_id' => $validatedData["client_id"],
                    'description' => $validatedData["payment_type"],
                    'qty' => 1,
                    'price' => $validatedData["amount"],
                    'narration' => $validatedData["narration"],
                    'total' => $validatedData["amount"],
                    'created_by' => auth()->id(),
                    'multiplier' => 1,
                    'created_at' => Carbon::parse($validatedData['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                    'payment_flow' => $payment_flow,
                    'model_type' => ClientAccount::class,
                ]);

                PaymentDeleteRefrence::create([
                    'purchased_item_id' => $purchase->id,
                    'refrence_id' => $client->id,
                    'refrence_type' => ClientAccount::class,
                    'activity_id' => $activity->id,
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
    public function update(UpdateClientAccountRequest $request, string $id)
    {
        try {

            DB::beginTransaction();
            // Get validated data from the form request
            $validated = $request->validated();

            $activity = Activity::find($id);

            $activity->update([
                'description' => $validated['description'],
                'unit_type' => $validated['description'],
                'qty' => 1,
                'price' => $validated['amount'],
                'narration' => $validated['narration'],
                'total' => $validated['amount'],
                'created_at' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'multiplier' => 1,
                'updated_by' => auth()->user()->id,
                'model_type' => ClientAccount::class,
            ]);

            $paymentRef = PaymentDeleteRefrence::where('activity_id', $activity->id)
                ->where('refrence_type', ClientAccount::class)
                ->first();

            ClientAccount::find($paymentRef->refrence_id)->update([
                "payment_type" => $validated["description"],
                "amount" => $validated["amount"],
                "narration" => $validated["narration"],
                'created_at' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
            ]);

            PurchasedItem::find($paymentRef->purchased_item_id)->update([
                'unit_type' => $validated['description'],
                'narration' => $validated['narration'],
                'description' => $validated['description'],
                'price' => $validated['amount'],
                'total' => $validated['amount'],
                'created_at' => Carbon::parse($validated['created_at'])->setTimeFromTimeString(now()->format('H:i:s')),
                'updated_by' => auth()->user()->id,
            ]);

            DB::commit();

            return redirect()->back()->with('message', 'record updated..');

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating clinet account: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to update client account: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
