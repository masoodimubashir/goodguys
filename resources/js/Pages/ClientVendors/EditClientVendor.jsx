import BreadCrumbHeader from '@/Components/BreadCrumbHeader'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@inertiajs/react'
import React, { useEffect } from 'react'

const EditClientVendor = ({ vendor }) => {

    // Initialize form with vendor data
    const { data, setData, put, processing, errors } = useForm({
        vendor_name: vendor.vendor_name || '',
        contact_number: vendor.contact_number || '',
        email: vendor.email || '',
        address: vendor.address || '',
        description: vendor.description || ''
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('client-vendor.update', vendor.id), {
            preserveScroll: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

   

    return (
        <AuthenticatedLayout>

            <div className="d-flex justify-content-between align-items-center">
                <BreadCrumbHeader breadcrumbs={[
                    { href: '/client-vendor', label: 'Party', active: true },
                ]} />
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Edit Party</h5>

                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row">
                                    {/* Vendor Name */}
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="vendor_name" className="form-label required">
                                            Party Name 
                                        </label>
                                        <input
                                            type="text"
                                            id="vendor_name"
                                            name="vendor_name"
                                            className={`form-control ${errors.vendor_name ? 'is-invalid' : ''}`}
                                            value={data.vendor_name}
                                            onChange={e => setData('vendor_name', e.target.value)}
                                            placeholder="Enter Party name"
                                            disabled={processing}
                                            required
                                        />
                                        {errors.vendor_name && (
                                            <div className="invalid-feedback">
                                                {errors.vendor_name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact Number */}
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="contact_number" className="form-label required">
                                            Contact Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="contact_number"
                                            name="contact_number"
                                            className={`form-control ${errors.contact_number ? 'is-invalid' : ''}`}
                                            value={data.contact_number}
                                            onChange={e => setData('contact_number', e.target.value)}
                                            placeholder="Enter contact number"
                                            disabled={processing}
                                            required
                                        />
                                        {errors.contact_number && (
                                            <div className="invalid-feedback">
                                                {errors.contact_number}
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="Enter email address"
                                            disabled={processing}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        Address
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="Enter party address"
                                        rows="3"
                                        disabled={processing}
                                    />
                                    {errors.address && (
                                        <div className="invalid-feedback">
                                            {errors.address}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Enter party description or notes"
                                        rows="4"
                                        disabled={processing}
                                    />
                                    {errors.description && (
                                        <div className="invalid-feedback">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="d-flex justify-content-end align-items-center">
                                    
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-1"></i>
                                                Update Party
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default EditClientVendor