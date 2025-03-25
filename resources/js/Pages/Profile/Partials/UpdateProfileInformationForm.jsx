import InputError from '@/Components/InputError';
import { Link, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {

    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success',
                    text: 'Profile updated successfully',
                    icon: 'success',
                });
            },
            preserveState: true,
        });
    };


    return (
        <>

            {mustVerifyEmail && user.email_verified_at === null && (
                <div>
                    <p className="mt-2 text-sm text-gray-800">
                        Your email address is unverified.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Click here to re-send the verification email.
                        </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mt-2 text-sm font-medium text-green-600">
                            A new verification link has been sent to your
                            email address.
                        </div>
                    )}
                </div>
            )}



            <div className="card setting-profile-tab">
                <div className="card-body">
                    <div className="profile-tab profile-container">

                        <form className="app-form" onSubmit={submit}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input
                                            className="form-control"
                                            placeholder="enter username"
                                            onChange={(e) => setData('name', e.target.value)}
                                            value={data.name}
                                            type="text" />
                                    </div>
                                    {errors.name && <InputError message={errors.name} />}
                                </div>


                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label">Email address</label>
                                        <input className="form-control"
                                            placeholder="enter your email"
                                            onChange={(e) => setData('email', e.target.value)}
                                            value={data.email}
                                            type="email" />
                                    </div>

                                    {errors.email && <InputError message={errors.email} />}
                                </div>
                                <div className="col-12">
                                    <div className="text-end">
                                        <button disabled={processing} className="btn btn-primary"
                                            type="submit"> {processing ? 'submitting' : 'submit'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}
