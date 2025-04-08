import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';

export default function Account({ accounts: initialAccounts }) {
    const [accounts, setAccounts] = useState(initialAccounts);
    const tableHead = ['Item Name', 'Selling Price', 'Buying Price', 'Count', 'Service Charge(%)', 'Actions'];
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    const initializeDataTable = () => {
        if (tableRef.current) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
            if (accounts.length > 0) {
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
    }, [accounts]);

    const handleDelete = (id) => {
        destroy(route('accounts.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                if ($.fn.DataTable.isDataTable(tableRef.current)) {
                    $(tableRef.current).DataTable().destroy();
                }
                setAccounts(accounts.filter(account => account.id !== id));
                ShowMessage('success', flash.message);
            },
            onError: () => ShowMessage('error', flash.error),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Accounts" />
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
                                        {accounts.length > 0 ? (
                                            accounts.map((account) => (
                                                <tr key={account.id}>
                                                    <td>{account.item_name}</td>
                                                    <td>{(account.selling_price + account.service_charge_amount) * account.count}</td>
                                                    <td>{account.buying_price}</td>
                                                    <td>{account.count}</td>
                                                    <td>{account.service_charge}</td>
                                                    {auth.user.role === 'admin' && (
                                                        <td>
                                                            <div className="btn-group dropdown-icon-none">
                                                                <button className="border-0 icon-btn b-r-4 dropdown-toggle active"
                                                                    type="button" data-bs-toggle="dropdown"
                                                                    data-bs-auto-close="true" aria-expanded="false">
                                                                    <i className="ti ti-dots"></i>
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <Link className="dropdown-item" href={route('accounts.edit', account.id)}>
                                                                            <i className="ti ti-edit"></i> Edit
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <button className="dropdown-item" onClick={() => handleDelete(account.id)}>
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
                                                <td colSpan={tableHead.length} className="text-center">No accounts found</td>
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
