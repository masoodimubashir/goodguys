<?php

namespace App\Http\Controllers;

use App\Models\ChallanRefrence;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\PurchasedItem;
use App\Models\Vendor;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $clients = Client::with(['purchaseLists.purchaseManagments', 'purchaseLists.returnLists'])
            ->orderBy('client_name')
            ->get();

        return Inertia::render('Dashboard', [
            'clients' => $clients,
            'total_clients' => $clients->count(),
            'total_vendors' => Vendor::count(),
            'total_inventory_items' => PurchasedItem::count(),
            'inventory_valuation' => $this->inventoryValuation(),
        ]);
    }



    protected function profitAnalysis()
    {
        return Inventory::query()
            ->selectRaw('
                id,
                item_name,
                item_type,
                buying_price,
                selling_price,
                count,
                (selling_price - buying_price) AS unit_profit,
                (selling_price - buying_price) * count AS total_profit,
                ROUND(((selling_price - buying_price)/buying_price)*100, 2) AS profit_margin
            ')
            ->orderByDesc('total_profit')
            ->limit(10)
            ->get();
    }

    protected function inventoryValuation()
    {
        return Inventory::query()
            ->selectRaw('
                item_type,
                SUM(count) AS total_quantity,
                SUM(buying_price * count) AS inventory_value,
                SUM(selling_price * count) AS potential_revenue
            ')
            ->groupBy('item_type')
            ->orderByDesc('inventory_value')
            ->get();
    }

    protected function topProducts()
    {
        return Inventory::query()
            ->selectRaw('
                id,
                item_name,
                selling_price * count AS total_revenue
            ')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get();
    }

    protected function priceAlerts()
    {
        return Inventory::whereColumn('selling_price', '<', 'buying_price')
            ->get(['id', 'item_name', 'buying_price', 'selling_price']);
    }


    protected function recentActivity()
    {
        return Inventory::latest('created_at')
            ->limit(5)
            ->get(['id', 'item_name', 'created_at', 'updated_at']);
    }
}
