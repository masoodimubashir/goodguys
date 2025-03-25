import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';

export default function Module({ modules: initialModules }) {
    const [modules, setModules] = useState(initialModules);
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    

    const tableHead = ['Module Name', 'Count', 'Field Names', 'Actions'];

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    const initializeDataTable = () => {
        if (tableRef.current) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }

            if (modules.length > 0) {
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
    }, [modules]);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this module?")) {
            destroy(route("module.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    if ($.fn.DataTable.isDataTable(tableRef.current)) {
                        $(tableRef.current).DataTable().destroy();
                    }
                    setModules(modules.filter(module => module.id !== id));
                    ShowMessage("success", flash.message);
                },
                onError: () => ShowMessage("error", flash.error),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Modules" />
            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-end align-items-center mb-3">
                    {auth.user.role === 'admin' && (
                        <Link href={route('module.create')} className="btn btn-primary">
                            <i className="ti ti-plus me-1"></i> Add Module
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
                                        {modules.length > 0 ? (
                                            modules.map((module) => (
                                                <tr key={module.id}>
                                                    <td>
                                                        {module.module_name}
                                                    </td>
                                                    <td>{module.count}</td>
                                                    <td>
                                                        {Array.isArray(module.attributes) && module.attributes.length > 0 ? (
                                                            module.attributes.map((attr, i) => (
                                                                <div key={i}>
                                                                    <span className="badge bg-light text-dark border mb-1">
                                                                        {attr}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>
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
                                                                        <Link className="dropdown-item" href={route('module.edit', module.id)}>
                                                                            <i className="ti ti-edit me-2"></i> Edit
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <button className="dropdown-item text-danger" onClick={() => handleDelete(module.id)}>
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
                                                    No modules found.
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
