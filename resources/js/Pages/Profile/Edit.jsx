import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdateProfileInformation from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';

import { Head } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {

    return (
        <AuthenticatedLayout
            header={
                <h2 classNameName="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <UpdateProfileInformation />


            <UpdatePasswordForm />



        </AuthenticatedLayout>
    );
}

{/* 
<div classNameName="py-12">
                <div classNameName="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div classNameName="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                       
                    </div>

                    <div classNameName="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    </div>

                    <div classNameName="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm classNameName="max-w-xl" />
                    </div>
                </div>
            </div> */}