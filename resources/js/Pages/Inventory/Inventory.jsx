import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import Swal from 'sweetalert2';

export default function Inventory({ inventories: initialInventories }) {
    const [inventories, setInventories] = useState(initialInventories);
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    const tableHead = [
        'Item Name',
        'Count',
        'Selling Price',
        'Buying Price',
        'Item Type',
        'Item Subtype',
        'Description',
        'Dimensions',
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

            if (inventories.length > 0) {
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
    }, [inventories]);

    const handleDelete = (id) => {
        destroy(route('inventory.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                if ($.fn.DataTable.isDataTable(tableRef.current)) {
                    $(tableRef.current).DataTable().destroy();
                }
                setInventories(inventories.filter(item => item.id !== id));
                ShowMessage('success', flash.message);
            },
            onError: () => ShowMessage('error', flash.error),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Inventory" />
            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-end align-items-center mb-3">
                    {auth.user.role === 'admin' && (
                        <Link href={route('inventory.create')} className="btn btn-primary">
                            <i className="ti ti-plus me-1"></i> Add Item
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
                                        {inventories.length > 0 ? (
                                            inventories.map((item) => (
                                                <tr key={item.id}>
                                                    <td><span className="badge bg-secondary px-3 py-2">{item.item_name}</span></td>
                                                    <td>{item.count}</td>
                                                    <td>₹{(item.selling_price)}</td>
                                                    <td>₹{(item.buying_price)}</td>
                                                    <td>{item.item_type}</td>
                                                    <td>{item.item_sub_type || <span className="text-muted">N/A</span>}</td>
                                                    <td>{item.description || <span className="text-muted">N/A</span>}</td>
                                                    <td>
                                                        {Array.isArray(item.item_dimensions) ? (
                                                            item.item_dimensions.map((dimension, index) => {
                                                                const [name, value, unit] = dimension.split(',');
                                                                return (
                                                                    <div key={index}>
                                                                        <span className="badge bg-light text-dark border me-1 mb-1">
                                                                            {name}: {value} {unit}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>


                                                    {auth.user.role === 'admin' && (
                                                        <td>
                                                            <div className="btn-group dropdown-icon-none">
                                                                <button className=" border-0 icon-btn b-r-4 dropdown-toggle active"
                                                                    type="button" data-bs-toggle="dropdown"
                                                                    data-bs-auto-close="true" aria-expanded="false">
                                                                    <i className="ti ti-dots"></i>
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <Link className="dropdown-item" href={route('inventory.edit', item.id)}>
                                                                            <i className="ti ti-edit me-2"></i> Edit
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <button className="dropdown-item text-danger" onClick={() => handleDelete(item.id)}>
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
                                                    <i className="ti ti-box fs-4 d-block mb-2"></i>
                                                    No inventory items found.
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
