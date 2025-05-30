import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import Swal from 'sweetalert2';
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";
import { Row, Form } from "react-bootstrap";

export default function Vendor({ vendors: initialVendors }) {


    const [vendors, setVendors] = useState(initialVendors);
    const [showModal, setShowModal] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null);
    const tableRef = useRef(null);
    const { flash } = usePage().props;

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        vendor_name: '',
        contact_number: '',
        email: '',
        address: '',
        description: '',
    });

    const tableHead = ['Vendor Name', 'Contact', 'Email', 'Address', 'Description', 'Created At', 'Actions'];

    useEffect(() => {
        setVendors(initialVendors);
    }, [initialVendors]);

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    const initializeDataTable = () => {
        if (tableRef.current) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }

            if (vendors.length > 0) {
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
            if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, [vendors]);

    const handleSubmit = (e) => {

        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: (page) => {
                setShowModal(false);
                reset();
                setVendors(page.props.vendors);
                ShowMessage('success', currentVendor ? 'Updated successfully' : 'Created successfully');
            },
            onError: () => {
                ShowMessage('error', 'Please check the form for errors');
            }
        };

        if (currentVendor) {
            put(route('vendor.update', currentVendor.id), data, options);
        } else {
            post(route('vendor.store'), data, options);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('vendor.destroy', id), {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
                            $(tableRef.current).DataTable().destroy();
                        }
                        setVendors(page.props.vendors);
                        ShowMessage('success', 'Vendor deleted');
                    },
                    onError: () => {
                        ShowMessage('error', 'Error deleting');
                    },
                });
            }
        });
    };

    const openCreateModal = () => {
        setCurrentVendor(null);
        reset({
            vendor_name: '',
            contact_number: '',
            email: '',
            address: '',
            description: '',
        });
        setShowModal(true);
    };

    const openEditModal = (vendor) => {
        setCurrentVendor(vendor);
        setData({
            vendor_name: vendor.vendor_name,
            contact_number: vendor.contact_number,
            email: vendor.email,
            address: vendor.address,
            description: vendor.description || '',
        });
        setShowModal(true);
    };

    const breadcrumbs = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/vendor', label: 'Vendors', active: true }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Vendors" />
            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <BreadCrumbHeader breadcrumbs={breadcrumbs} />

                    <Link href={route('vendor.create')} className="btn btn-sm btn-primary">
                        {'Add Vendor'}
                    </Link>
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
                                        {vendors.length > 0 ? (
                                            vendors.map((vendor) => (
                                                <tr key={vendor.id}>
                                                    <td>{vendor.vendor_name}</td>
                                                    <td>{vendor.contact_number}</td>
                                                    <td>{vendor.email || <span className="text-muted">N/A</span>}</td>
                                                    <td>{vendor.address || <span className="text-muted">N/A</span>}</td>
                                                    <td>{vendor.description || <span className="text-muted">N/A</span>}</td>
                                                    <td>{new Date(vendor.created_at).toLocaleString()}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link
                                                                className="dropdown-item"
                                                                title="Edit"
                                                                href={route('vendor.edit', vendor.id)}
                                                            >
                                                                <i className="ti ti-edit me-2"></i>
                                                            </Link>
                                                            <button
                                                                className="dropdown-item text-danger"
                                                                title="Delete"
                                                                onClick={() => handleDelete(vendor.id)}
                                                            >
                                                                <i className="ti ti-trash me-2"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="text-center" colSpan={tableHead.length}>No vendors found.</td>
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