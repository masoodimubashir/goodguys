<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBankAccountRequest;
use App\Http\Requests\UpdateBankAccountRequest;
use App\Models\BankAccount;
use App\Models\Client;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AdminBankAccountController extends Controller
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
        return Inertia::render('BankAccount/CreateBankAccount', [
            'client' => Client::findOrFail($request->get('client_id')),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBankAccountRequest $request)
    {
        DB::beginTransaction();

        try {


            $validatedData = $request->validated();

            // Handle file uploads
            if ($request->hasFile('qr_code_image')) {
                $validatedData['qr_code_image'] = $request->file('qr_code_image')->store('BankAccount/qr_codes', 'public');
            }

            if ($request->hasFile('signiture_image')) {
                $validatedData['signiture_image'] = $request->file('signiture_image')->store('BankAccount/signitures', 'public');
            }

            if ($request->hasFile('company_stamp_image')) {
                $validatedData['company_stamp_image'] = $request->file('company_stamp_image')->store('BankAccount/stamps', 'public');
            }

            // Create the bank account record
            BankAccount::create(array_merge($validatedData, [
                'created_by' => auth()->id(),
            ]));

            DB::commit();

            return redirect()->route('clients.show', [$validatedData['client_id']])
                ->with('message', 'Account Created Successfully');
        } catch (Exception $e) {


            DB::rollBack();

            return redirect()->back()->with('error', 'Failed to create Account.');
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
        try {

            $bank_account = BankAccount::find($id);

            if (!$bank_account) {
                throw new Exception('Record not found', 404);
            }

            return Inertia::render('BankAccount/EditBankAccount', [
                'bankAccount' => $bank_account
            ]);
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', 'Record not found');
        } catch (Exception $e) {

            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBankAccountRequest $request, string $id)
    {
        try {
            $validated = $request->validated();

            $bankAccount = BankAccount::find($id);

            if (!$bankAccount) {
                throw new Exception('Record Not Found');
            }

            // Image fields to check
            $imageFields = ['signature_image', 'company_stamp_image', 'qr_code_image'];

            foreach ($imageFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete old file if exists
                    if ($bankAccount->$field && Storage::disk('public')->exists($bankAccount->$field)) {
                        Storage::disk('public')->delete($bankAccount->$field);
                    }
                    // Upload and update field
                    $validated[$field] = $request->file($field)->store('bank-accounts', 'public');
                } else {
                    // If no new file uploaded, keep old file
                    unset($validated[$field]);
                }
            }

            // Add updated_by field
            $validated['updated_by'] = auth()->id();

            $bankAccount->update($validated);

            return redirect()->route('clients.show', $bankAccount->client_id)->with('message', 'Bank Account updated successfully.');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', 'Record not found');
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            
            $bankAccount = BankAccount::find($id);

            if (!$bankAccount) {
                throw new Exception('Record Not Found');
            }

            $bankAccount->delete();

            return redirect()->back()->with('message', 'Account Deleted');

        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', 'Record not found');
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }
}
