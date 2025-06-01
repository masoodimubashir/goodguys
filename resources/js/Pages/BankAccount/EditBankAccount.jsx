import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';

const EditBankAccount = ({ bankAccount }) => {
    const { data, setData, post, errors, processing, transform } = useForm({
        client_id: bankAccount.client_id,
        bank_name: bankAccount.bank_name || '',
        ifsc_code: bankAccount.ifsc_code || '',
        branch_code: bankAccount.branch_code || '',
        holder_name: bankAccount.holder_name || '',
        account_number: bankAccount.account_number || '',
        swift_code: bankAccount.swift_code || '',
        upi_number: bankAccount.upi_number || '',
        upi_address: bankAccount.upi_address || '',
        tax_number: bankAccount.tax_number || '',
        qr_code_image: null,
        signature_image: null,
        company_stamp_image: null,
        _method: 'put', // Laravel expects this for PUT
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        transform((data) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null) {
                    formData.append(key, value);
                }
            });
            return formData;
        });

        post(route('bank-account.update', bankAccount.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleFileChange = (field, e) => {
        if (e.target.files.length > 0) {
            setData(field, e.target.files[0]);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Bank Account" />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('dashboard')} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li><Link href={route('clients.index')} className="f-s-14 f-w-500">Clients</Link></li>
                        <li><Link href={route('clients.show', bankAccount.client_id)} className="f-s-14 f-w-500">Client Details</Link></li>
                        <li className="active"><Link href="#" className="f-s-14 f-w-500">Edit Bank Account</Link></li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row">
                                    {[
                                        { id: 'bank_name', label: 'Bank Name' },
                                        { id: 'holder_name', label: 'Account Holder Name' },
                                        { id: 'account_number', label: 'Account Number' },
                                        { id: 'ifsc_code', label: 'IFSC Code' },
                                        { id: 'branch_code', label: 'Branch Code' },
                                        { id: 'swift_code', label: 'SWIFT Code' },
                                        { id: 'upi_number', label: 'UPI Number' },
                                        { id: 'upi_address', label: 'UPI Address' },
                                        { id: 'tax_number', label: 'Tax Number' }
                                    ].map(({ id, label }) => (
                                        <div className="col-md-4 mb-4" key={id}>
                                            <InputLabel htmlFor={id} value={label} />
                                            <TextInput
                                                id={id}
                                                className="form-control"
                                                value={data[id]}
                                                placeholder={`Enter ${label}`}
                                                onChange={(e) => setData(id, e.target.value)}
                                            />
                                            <InputError message={errors[id]} />
                                        </div>
                                    ))}

                                    {[
                                        { id: 'qr_code_image', label: 'QR Code Image' },
                                        { id: 'signature_image', label: 'Signature Image' },
                                        { id: 'company_stamp_image', label: 'Company Stamp Image' }
                                    ].map(({ id, label }) => (
                                        <div className="col-md-4 mb-4" key={id}>
                                            <InputLabel htmlFor={id} value={label} />
                                            <input
                                                type="file"
                                                className="form-control"
                                                id={id}
                                                onChange={(e) => handleFileChange(id, e)}
                                            />
                                            {bankAccount[id] && (
                                                <div className="mt-2">
                                                    <span className="text-muted">Current: </span>
                                                    <a href={`/storage/${bankAccount[id]}`} target="_blank" rel="noopener noreferrer">
                                                        View Image
                                                    </a>
                                                </div>
                                            )}
                                            <InputError message={errors[id]} />
                                        </div>
                                    ))}

                                    <div className="col-12 text-end">
                                        <Link
                                            href={route('clients.show', bankAccount.client_id)}
                                            className="btn btn-outline-secondary me-2"
                                        >
                                            Cancel
                                        </Link>
                                        <Button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={processing}
                                        >
                                            {processing ? 'Updating...' : 'Update Account'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditBankAccount;
