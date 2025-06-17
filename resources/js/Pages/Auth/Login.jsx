import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleInputChange = (field, value) => {
        clearErrors(field);
        setData(field, value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                Swal.fire({
                    title: 'Success',
                    text: 'Login Successfully',
                    icon: 'success',
                });
            },
            preserveState: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form className="app-form p-3" onSubmit={submit}>
                <div className="mb-3 text-center">
                    <h3>Login to your Account</h3>
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter Your Email"
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter Your Password"
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="formCheck1"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="formCheck1">
                        Remember me
                    </label>
                </div>

                <div>
                    <button 
                        disabled={processing} 
                        type="submit" 
                        className="btn btn-primary w-100"
                    >
                        {processing ? 'Logging in...' : 'Submit'}
                    </button>
                </div>

            

               
            </form>
        </GuestLayout>
    );
}