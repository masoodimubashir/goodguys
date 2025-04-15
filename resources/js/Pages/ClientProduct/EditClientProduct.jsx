import React from 'react'
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';

export default function EditClientProduct({ client_product }) {

    const { data, setData, put, processing, errors } = useForm({
        client_name: client_product?.client_name,
        site_name: client_product?.site_name,
        client_email: client_product?.client_email,
        client_phone: client_product?.client_phone,
        client_address: client_product?.client_address,
        tax: client_product?.tax,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('client-product.update', client_product.id), {
            preserveScroll: true,
            onSuccess: () => {
                ShowMessage('success', 'Client Product Updated Successfully');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Client Product" />
            <div className="row g-4 mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body p-3">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Client Name</label>
                                    <TextInput
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Client Name"
                                        value={data.client_name}
                                        onChange={e => setData('client_name', e.target.value)}
                                    />
                                    <InputError message={errors.client_name} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Site Name</label>
                                    <TextInput
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Site Name"
                                        value={data.site_name}
                                        onChange={e => setData('site_name', e.target.value)}
                                    />
                                    <InputError message={errors.site_name} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Client Email</label>
                                    <TextInput
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Client Email"
                                        value={data.client_email}
                                        onChange={e => setData('client_email', e.target.value)}
                                    />
                                    <InputError message={errors.client_email} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Client Phone</label>
                                    <TextInput
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Client Phone"
                                        value={data.client_phone}
                                        onChange={e => setData('client_phone', e.target.value)}
                                    />
                                    <InputError message={errors.client_phone} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Client Address</label>
                                    <TextInput
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Client Address"
                                        value={data.client_address}
                                        onChange={e => setData('client_address', e.target.value)}
                                    />
                                    <InputError message={errors.client_address} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tax (%)</label>
                                    <TextInput
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter Tax"
                                        value={data.tax}
                                        onChange={e => setData('tax', e.target.value)}
                                    />
                                    <InputError message={errors.tax} />
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <Link href={route('clients.index')} className="btn btn-secondary">
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        Update Client Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

