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
    public function create()
    {
        return Inertia::render('BankAccount/CreateBankAccount', [
            'bankAccount' => BankAccount::first(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBankAccountRequest $request)
    {
        try {
            $validated = $request->validated();

            $imageFields = ['signature_image', 'company_stamp_image', 'qr_code_image'];

            foreach ($imageFields as $field) {
                if ($request->hasFile($field)) {
                    $validated[$field] = $request->file($field)->store('bank-accounts', 'public');
                }
            }

            $validated['created_by'] = auth()->id();

            BankAccount::create($validated);

            return redirect()
                ->back()
                ->with('success', 'Bank Account created successfully.');
        } catch (Exception $e) {
            Log::error('BankAccount Store Error: ' . $e->getMessage());
            return redirect()
                ->back()
                ->withErrors(['server_error' => 'Something went wrong while creating the record.'])
                ->withInput();
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

    public function update(UpdateBankAccountRequest $request, string $id)
    {
        try {
            $validated = $request->validated();

            $bankAccount = BankAccount::find($id);


            if (!$bankAccount) {
                throw new NotFoundHttpException('Record Not Found');
            }

            // Image fields to check
            $imageFields = ['signature_image', 'company_stamp_image', 'qr_code_image'];

            foreach ($imageFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete old file if it exists
                    if ($bankAccount->$field && Storage::disk('public')->exists($bankAccount->$field)) {
                        Storage::disk('public')->delete($bankAccount->$field);
                    }
                    // Store new file and update value
                    $validated[$field] = $request->file($field)->store('bank-accounts', 'public');
                } else {
                    // Prevent overwriting with null if no file uploaded
                    unset($validated[$field]);
                }
            }

            $validated['updated_by'] = auth()->id();

            $bankAccount->update($validated);

            return redirect()
                ->route('clients.show', $bankAccount->client_id)
                ->with('message', 'Bank Account updated successfully.');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', 'Record not found');
        } catch (\Exception $e) {
            Log::error('BankAccount Update Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong while updating the record.');
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
