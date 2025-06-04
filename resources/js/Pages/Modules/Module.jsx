import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ShowMessage } from "@/Components/ShowMessage";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";
import { Table } from "react-bootstrap";
import { Edit2, Trash } from "lucide-react";
import Swal from "sweetalert2";

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

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("module.destroy", id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setModules((prev) => prev.filter((module) => module.id !== id));
                        ShowMessage("success", "Module deleted successfully.");
                    },
                    onError: () => ShowMessage("error", "Failed to delete module."),
                });
            }
        })


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
                    <Table ref={tableRef} responsive hover bordered size="sm" >
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

                                            <td>
                                                <div className="d-flex">
                                                    <Link className="dropdown-item" href={route("module.edit", module.id)} title="Edit">
                                                        <Edit2 size={18}></Edit2>
                                                    </Link>
                                                    <button className="dropdown-item text-danger" onClick={() => handleDelete(module.id)} title="Delete" >
                                                        <Trash size={18}></Trash>
                                                    </button>
                                                </div>
                                            </td>
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
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
