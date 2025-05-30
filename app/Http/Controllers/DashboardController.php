<?php

namespace App\Http\Controllers;

use App\Models\ChallanRefrence;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\PurchasedItem;
use App\Models\PurchasedProduct;
use App\Models\PurchaseList;
use App\Models\PurchaseManagment;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $clients = Client::with(['purchaseLists.purchaseManagments', 'purchaseLists.returnLists'])
            ->orderBy('client_name')
            ->get();

        // Recent purchases (last 5)
        $recentPurchases = PurchaseList::with(['vendor', 'client'])
            ->latest()
            ->take(5)
            ->get();

        // Recent challans (last 5)
        $recentChallans = ChallanRefrence::with(['client', 'challans'])
            ->latest()
            ->take(5)
            ->get();

        // Revenue trend data (last 30 days)
        $revenueTrend = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $revenue = PurchaseManagment::whereDate('transaction_date', $date)
                ->sum('amount');

            $revenueTrend[] = [
                'date' => $date,
                'Revenue' => $revenue,
            ];
        }


        return Inertia::render('Dashboard', [
            'clients' => $clients,
            'total_service_client_revenue' => $clients->reduce(function ($carry, $client) {
                $revenue = $client->purchaseLists->reduce(function ($sum, $purchase) {
                    $purchaseAmount = $purchase->purchaseManagments->sum('amount');
                    $returnAmount = $purchase->returnLists->sum('price');
                    return $sum + ($purchaseAmount - $returnAmount);
                }, 0);
                return $carry + $revenue;
            }, 0),
            'total_clients' => $clients->count(),
            'total_vendors' => Vendor::count(),
            'total_inventory_items' => PurchasedItem::count(),
            'users' => User::whereHas('roles', fn($query) => $query->where('name', 'client'))
                ->with('client')
                ->get()
                ->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->client->client_phone ?? '',
                    'site_name' => $user->client->site_name ?? '',
                    'client_type' => $user->client->client_type ?? '',
                ]),
            'recentPurchases' => $recentPurchases,
            'recentChallans' => $recentChallans,
            'revenueTrend' => $revenueTrend,
        ]);
    }
}
