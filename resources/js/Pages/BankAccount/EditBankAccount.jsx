import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const EditBankAccount = ({ bankAccount }) => {
    const { data, setData, post, errors, processing } = useForm({
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
        _method: 'PUT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) {
                formData.append(key, value);
            }
        });

        post(route('bank-account.update', bankAccount.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onError: () => {
                // Scroll to first error if any
                const firstError = Object.keys(errors)[0];
                if (firstError) {
                    document.getElementById(firstError)?.focus();
                }
            },
        });
    };

    const handleFileChange = (field, e) => {
        setData(field, e.target.files[0] || null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Bank Account" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li>
                                <Link 
                                    href={route('dashboard')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                    <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                    </svg>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={route('clients.index')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                    Clients
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={route('clients.show', bankAccount.client_id)} 
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                    Client Details
                                </Link>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Edit Bank Account</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Bank Account</h2>
                        
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bank Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Bank Information</h3>
                                    
                                    <div>
                                        <InputLabel htmlFor="bank_name" value="Bank Name" />
                                        <input
                                            id="bank_name"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.bank_name}
                                            onChange={(e) => setData('bank_name', e.target.value)}
                                        />
                                        <InputError message={errors.bank_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="holder_name" value="Account Holder Name" />
                                        <input
                                            id="holder_name"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.holder_name}
                                            onChange={(e) => setData('holder_name', e.target.value)}
                                        />
                                        <InputError message={errors.holder_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="account_number" value="Account Number" />
                                        <input
                                            id="account_number"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.account_number}
                                            onChange={(e) => setData('account_number', e.target.value)}
                                        />
                                        <InputError message={errors.account_number} className="mt-2" />
                                    </div>
                                </div>

                                {/* Bank Codes */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Bank Codes</h3>
                                    
                                    <div>
                                        <InputLabel htmlFor="ifsc_code" value="IFSC Code" />
                                        <input
                                            id="ifsc_code"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.ifsc_code}
                                            onChange={(e) => setData('ifsc_code', e.target.value)}
                                        />
                                        <InputError message={errors.ifsc_code} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="branch_code" value="Branch Code" />
                                        <input
                                            id="branch_code"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.branch_code}
                                            onChange={(e) => setData('branch_code', e.target.value)}
                                        />
                                        <InputError message={errors.branch_code} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="swift_code" value="SWIFT Code" />
                                        <input
                                            id="swift_code"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.swift_code}
                                            onChange={(e) => setData('swift_code', e.target.value)}
                                        />
                                        <InputError message={errors.swift_code} className="mt-2" />
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
                                    
                                    <div>
                                        <InputLabel htmlFor="upi_number" value="UPI Number" />
                                        <input
                                            id="upi_number"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.upi_number}
                                            onChange={(e) => setData('upi_number', e.target.value)}
                                        />
                                        <InputError message={errors.upi_number} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="upi_address" value="UPI Address" />
                                        <input
                                            id="upi_address"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.upi_address}
                                            onChange={(e) => setData('upi_address', e.target.value)}
                                        />
                                        <InputError message={errors.upi_address} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tax_number" value="Tax Number" />
                                        <input
                                            id="tax_number"
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.tax_number}
                                            onChange={(e) => setData('tax_number', e.target.value)}
                                        />
                                        <InputError message={errors.tax_number} className="mt-2" />
                                    </div>
                                </div>

                                {/* Document Uploads */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                                    
                                    <div>
                                        <InputLabel htmlFor="qr_code_image" value="QR Code Image" />
                                        <input
                                            id="qr_code_image"
                                            type="file"
                                            accept="image/*"
                                            className="mt-1 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            onChange={(e) => handleFileChange('qr_code_image', e)}
                                        />
                                        {bankAccount.qr_code_image && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                Current: <a 
                                                    href={`/storage/${bankAccount.qr_code_image}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Image
                                                </a>
                                            </div>
                                        )}
                                        <InputError message={errors.qr_code_image} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="signature_image" value="Signature Image" />
                                        <input
                                            id="signature_image"
                                            type="file"
                                            accept="image/*"
                                            className="mt-1 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            onChange={(e) => handleFileChange('signature_image', e)}
                                        />
                                        {bankAccount.signature_image && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                Current: <a 
                                                    href={`/storage/${bankAccount.signature_image}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Image
                                                </a>
                                            </div>
                                        )}
                                        <InputError message={errors.signature_image} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="company_stamp_image" value="Company Stamp Image" />
                                        <input
                                            id="company_stamp_image"
                                            type="file"
                                            accept="image/*"
                                            className="mt-1 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            onChange={(e) => handleFileChange('company_stamp_image', e)}
                                        />
                                        {bankAccount.company_stamp_image && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                Current: <a 
                                                    href={`/storage/${bankAccount.company_stamp_image}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Image
                                                </a>
                                            </div>
                                        )}
                                        <InputError message={errors.company_stamp_image} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6">
                                <SecondaryButton
                                    type="button"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditBankAccount;