import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ShowMessage } from '@/Components/ShowMessage';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { Button } from 'react-bootstrap';

const BankAccountForm = ({ bankAccount = null, clientId }) => {
    const isEdit = !!bankAccount;

    const { errors } = usePage().props;

    const { data, setData, processing, reset } = useForm({
        client_id: clientId || bankAccount?.client_id || '',
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
        _method: isEdit ? 'PUT' : 'POST',
    });


    const handleFileChange = (field, e) => {
        setData(field, e.target.files[0] || null);
    };

    console.log(errors);


    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        const routeName = isEdit ? 'bank-account.update' : 'bank-account.store';
        const routeParams = isEdit ? [bankAccount.id] : [];

        router.post(
            route(routeName, ...routeParams),
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    ShowMessage('success', `Bank account ${isEdit ? 'updated' : 'created'} successfully`);
                    if (!isEdit) {
                        reset();
                    }
                },
                onError: (errors) => {
                }
            }
        );
    };

    const breadcrumbs = [
        { href: '/bank-account/create', label: 'Bank', active: true }
    ];

    return (
        <AuthenticatedLayout>

            <Head title={`${isEdit ? 'Edit' : 'Create'} Bank Account`} />

            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center">
                    <BreadCrumbHeader breadcrumbs={breadcrumbs} />
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <form className="app-form" onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="row">
                                        {/* Bank Information */}
                                        <div className="col-md-6">
                                            <div className='mt-2'>
                                                <InputLabel htmlFor="bank_name" value="Bank Name" />
                                                <TextInput
                                                    id="bank_name"
                                                    className="form-control"
                                                    value={data.bank_name}
                                                    onChange={(e) => setData('bank_name', e.target.value)}
                                                />
                                                <InputError message={errors.bank_name} className="invalid-feedback" />
                                            </div>

                                            <div className='mt-2'>
                                                <InputLabel htmlFor="holder_name" value="Account Holder Name" />
                                                <TextInput
                                                    id="holder_name"
                                                    className={`form-control `}
                                                    value={data.holder_name}
                                                    onChange={(e) => setData('holder_name', e.target.value)}
                                                />
                                                <InputError message={errors.holder_name} className="invalid-feedback" />
                                            </div>

                                            <div className='mt-2'>
                                                <InputLabel htmlFor="account_number" value="Account Number" />
                                                <TextInput
                                                    id="account_number"
                                                    className={`form-control `}
                                                    value={data.account_number}
                                                    onChange={(e) => setData('account_number', e.target.value)}
                                                />
                                                <InputError message={errors.account_number} className="invalid-feedback" />
                                            </div>

                                        </div>

                                        {/* Bank Codes */}
                                        <div className="col-md-6">

                                            <div className='mt-2'>
                                                <InputLabel htmlFor="ifsc_code" value="IFSC Code" />
                                                <TextInput
                                                    id="ifsc_code"
                                                    className={`form-control `}
                                                    value={data.ifsc_code}
                                                    onChange={(e) => setData('ifsc_code', e.target.value)}
                                                />
                                                <InputError message={errors.ifsc_code} className="invalid-feedback" />
                                            </div>
                                            
                                            <div className='mt-2'>
                                                <InputLabel htmlFor="upi_number" value="UPI Number" />
                                                <TextInput
                                                    id="upi_number"
                                                    className={`form-control`}
                                                    value={data.upi_number}
                                                    onChange={(e) => setData('upi_number', e.target.value)}
                                                />
                                                <InputError message={errors.upi_number} className="invalid-feedback" />
                                            </div>

                                            <div className='mt-2'>
                                                <InputLabel htmlFor="upi_address" value="UPI Address" />
                                                <TextInput
                                                    id="upi_address"
                                                    className={`form-control`}
                                                    value={data.upi_address}
                                                    onChange={(e) => setData('upi_address', e.target.value)}
                                                />
                                                <InputError message={errors.upi_address} className="invalid-feedback" />
                                            </div>


                                        </div>

                                        {/* Document Uploads */}
                                        <div className="col-md-6">

                                            
                                            <div className='mt-2'>
                                                <InputLabel htmlFor="tax_number" value="Tax Number" />
                                                <TextInput
                                                    id="tax_number"
                                                    className={`form-control`}
                                                    value={data.tax_number}
                                                    onChange={(e) => setData('tax_number', e.target.value)}
                                                />
                                                <InputError message={errors.tax_number} className="invalid-feedback" />
                                            </div>
                                           <div className='mt-2'>
                                                <InputLabel htmlFor="company_stamp_image" value="Company Stamp Image (JPG)" />
                                                <input
                                                    type="file"
                                                    id="company_stamp_imag"
                                                    className={`form-control`}
                                                    onChange={(e) => handleFileChange('company_stamp_image', e)}
                                                    accept="image/*"
                                                />
                                                {bankAccount?.company_stamp_image && (
                                                    <div className="mt-2">
                                                        <span className="text-muted">Current: </span>
                                                        <a href={`/storage/${bankAccount.company_stamp_image}`} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </div>
                                                )}
                                                <InputError message={errors.company_stamp_image} className="invalid-feedback" />
                                            </div>  
                                        </div>

                                        <div className="col-md-6">
                                            <div className='mt-2'>
                                                <InputLabel htmlFor="signature_image" value="Signature Image (JPG)" />
                                                <input
                                                    type="file"
                                                    id="signature_image"
                                                    className={`form-control ${errors.signature_image ? 'is-invalid' : ''}`}
                                                    onChange={(e) => handleFileChange('signature_image', e)}
                                                    accept="image/*"
                                                />
                                                {bankAccount?.signature_image && (
                                                    <div className="mt-2">
                                                        <span className="text-muted">Current: </span>
                                                        <a href={`/storage/${bankAccount.signature_image}`} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </div>
                                                )}
                                                <InputError message={errors.signature_image} className="invalid-feedback" />
                                            </div>
                                               <div className='mt-2'>
                                                <InputLabel htmlFor="qr_code_image" value="QR Code Imag (JPG)" />
                                                <input
                                                    type="file"
                                                    id="qr_code_image"
                                                    className={`form-control `}
                                                    onChange={(e) => handleFileChange('qr_code_image', e)}
                                                    accept="image/*"
                                                />
                                                {bankAccount?.qr_code_image && (
                                                    <div className="mt-2">
                                                        <span className="text-muted">Current: </span>
                                                        <a href={`/storage/${bankAccount.qr_code_image}`} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </div>
                                                )}
                                                <InputError message={errors.qr_code_image} className="invalid-feedback" />
                                            </div>
                                        </div>

                                        <div className="col-12 text-end mt-4">

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                        {isEdit ? 'Updating...' : 'Creating...'}
                                                    </>
                                                ) : (
                                                    isEdit ? 'Update Bank Account' : 'Create Bank Account'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BankAccountForm;