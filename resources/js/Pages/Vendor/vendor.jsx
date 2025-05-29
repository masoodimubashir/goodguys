import { Link, router } from "@inertiajs/react";
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
                ShowMessage('success', currentVendor ? 'Vendor updated successfully' : 'Vendor created successfully');
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
                        ShowMessage('success', 'Vendor deleted successfully');
                    },
                    onError: () => {
                        ShowMessage('error', 'Error deleting vendor');
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
                    <button onClick={openCreateModal} className="btn btn-sm btn-primary">
                        <i className="ti ti-plus me-1"></i> Add Vendor
                    </button>
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
                                                        <div className="btn-group dropdown-icon-none">
                                                            <button className="border-0 icon-btn b-r-4 dropdown-toggle active"
                                                                type="button" data-bs-toggle="dropdown"
                                                                data-bs-auto-close="true" aria-expanded="false">
                                                                <i className="ti ti-dots"></i>
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => openEditModal(vendor)}
                                                                    >
                                                                        <i className="ti ti-edit me-2"></i> Edit
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item text-danger"
                                                                        onClick={() => handleDelete(vendor.id)}
                                                                    >
                                                                        <i className="ti ti-trash me-2"></i> Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
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

            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {currentVendor ? 'Edit Vendor' : 'Add New Vendor'}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <Row>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Vendor Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.vendor_name ? 'is-invalid' : ''}`}
                                            value={data.vendor_name}
                                            onChange={(e) => setData('vendor_name', e.target.value)}
                                        />
                                        {errors.vendor_name && <div className="invalid-feedback">{errors.vendor_name}</div>}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Contact Number <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.contact_number ? 'is-invalid' : ''}`}
                                            value={data.contact_number}
                                            onChange={(e) => setData('contact_number', e.target.value)}
                                        />
                                        {errors.contact_number && <div className="invalid-feedback">{errors.contact_number}</div>}
                                    </div>
                                </Row>
                                <Row>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                        />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>
                                </Row>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="3"
                                        placeholder="Optional description..."
                                    />
                                    {errors.description && (
                                        <div className="invalid-feedback">{errors.description}</div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'Saving...' : (currentVendor ? 'Update Vendor' : 'Create Vendor')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </AuthenticatedLayout>
    );
}