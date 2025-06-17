import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import { motion } from "framer-motion";
import {
    DollarSign, Users, Truck, Box, ArrowUp, ArrowDown,
    IndianRupee,
} from "lucide-react";

export default function Dashboard({
    clients,
    total_clients,
    total_vendors,
    total_inventory_items,
    inventory_valuation,
}) {
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate profit direction
    const getProfitDirection = (profit) => {
        return profit >= 0 ?
            <span className="text-success"><ArrowUp size={16} /> </span> :
            <span className="text-danger"><ArrowDown size={16} /> </span>;
    };

    // Safe sum function for arrays
    const safeSum = (array, property) => {
        if (!Array.isArray(array)) return 0;
        return array.reduce((total, item) => {
            const value = parseFloat(item[property]);
            return total + (isNaN(value) ? 0 : value);
        }, 0);
    };


    const user = usePage().props.auth.user;

    // Usage:

    return (
        <AuthenticatedLayout>

            <Head title="Dashboard" />

            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="h3 mb-0">Welcome {user.name}</h1>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row">
                {/* Total Clients Card */}
                <motion.div
                    className="col-md-6 col-xl-3 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="card border-left-primary shadow h-100 py-2 hover-card">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Clients
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="h5 mb-0 font-weight-bold text-gray-800 mr-2">
                                            {total_clients}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                                        <Users size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Total Vendors Card */}
                <motion.div
                    className="col-md-6 col-xl-3 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="card border-left-info shadow h-100 py-2 hover-card">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Total Parties
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="h5 mb-0 font-weight-bold text-gray-800 mr-2">
                                            {total_vendors}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="bg-info bg-opacity-10 p-2 rounded-circle">
                                        <Truck size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Inventory Items Card */}
                <motion.div
                    className="col-md-6 col-xl-3 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <div className="card border-left-warning shadow h-100 py-2 hover-card">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Inventory Items
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="h5 mb-0 font-weight-bold text-gray-800 mr-2">
                                            {total_inventory_items}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="bg-warning bg-opacity-10 p-2 rounded-circle">
                                        <Box size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Total Inventory Value */}
                <motion.div
                    className="col-md-6 col-xl-3 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <div className="card border-left-success shadow h-100 py-2 hover-card">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Inventory Value
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="h5 mb-0 font-weight-bold text-gray-800 mr-2">
                                            {formatCurrency(safeSum(inventory_valuation, 'inventory_value'))}

                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                                        <IndianRupee size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

    

        </AuthenticatedLayout>
    );
}