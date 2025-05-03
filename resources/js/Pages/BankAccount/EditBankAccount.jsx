import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';

const EditBankAccount = ({ bankAccount }) => {


    const { data, setData, put, errors, processing } = useForm({
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
    });

    

    const handleSubmit = (e) => {

        e.preventDefault();

        put(route('bank-account.update', bankAccount.id), {
            preserveScroll: true,
        });
    };

    const handleFileChange = (field, e) => {
        setData(field, e.target.files[0]);
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
                        <li>
                            <Link href={route('clients.index')} className="f-s-14 f-w-500">Clients</Link>
                        </li>
                        <li>
                            <Link href={route('clients.show', bankAccount.client_id)} className="f-s-14 f-w-500"> Client Details</Link>
                        </li>
                        <li className="active">
                            <Link href="#" className="f-s-14 f-w-500">Edit Bank Account</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="app-form">
                                    <div className="row">
                                        {/* Bank Name */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="bank_name" value="Bank Name" />
                                                <TextInput
                                                    id="bank_name"
                                                    className="form-control"
                                                    placeholder="Enter Bank Name"
                                                    value={data.bank_name}
                                                    onChange={(e) => setData('bank_name', e.target.value)}
                                                />
                                                <InputError message={errors.bank_name} />
                                            </div>
                                        </div>

                                        {/* Holder Name */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="holder_name" value="Account Holder Name" />
                                                <TextInput
                                                    id="holder_name"
                                                    className="form-control"
                                                    placeholder="Enter Account Holder Name"
                                                    value={data.holder_name}
                                                    onChange={(e) => setData('holder_name', e.target.value)}
                                                />
                                                <InputError message={errors.holder_name} />
                                            </div>
                                        </div>

                                        {/* Account Number */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="account_number" value="Account Number" />
                                                <TextInput
                                                    id="account_number"
                                                    className="form-control"
                                                    placeholder="Enter Account Number"
                                                    value={data.account_number}
                                                    onChange={(e) => setData('account_number', e.target.value)}
                                                />
                                                <InputError message={errors.account_number} />
                                            </div>
                                        </div>

                                        {/* IFSC Code */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="ifsc_code" value="IFSC Code" />
                                                <TextInput
                                                    id="ifsc_code"
                                                    className="form-control"
                                                    placeholder="Enter IFSC Code"
                                                    value={data.ifsc_code}
                                                    onChange={(e) => setData('ifsc_code', e.target.value)}
                                                />
                                                <InputError message={errors.ifsc_code} />
                                            </div>
                                        </div>

                                        {/* Branch Code */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="branch_code" value="Branch Code" />
                                                <TextInput
                                                    id="branch_code"
                                                    className="form-control"
                                                    placeholder="Enter Branch Code"
                                                    value={data.branch_code}
                                                    onChange={(e) => setData('branch_code', e.target.value)}
                                                />
                                                <InputError message={errors.branch_code} />
                                            </div>
                                        </div>

                                        {/* Swift Code */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="swift_code" value="SWIFT Code" />
                                                <TextInput
                                                    id="swift_code"
                                                    className="form-control"
                                                    placeholder="Enter SWIFT Code"
                                                    value={data.swift_code}
                                                    onChange={(e) => setData('swift_code', e.target.value)}
                                                />
                                                <InputError message={errors.swift_code} />
                                            </div>
                                        </div>

                                        {/* UPI Number */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="upi_number" value="UPI Number" />
                                                <TextInput
                                                    id="upi_number"
                                                    className="form-control"
                                                    placeholder="Enter UPI Number"
                                                    value={data.upi_number}
                                                    onChange={(e) => setData('upi_number', e.target.value)}
                                                />
                                                <InputError message={errors.upi_number} />
                                            </div>
                                        </div>

                                        {/* UPI Address */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="upi_address" value="UPI Address" />
                                                <TextInput
                                                    id="upi_address"
                                                    className="form-control"
                                                    placeholder="Enter UPI Address"
                                                    value={data.upi_address}
                                                    onChange={(e) => setData('upi_address', e.target.value)}
                                                />
                                                <InputError message={errors.upi_address} />
                                            </div>
                                        </div>

                                        {/* Tax Number */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="tax_number" value="Tax Number" />
                                                <TextInput
                                                    id="tax_number"
                                                    className="form-control"
                                                    placeholder="Enter Tax Number"
                                                    value={data.tax_number}
                                                    onChange={(e) => setData('tax_number', e.target.value)}
                                                />
                                                <InputError message={errors.tax_number} />
                                            </div>
                                        </div>

                                        {/* QR Code Image */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="qr_code_image" value="QR Code Image" />
                                                <input
                                                    id="qr_code_image"
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => handleFileChange('qr_code_image', e)}
                                                />
                                                {bankAccount.qr_code_image && (
                                                    <div className="mt-2">
                                                        <span className="text-muted">Current: </span>
                                                        <a href={`/storage/${bankAccount.qr_code_image}`} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </div>
                                                )}
                                                <InputError message={errors.qr_code_image} />
                                            </div>
                                        </div>

                                        {/* Signature Image */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="signature_image" value="Signature Image" />
                                                <input
                                                    id="signature_image"
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => handleFileChange('signature_image', e)}
                                                />
                                                {bankAccount.signature_image && (
                                                    <div className="mt-2">
                                                        <span className="text-muted">Current: </span>
                                                        <a href={`/storage/${bankAccount.signature_image}`} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </div>
                                                )}
                                                <InputError message={errors.signature_image} />
                                            </div>
                                        </div>

                                        {/* Company Stamp Image */}
                                        <div className="col-md-4">
                                            <div className="mb-4">
                                                <InputLabel htmlFor="company_stamp_image" value="Company Stamp Image" />
                                                <input
                                                    id="company_stamp_image"
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => handleFileChange('company_stamp_image', e)}
                                                />
                                                {bankAccount.company_stamp_image && (
                                                    <div className="mt-2">
                                                        <span className="text-muted">Current: </span>
                                                        <a href={`/storage/${bankAccount.company_stamp_image}`} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </div>
                                                )}
                                                <InputError message={errors.company_stamp_image} />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-12">
                                            <div className="text-end">
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
                                                    {processing ? 'Updating...' : 'Update Bank Account'}
                                                </Button>
                                            </div>
                                        </div>
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