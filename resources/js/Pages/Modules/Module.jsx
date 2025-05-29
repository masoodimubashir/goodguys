import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ShowMessage } from "@/Components/ShowMessage";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";

export default function Module({ modules: initialModules }) {
    const [modules, setModules] = useState(initialModules);
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    const tableHead = ["Module Name", "Buying Price", "Selling Price", "Total Price", "Count", "Fields", "Actions"];

    /** Show success/error messages on load */
    useEffect(() => {
        if (flash.message) ShowMessage("success", flash.message);
        if (flash.error) ShowMessage("error", flash.error);
    }, [flash]);

    /** Initialize or reinitialize DataTable */
    const initializeDataTable = () => {
        if (!tableRef.current) return;

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
    };

    useEffect(() => {
        initializeDataTable();
        return () => {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, [modules]);

    /** Delete module */
    const handleDelete = (id) => {
        destroy(route("module.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                setModules((prev) => prev.filter((module) => module.id !== id));
                ShowMessage("success", "Module deleted successfully.");
            },
            onError: () => ShowMessage("error", "Failed to delete module."),
        });
    };

    const breadcrumbs = [
        { href: '/module', label: 'Back', active: true }
    ];

    return (


        <AuthenticatedLayout>


            <Head title="Modules" />

            <div className="row g-4 mt-4">

                <div className="d-flex justify-content-between align-items-center">

                    <BreadCrumbHeader
                        homeHref="/module"
                        breadcrumbs={breadcrumbs}
                    />

                    <div className="d-flex gap-2">
                        <Link href={route("module.create")} className="btn btn-sm btn-primary">
                            <i className="ti ti-plus me-1"></i> Add Module
                        </Link>

                        <Link href={route('field.index')} className="btn btn-sm btn-primary">
                            <i className="ti ti-eye me-1"></i> View Fields
                        </Link>
                    </div>



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
                                            modules.map((module) => {
                                                const totalPrice = module.selling_price * module.count;
                                                return (
                                                    <tr key={module.id}>
                                                        <td>{module.module_name}</td>
                                                        <td>{module.buying_price}</td>
                                                        <td>{module.selling_price}</td>
                                                        <td>{module.selling_price} * {module.count} =  {totalPrice}</td>
                                                        <td>{module.count}</td>
                                                        <td>
                                                            {module.fields.map((field, i) => (
                                                                <div key={i}>
                                                                    <span className="badge bg-light text-dark border mb-1 d-block">
                                                                        {field}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </td>

                                                        {auth.user.role === "admin" && (
                                                            <td>
                                                                <div className="btn-group dropdown-icon-none">
                                                                    <button
                                                                        className="border-0 icon-btn b-r-4 dropdown-toggle active"
                                                                        type="button"
                                                                        data-bs-toggle="dropdown"
                                                                        data-bs-auto-close="true"
                                                                        aria-expanded="false"
                                                                    >
                                                                        <i className="ti ti-dots"></i>
                                                                    </button>
                                                                    <ul className="dropdown-menu">
                                                                        <li>
                                                                            <Link className="dropdown-item" href={route("module.edit", module.id)}>
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
                                                );
                                            })
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
        </AuthenticatedLayout >
    );
}
