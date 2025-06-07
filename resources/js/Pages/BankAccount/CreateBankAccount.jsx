import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';

const BankAccountForm = ({ bankAccount = null }) => {
    const isEdit = !!bankAccount;

    console.log('isEdit:', isEdit);
    console.log('bankAccount:', bankAccount);
    

    const { data, setData, errors, processing } = useForm({
        bank_name: bankAccount?.bank_name || '',
        ifsc_code: bankAccount?.ifsc_code || '',
        holder_name: bankAccount?.holder_name || '',
        account_number: bankAccount?.account_number || '',
        upi_number: bankAccount?.upi_number || '',
        upi_address: bankAccount?.upi_address || '',
        tax_number: bankAccount?.tax_number || '',
        qr_code_image: null,
        signature_image: null,
        company_stamp_image: null,
        _method: isEdit ? 'PUT' : 'POST', // Add method spoofing for Laravel
    });

    const handleFileChange = (field, e) => {
        setData(field, e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        console.log('Submitting to:', isEdit ? route('bank-account.update', bankAccount.id) : route('bank-account.store'));
        console.log('Form data:', Object.fromEntries(formData));

        if (isEdit) {
            // For updates, use POST with method spoofing
            router.post(
                route('bank-account.update', bankAccount.id),
                formData,
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log('Update successful');
                    },
                    onError: (errors) => {
                        console.log('Update errors:', errors);
                    }
                }
            );
        } else {
            // For creation, use POST
            router.post(
                route('bank-account.store'),
                formData,
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log('Create successful');
                    },
                    onError: (errors) => {
                        console.log('Create errors:', errors);
                    }
                }
            );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? 'Edit' : 'Create'} Bank Account`} />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('dashboard')} className="f-s-14 f-w-500">
                                <i className="iconoir-home-alt"></i>
                            </Link>
                        </li>
                        <li className="active">
                            <span className="f-s-14 f-w-500">{isEdit ? 'Edit' : 'Create'} Bank Account</span>
                        </li>
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
                                        { id: 'upi_number', label: 'UPI Number' },
                                        { id: 'upi_address', label: 'UPI Address' },
                                        { id: 'tax_number', label: 'Tax Number' },
                                    ].map(({ id, label }) => (
                                        <div className="col-md-4" key={id}>
                                            <div className="mb-4">
                                                <InputLabel htmlFor={id} value={label} />
                                                <TextInput
                                                    id={id}
                                                    className="form-control"
                                                    placeholder={`Enter ${label}`}
                                                    value={data[id]}
                                                    onChange={(e) => setData(id, e.target.value)}
                                                />
                                                <InputError message={errors[id]} />
                                            </div>
                                        </div>
                                    ))}

                                    {[
                                        { id: 'qr_code_image', label: 'QR Code Image' },
                                        { id: 'signature_image', label: 'Signature Image' },
                                        { id: 'company_stamp_image', label: 'Company Stamp Image' },
                                    ].map(({ id, label }) => (
                                        <div className="col-md-4" key={id}>
                                            <div className="mb-4">
                                                <InputLabel htmlFor={id} value={label} />
                                                <input
                                                    type="file"
                                                    id={id}
                                                    className="form-control"
                                                    onChange={(e) => handleFileChange(id, e)}
                                                    accept="image/*"
                                                />
                                                <InputError message={errors[id]} />
                                                {/* Show existing file names for edit mode */}
                                              
                                            </div>
                                        </div>
                                    ))}

                                    <div className="col-12 text-end">
                                        <Button className="btn btn-primary" disabled={processing}>
                                            {processing
                                                ? isEdit
                                                    ? 'Updating...'
                                                    : 'Creating...'
                                                : isEdit
                                                ? 'Update Bank Account'
                                                : 'Create Bank Account'}
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

export default BankAccountForm;