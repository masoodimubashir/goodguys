<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Inventory;
use App\Models\PurchasedProduct;
use App\Models\PurchaseList;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {

        $clients = Client::orderBy('client_name');

        return Inertia::render('Dashboard', [
            'clients' => $clients->get(),
            'total_service_client_revenue' => PurchaseList::with([
                'purchaseManagments',
                'returnLists',
            ])->get()->reduce(function ($carry, $purchaseList) {
                $totalPurchaseAmount = $purchaseList->purchaseManagments->sum('amount');
                $totalReturnAmount = $purchaseList->returnLists->sum('price');

                return $carry + ($totalPurchaseAmount - $totalReturnAmount);
            }, 0),
            'total_clients' => $clients->count(),
            'total_vendors' => Vendor::count(),
            'total_inventory_items' => Inventory::count(),
            'users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'client');
            })->get(),
        ]);
    }
}
