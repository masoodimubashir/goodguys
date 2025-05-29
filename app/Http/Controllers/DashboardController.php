<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Inventory;
use App\Models\PurchasedProduct;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {

        $clients = Client::orderBy('client_name');

        return Inertia::render('Dashboard', [
            'clients' => $clients->get(),
            'total_service_client_revenue' => PurchasedProduct::with('returnLists')->get()->reduce(function ($carry, $product) {
                $purchaseTotal = $product->unit_count * $product->price;
                $returnTotal = $product->returnLists->sum(function ($return) use ($product) {
                    return $return->unit_count * $product->price;
                });
                return $carry + ($purchaseTotal - $returnTotal);
            }, 0),
            'total_product_client_revenue' => '',
            'total_clients' => $clients->count(),
            'total_inventory_items' => Inventory::count(),
            'users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'client');
            })->get(),
        ]);
    }
}
