import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import Swal from 'sweetalert2';

export default function UpdatePasswordForm() {
    
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
        clearErrors
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });


    const handleOnChange = (field, value) => {
        setData(field, value);
        clearErrors(field);
    }

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                Swal.fire({
                    title: 'Success',
                    text: 'Password updated successfully',
                    icon: 'success',
                });
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <>
            <div className="card setting-profile-tab">
                <div className="card-body">
                    <div className="profile-tab profile-container">

                        <form className="app-form" onSubmit={updatePassword}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <InputLabel htmlFor="password" value="New Password" />


                                        <TextInput
                                            id="password"
                                            ref={passwordInput}
                                            value={data.password}
                                            onChange={(e) => handleOnChange('password', e.target.value)}
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                        />
                                    </div>



                                    <InputError message={errors.password} className="mt-2" />
                                </div>


                                <div className="col-12">
                                    <div className="mb-3">
                                        <InputLabel
                                            htmlFor="current_password"
                                            value="Current Password"
                                        />
                                        <TextInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            value={data.current_password}
                                            onChange={(e) => handleOnChange('current_password', e.target.value)}
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="current-password"
                                        />


                                    </div>
                                    <InputError
                                        message={errors.current_password}
                                        className="mt-2"
                                    />

                                </div>

                                <div className="col-12">
                                    <div className="mb-3">
                                        <InputLabel
                                            htmlFor="password_confirmation"
                                            value="Confirm Password"
                                        />

                                        <TextInput
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => handleOnChange('password_confirmation', e.target.value)}
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />

                                </div>
                                <div className="col-12">
                                    <div className="text-end">
                                        <button disabled={processing} className="btn btn-primary"
                                            type="submit"> {processing ? 'submitting' : 'submit'}
                                        </button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600">
                                                Saved.
                                            </p>
                                        </Transition>
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


