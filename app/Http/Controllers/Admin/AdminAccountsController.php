<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use App\Models\Inventory;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AdminAccountsController extends Controller
{
    /**
     * Display a listing of Accounts.
     */
    public function index()
    {
        return Inertia::render('Accounts/Account', [
            'accounts' => Account::with('inventory')->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new Account.
     */
    public function create()
    {

        return Inertia::render('Accounts/CreateAccount', [
            'inventories' => Inventory::latest()->get(),
        ]);
    }

    /**
     * Store a newly created Account in storage.
     */
    public function store(StoreAccountRequest $request)
    {
        try {

            $validatedData = $request->validated();

            Account::create(array_merge($validatedData, [
                'created_by' => auth()->id(),
            ]));

            return redirect()->back()->with('message', 'Account Recorded');
            
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Failed to record Account');
        }
    }

    /**
     * Show the form for editing a Account.
     */
    public function edit($id)
    {
        return Inertia::render('Accounts/Edit', [
            'account' => Account::find($id),
            'inventories' => Inventory::latest()->get(),
        ]);
    }

    /**
     * Update the specified Account in storage.
     */
    public function update(UpdateAccountRequest $request, $id)
    {
        try {

           $account = Account::find($id);

            if (!$account) {
                throw new Exception('Account record not found', 404);
            }

            $profit = ($request->selling_price - $request->buying_price) * $request->count;

           $account->update([
                'inventory_id' => $request->inventory_id,
                'item_name' => $request->item_name,
                'selling_price' => $request->selling_price,
                'buying_price' => $request->buying_price,
                'count' => $request->count,
                'profit' => $profit,
                'updated_by' => auth()->id(),
                'description' => $request->description,
            ]);

            return redirect()->back()->with('message', 'Account Updated');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update Account');
        }
    }




    /**
     * Remove the specified Account from storage.
     */
    public function destroy($id)
    {
        try {

            $account = Account::find($id);

            if (!$account) {
                throw new Exception('Account record not found', 404);
            }

            $account->delete();

            return redirect()->back()->with('message', 'Account Deleted');
            
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', 'Account not found');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete Account');
        }
    }
}
