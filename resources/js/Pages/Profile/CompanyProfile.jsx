import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import { ShowMessage } from '@/Components/ShowMessage';

const CompanyProfile = ({ companyProfile = {} }) => {


    console.log(companyProfile);
    

    const { flash } = usePage().props;


    const { data, setData, post, put, errors, processing } = useForm({
        company_name: companyProfile?.company_name || '',
        company_address: companyProfile?.company_address || '',
        company_contact_no: companyProfile?.company_contact_no || '',
        company_email: companyProfile?.company_email || '',
        logo: null,
    });

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (companyProfile?.id) {
            put(route("company-profile.update", companyProfile?.id), {
                preserveScroll: true,
            });
        } else {
            post(route('company-profile.store'));
        }
    };

    const handleFileChange = (e) => {
        setData('logo', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Company Profile" />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('dashboard')} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('company-profile.index')} className="f-s-14 f-w-500">Company Profile</Link>
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
                                    {/* Company Name */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="company_name" value="Company Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Company Name"
                                                id="company_name"
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                value={data.company_name}
                                            />
                                            <InputError message={errors.company_name} />
                                        </div>
                                    </div>

                                    {/* Company Email */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="company_email" value="Company Email" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Company Email"
                                                id="company_email"
                                                type="email"
                                                onChange={(e) => setData('company_email', e.target.value)}
                                                value={data.company_email}
                                            />
                                            <InputError message={errors.company_email} />
                                        </div>
                                    </div>

                                    {/* Company Contact No */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="company_contact_no" value="Contact Number" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Contact Number"
                                                id="company_contact_no"
                                                onChange={(e) => setData('company_contact_no', e.target.value)}
                                                value={data.company_contact_no}
                                            />
                                            <InputError message={errors.company_contact_no} />
                                        </div>
                                    </div>

                                    {/* Company Logo */}
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="logo" value="Company Logo" />
                                            <input
                                                id="logo"
                                                type="file"
                                                className="form-control"
                                                onChange={handleFileChange}
                                            />
                                            <InputError message={errors.logo} />
                                        </div>
                                    </div>

                                    {/* Company Address */}
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="company_address" value="Company Address" />
                                            <textarea
                                                id="company_address"
                                                className="form-control"
                                                placeholder="Enter company address"
                                                rows="3"
                                                value={data.company_address}
                                                onChange={(e) => setData('company_address', e.target.value)}
                                            ></textarea>
                                            <InputError message={errors.company_address} />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary" disabled={processing}>
                                                {processing ? 'Submitting...' : 'Save Changes'}
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

export default CompanyProfile;