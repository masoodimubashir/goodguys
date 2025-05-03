import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';

const CreateBankAccount = ({ client }) => {

    const { data, setData, post, errors, processing } = useForm({
        client_id: client.id,
        bank_name: '',
        ifsc_code: '',
        branch_code: '',
        holder_name: '',
        account_number: '',
        swift_code: '',
        upi_number: '',
        upi_address: '',
        tax_number: '',
        qr_code_image: null,
        signiture_image: null,
        company_stamp_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bank-account.store'));
    };

    const handleFileChange = (field, e) => {
        setData(field, e.target.files[0]);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Bank Account" />

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
                            <Link href={route('clients.show', client.id)} className="f-s-14 f-w-500">{client.name || 'Client Details'}</Link>
                        </li>
                        <li className="active">
                            <Link href="#" className="f-s-14 f-w-500">Create Bank Account</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="app-form" onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row">
                                    {/* Bank Name */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="bank_name" value="Bank Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Bank Name"
                                                id="bank_name"
                                                onChange={(e) => setData('bank_name', e.target.value)}
                                                value={data.bank_name}
                                            />
                                            <InputError message={errors.bank_name} />
                                        </div>
                                    </div>

                                    {/* Holder Name */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="holder_name" value="Account Holder Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Account Holder Name"
                                                id="holder_name"
                                                onChange={(e) => setData('holder_name', e.target.value)}
                                                value={data.holder_name}
                                            />
                                            <InputError message={errors.holder_name} />
                                        </div>
                                    </div>

                                    {/* Account Number */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="account_number" value="Account Number" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Account Number"
                                                id="account_number"
                                                onChange={(e) => setData('account_number', e.target.value)}
                                                value={data.account_number}
                                            />
                                            <InputError message={errors.account_number} />
                                        </div>
                                    </div>

                                    {/* IFSC Code */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="ifsc_code" value="IFSC Code" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter IFSC Code"
                                                id="ifsc_code"
                                                onChange={(e) => setData('ifsc_code', e.target.value)}
                                                value={data.ifsc_code}
                                            />
                                            <InputError message={errors.ifsc_code} />
                                        </div>
                                    </div>

                                    {/* Branch Code */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="branch_code" value="Branch Code" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Branch Code"
                                                id="branch_code"
                                                onChange={(e) => setData('branch_code', e.target.value)}
                                                value={data.branch_code}
                                            />
                                            <InputError message={errors.branch_code} />
                                        </div>
                                    </div>

                                    {/* Swift Code */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="swift_code" value="SWIFT Code" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter SWIFT Code"
                                                id="swift_code"
                                                onChange={(e) => setData('swift_code', e.target.value)}
                                                value={data.swift_code}
                                            />
                                            <InputError message={errors.swift_code} />
                                        </div>
                                    </div>

                                    {/* UPI Number */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="upi_number" value="UPI Number" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter UPI Number"
                                                id="upi_number"
                                                onChange={(e) => setData('upi_number', e.target.value)}
                                                value={data.upi_number}
                                            />
                                            <InputError message={errors.upi_number} />
                                        </div>
                                    </div>

                                    {/* UPI Address */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="upi_address" value="UPI Address" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter UPI Address"
                                                id="upi_address"
                                                onChange={(e) => setData('upi_address', e.target.value)}
                                                value={data.upi_address}
                                            />
                                            <InputError message={errors.upi_address} />
                                        </div>
                                    </div>

                                    {/* Tax Number */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="tax_number" value="Tax Number" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Tax Number"
                                                id="tax_number"
                                                onChange={(e) => setData('tax_number', e.target.value)}
                                                value={data.tax_number}
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
                                            
                                            <InputError message={errors.qr_code_image} />
                                        </div>
                                    </div>

                                    {/* Signature Image */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="signiture_image" value="Signature Image" />
                                            <input
                                                id="signiture_image"
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => handleFileChange('signiture_image', e)}
                                            />
                                          
                                            <InputError message={errors.signiture_image} />
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
                                           
                                            <InputError message={errors.company_stamp_image} />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary" disabled={processing}>
                                                {processing ? 'Creating...' : 'Create Bank Account'}
                                            </Button>
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

export default CreateBankAccount;