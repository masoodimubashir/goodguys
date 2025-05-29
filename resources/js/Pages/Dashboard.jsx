import React, { useState } from 'react';
import { Package, Users,  DollarSign, Eye, Plus, } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table } from 'react-bootstrap';
import { Link } from '@inertiajs/react';

const Dashboard = ({ clients, total_service_client_revenue, total_clients, total_inventory_items, users }) => {


    const StatCard = ({ title, value, icon: Icon,  bgColor = "primary", text }) => (

        <div className="col-md-6  col-sm-12 mb-4">
            <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-black">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 className="text-black-50 text-uppercase mb-2">{title}</h6>
                            <h3 className="mb-0 fw-bold">{value}</h3>
                            <div className="d-flex align-items-center mt-2 small">
                                {text}
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-circle text-danger">
                            <Icon size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <div className="min-vh-100">
                <div className="container-fluid">
                  
                    {/* Stats Cards */}
                    <div className="row mb-4">
                        <StatCard
                            title="Total Revenue"
                            value={`₹${total_service_client_revenue}`}
                            icon={DollarSign}
                            change={12}
                            changeType="increase"
                            text="Service Client"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`₹${total_service_client_revenue}`}
                            icon={DollarSign}
                            change={12}
                            changeType="increase"
                            text="Product Client"
                        />
                        <StatCard
                            title="Active Clients"
                            value={total_clients}
                            icon={Users}
                            change={15}
                            changeType="increase"
                        />
                        <StatCard
                            title="Inventory Items"
                            value={total_inventory_items}
                            icon={Package}
                            change={5}
                            changeType="increase"
                        />
                      
                    </div>



                    {/* Tables Row */}
                    <div className="row mb-4">
                        {/* Recent Clients */}
                        <div className="col-xl-6 mb-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header bg-white border-bottom mb-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0 fw-semibold">Recent Clients</h5>
                                        <Link
                                            href={route('clients.create')}
                                            className='btn btn-sm btn-primary  d-flex align-items-center'>
                                            <Plus size={16} className="me-1" />
                                            Add
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <Table striped hover className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="border-0 fw-semibold">Client</th>
                                                    <th className="border-0 fw-semibold">Site</th>
                                                    <th className="border-0 fw-semibold">Phone</th>
                                                    <th className="border-0 fw-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clients.map((client) => (
                                                    <tr key={client.id}>
                                                        <td className="border-0">
                                                            <Link
                                                                href={route("clients.show", client.id)}
                                                                className="fw-medium text-dark">
                                                                {client.client_name}
                                                            </Link>
                                                            <br />
                                                            <small className="text-muted">{client.client_email}</small>
                                                        </td>
                                                        <td className="border-0">{client.site_name || <span className="text-muted">N/A</span>}</td>
                                                        <td className="border-0">{client.client_phone}</td>

                                                        <td className="border-0">
                                                            <Link
                                                                href={route("clients.show", client.id)}
                                                                className='d-flex align-items-center justify-content-center'
                                                                title="View Client">
                                                                <Eye size={16} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Invoices */}
                        <div className="col-xl-6 mb-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header bg-white border-bottom">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0 fw-semibold">Create User</h5>
                                        <button className="btn btn-sm btn-outline-primary d-flex align-items-center">
                                            <Plus size={16} />
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <Table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="border-0 fw-semibold">Name</th>
                                                    <th className="border-0 fw-semibold">Email</th>
                                                    <th className="border-0 fw-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user.id}>

                                                        <td className="border-0">{user.name}</td>
                                                        <td className="border-0">{user.email}</td>
                                                        <td className="border-0">
                                                            <Link
                                                                href={route("users.show", user.id)}
                                                                className='d-flex align-items-center justify-content-center'
                                                                title="View Client">
                                                                <Eye size={16} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </Table>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;