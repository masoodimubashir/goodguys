import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function Dashboard({ 
    clients, 
    total_service_client_revenue, 
    total_clients, 
    total_vendors, 
    total_inventory_items,
    users,
    recentPurchases,
    recentChallans,
    revenueTrend
}) {
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Get top 5 clients by revenue
    const topClients = clients
        .map(client => {
            const revenue = client.purchase_lists?.reduce((sum, purchase) => {
                const purchaseAmount = purchase.purchase_managments?.reduce((s, pm) => s + pm.amount, 0) || 0;
                const returnAmount = purchase.return_lists?.reduce((s, rl) => s + rl.price, 0) || 0;
                return sum + (purchaseAmount - returnAmount);
            }, 0) || 0;
            
            return { ...client, revenue };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="h3 mb-0">Dashboard</h1>
                </div>
            </div>
            
            <div className="row mb-4">
                {/* Total Revenue Card */}
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Total Revenue
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {formatCurrency(total_service_client_revenue)}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-rupee-sign fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Total Clients Card */}
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Clients
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {total_clients}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Total Vendors Card */}
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Total Vendors
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {total_vendors}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-truck fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Inventory Items Card */}
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Inventory Items
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {total_inventory_items}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-boxes fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row mb-4">
                {/* Revenue Trend Table */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">
                                Revenue Trend (Last 30 Days)
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-sm table-striped">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th className="text-right">Revenue</th>
                                            <th className="text-right">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {revenueTrend.map((item, index) => {
                                            const prevValue = index > 0 ? revenueTrend[index - 1].Revenue : 0;
                                            const change = index > 0 ? 
                                                ((item.Revenue - prevValue) / prevValue * 100).toFixed(1) : 
                                                0;
                                                
                                            return (
                                                <tr key={index}>
                                                    <td>{item.date}</td>
                                                    <td className="text-right">{formatCurrency(item.Revenue)}</td>
                                                    <td className="text-right">
                                                        {index === 0 ? '-' : (
                                                            <span className={`badge ${change >= 0 ? 'badge-success' : 'badge-danger'}`}>
                                                                {change >= 0 ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Top Clients by Revenue */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">
                                Top Clients by Revenue
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                {topClients.map((client, index) => (
                                    <div key={index} className="list-group-item list-group-item-action">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h6 className="mb-1">
                                                <span className="badge badge-primary mr-2">{index + 1}</span>
                                                {client.client_name}
                                            </h6>
                                            <strong>{formatCurrency(client.revenue)}</strong>
                                        </div>
                                        <div className="progress mt-2" style={{ height: '10px' }}>
                                            <div 
                                                className="progress-bar bg-info" 
                                                role="progressbar" 
                                                style={{ width: `${(client.revenue / topClients[0].revenue) * 100}%` }}
                                                aria-valuenow={client.revenue}
                                                aria-valuemin="0"
                                                aria-valuemax={topClients[0].revenue}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row mb-4">
                {/* Recent Purchases */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Recent Purchases</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Client</th>
                                            <th>Date</th>
                                            <th className="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPurchases.map(purchase => (
                                            <tr key={purchase.id}>
                                                <td>{purchase.vendor?.vendor_name}</td>
                                                <td>{purchase.client?.client_name}</td>
                                                <td>{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                                                <td className="text-right">{formatCurrency(purchase.bill_total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent Challans */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Recent Challans</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Challan No</th>
                                            <th>Client</th>
                                            <th>Date</th>
                                            <th className="text-right">Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentChallans.map(challan => (
                                            <tr key={challan.id}>
                                                <td>{challan.challan_number}</td>
                                                <td>{challan.client?.client_name}</td>
                                                <td>{new Date(challan.created_at).toLocaleDateString()}</td>
                                                <td className="text-right">{challan.challans?.length || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Client Users Table */}
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Client Users</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Site</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.site_name || '-'}</td>
                                        <td>
                                            <span className={`badge ${user.client_type === 'Service Client' ? 'badge-success' : 'badge-primary'}`}>
                                                {user.client_type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}