import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import Swal from 'sweetalert2';

export default function Invoice({ invoices: initialInvoices }) {
    const [invoices, setInvoices] = useState(initialInvoices);
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    const tableHead = [
        'Invoice No.',
        'Client',
        'Module',
        'Item',
        'Description',
        'Count',
        'Price',
        'Tax (%)',
        'Service Charge',
        'Created By',
        'Actions'
    ];

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    const initializeDataTable = () => {
        if (tableRef.current) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }

            if (invoices.length > 0) {
                $(tableRef.current).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],
                    columnDefs: [{ targets: -1, responsivePriority: 1 }],
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
    }, [invoices]);

    const handleDelete = (id) => {
        destroy(route('invoice.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                if ($.fn.DataTable.isDataTable(tableRef.current)) {
                    $(tableRef.current).DataTable().destroy();
                }
                setInvoices(invoices.filter(invoice => invoice.id !== id));
                ShowMessage('success', flash.message);
            },
            onError: () => ShowMessage('error', flash.error),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Invoices" />
            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-end align-items-center mb-3">
                    {auth.user.role === 'admin' && (
                        <Link href={route('invoice.create')} className="btn btn-primary">
                            <i className="ti ti-plus me-1"></i> Add Invoice
                        </Link>
                    )}
                </div>
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body p-3">
                            <div className="table-responsive">
                                <table ref={tableRef} className="table table-hover align-middle mb-0 text-left">
                                    <thead className="table-light">
                                        <tr>
                                            {tableHead.map((head, index) => (
                                                <th key={index} className="text-nowrap">{head}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.length > 0 ? (
                                            invoices.map((invoice) => (
                                                <tr key={invoice.id}>
                                                    <td>{invoice.invoice_number}</td>
                                                    <td>{invoice.client?.name || 'N/A'}</td>
                                                    <td>{invoice.module?.name || 'N/A'}</td>
                                                    <td><span className="badge bg-secondary px-3 py-2">{invoice.item_name}</span></td>
                                                    <td>{invoice.description || <span className="text-muted">N/A</span>}</td>
                                                    <td>{invoice.count}</td>
                                                    <td>₹{invoice.price}</td>
                                                    <td>{invoice.tax}%</td>
                                                    <td>₹{invoice.service_charge}</td>
                                                    <td>{invoice.created_by || 'N/A'}</td>

                                                    {auth.user.role === 'admin' && (
                                                        <td>
                                                            <div className="btn-group dropdown-icon-none">
                                                                <button className="border-0 icon-btn b-r-4 dropdown-toggle active"
                                                                    type="button" data-bs-toggle="dropdown"
                                                                    aria-expanded="false">
                                                                    <i className="ti ti-dots"></i>
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <Link className="dropdown-item" href={route('invoice.edit', invoice.id)}>
                                                                            <i className="ti ti-edit me-2"></i> Edit
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <button className="dropdown-item text-danger" onClick={() => handleDelete(invoice.id)}>
                                                                            <i className="ti ti-trash me-2"></i> Delete
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
                                                <td colSpan={tableHead.length} className="text-center text-muted py-4">
                                                    <i className="ti ti-file-invoice fs-4 d-block mb-2"></i>
                                                    No invoices found.
                                                </td>
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
