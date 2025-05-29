import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import Breadcrumb from "@/Components/BreadCrumbHeader";
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";

export default function Field({ fields: initialFields }) {

    const [fields, setFields] = useState(initialFields);
    const tableHead = ['Field Name', 'SI Unit', 'Dimension Value', 'Actions'];
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

            if (fields.length > 0) {
                $(tableRef.current).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],
                    columnDefs: [
                        {
                            targets: -1,
                            responsivePriority: 1
                        }
                    ]
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
    }, [fields]);

    const handleDelete = (id) => {
        destroy(route('field.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                if ($.fn.DataTable.isDataTable(tableRef.current)) {
                    $(tableRef.current).DataTable().destroy();
                }
                setFields(fields.filter(item => item.id !== id));
                ShowMessage('success', flash.message);
            },
            onError: () => ShowMessage('error', flash.error),
        });
    };

    const breadcrumbs = [
        { href: '/module', label: 'Back', active: true }
    ];



    return (
        <AuthenticatedLayout>

            <Head title="Field Management" />


            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">

                    <BreadCrumbHeader
                        homeHref="/module"
                        breadcrumbs={breadcrumbs}
                    />

                    <Link href={route('field.create')} className="btn btn-sm btn-primary">
                        <i className="ti ti-plus me-1"></i> Add Field
                    </Link>
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
                                        {fields.length > 0 ? (
                                            fields.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.field_name}</td>
                                                    <td>{item.si_unit}</td>
                                                    <td>{item.dimension_value}</td>
                                                        <td>
                                                            <div className="d-flex gap-4" title="Edit">
                                                                <Link href={route('field.edit', item.id)}>
                                                                    <i className="ti ti-edit"></i>
                                                                </Link>
                                                                <button className="dropdown-item" onClick={() => handleDelete(item.id)} title="Delete">
                                                                    <i className="ti ti-trash text-danger"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={tableHead.length} className="text-center">No fields found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
