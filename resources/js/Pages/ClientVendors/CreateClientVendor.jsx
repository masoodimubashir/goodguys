import React, { useEffect } from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';

const CreateClientVendor = () => {

    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_name: '',
        contact_number: '',
        email: '',
        address: '',
        description: '',
    });




    // Handle flash messages
    useEffect(() => {
        if (flash?.message) {
            ShowMessage('success', flash.message);
        }
        if (flash?.error) {
            ShowMessage('error', flash.error);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('client-vendor.store'), {
            preserveScroll: true,
            onSuccess: () => {
                ShowMessage('success', 'Vendor created successfully');
                reset(); // Reset form after successful submission
            },
            onError: (errors) => {
                ShowMessage('error', 'Please check the form for errors');
            }
        });
    };



    const breadcrumbs = [
        { href: '/client-vendor', label: 'Vendors', active: true }
    ];

    return (
        <>
            <Head title="Create Vendor" />

            <AuthenticatedLayout>
                <div className="row">

                    <div className="d-flex justify-content-between align-items-center">
                        <BreadCrumbHeader breadcrumbs={breadcrumbs} />

                       
                    </div>

                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="row">
                                        {/* Vendor Name */}
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="vendor_name" className="form-label required">
                                                Party Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="vendor_name"
                                                name="vendor_name"
                                                className={`form-control ${errors.vendor_name ? 'is-invalid' : ''}`}
                                                value={data.vendor_name}
                                                onChange={e => setData('vendor_name', e.target.value)}
                                                placeholder="Enter vendor name"
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
                                            placeholder="Enter vendor address"
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
                                            placeholder="Enter vendor description or notes"
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
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-1"></i>
                                                    Create Vendor
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

            <style jsx>{`
                .required {
                    position: relative;
                }
                
                .card {
                    border: none;
                    border-radius: 12px;
                }
                
                .card-header {
                    border-radius: 12px 12px 0 0 !important;
                    border: none;
                }
                
                .form-control:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
                }
                
                .btn {
                    border-radius: 8px;
                    font-weight: 500;
                    padding: 8px 16px;
                }
                
                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }
                
                .breadcrumb {
                    background-color: transparent;
                    padding: 0;
                }
                
                .breadcrumb-item + .breadcrumb-item::before {
                    content: "›";
                    color: #6c757d;
                }
                
                @media (max-width: 768px) {
                    .d-flex.justify-content-between {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    
                    .d-flex.justify-content-between > div {
                        text-align: center;
                    }
                }
            `}</style>
        </>
    );
};

export default CreateClientVendor;