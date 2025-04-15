import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="h-screen" style={{ minHeight: "700px", height: "100vh" }}>
                <Link href={route('register')} className="btn btn-primary me-2">
                    Add User
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
