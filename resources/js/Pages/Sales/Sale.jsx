import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';

export default function Sale({ sales: initialSales }) {
    const [sales, setSales] = useState(initialSales);
    const tableHead = ['Item Name', 'Selling Price', 'Buying Price', 'Count', 'Profit', 'Actions'];
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    useEffect(() => {
        if (flash.message) {
            ShowMessage('success', flash.message);
        }
        if (flash.error) {
            ShowMessage('error', flash.error);
        }
    }, [flash]);

    const initializeDataTable = () => {
        if (tableRef.current) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
            if (sales.length > 0) {
                $(tableRef.current).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],
                    columnDefs: [{ targets: -1, responsivePriority: 1 }]
                });
            }
        }
    };

    useEffect(() => {
        initializeDataTable();
        return () => {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, [sales]);

    const handleDelete = (id) => {
        destroy(route('accounts.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                if ($.fn.DataTable.isDataTable(tableRef.current)) {
                    $(tableRef.current).DataTable().destroy();
                }
                setSales(sales.filter(sale => sale.id !== id));
                ShowMessage('success', flash.message);
            },
            onError: () => ShowMessage('error', flash.error),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sales" />
            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-end align-items-center">
                    {auth.user.role === 'admin' && (
                        <Link href={route('accounts.create')} className="btn btn-primary me-2">
                            Add Account
                        </Link>
                    )}
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="app-scroll table-responsive">
                                <table ref={tableRef} className="table mb-0">
                                    <thead>
                                        <tr>
                                            {tableHead.map((head, index) => (
                                                <th key={index}>{head}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.length > 0 ? (
                                            sales.map((sale) => (
                                                <tr key={sale.id}>
                                                    <td>{sale.item_name}</td>
                                                    <td>{sale.selling_price}</td>
                                                    <td>{sale.buying_price}</td>
                                                    <td>{sale.count}</td>
                                                    <td>{sale.profit}</td>
                                                    {auth.user.role === 'admin' && (
                                                        <td>
                                                            <div className="btn-group dropdown-icon-none">
                                                                <button className="btn border-0 icon-btn b-r-4 dropdown-toggle active"
                                                                    type="button" data-bs-toggle="dropdown"
                                                                    data-bs-auto-close="true" aria-expanded="false">
                                                                    <i className="ti ti-dots-vertical"></i>
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <Link className="dropdown-item" href={route('accounts.edit', sale.id)}>
                                                                            <i className="ti ti-edit"></i> Edit
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <button className="dropdown-item" onClick={() => handleDelete(sale.id)}>
                                                                            <i className="ti ti-trash"></i> Delete
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={tableHead.length} className="text-center">No sales records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
