import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";


export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (

        <AuthenticatedLayout>


            <Head title="Register" />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('dashboard')} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('users.index')} className="f-s-14 f-w-500">Back</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="app-form" onSubmit={submit}>
                                
                                <div className="row">
                                    {/* Username */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="name" value="Username" />
                                            <TextInput
                                                id="name"
                                                className="form-control"
                                                placeholder="Enter Your Username"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter Your Email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="password" value="Password" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter Your Password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                className="form-control"
                                                placeholder="Confirm Your Password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                            />
                                        </div>
                                    </div>


                                    {/* Submit */}
                                    <div className="col-12">
                                        <div className="text-end">
                                            <button className="btn btn-primary" disabled={processing}>
                                                {processing ? 'Submitting...' : 'Submit'}
                                            </button>
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
}


