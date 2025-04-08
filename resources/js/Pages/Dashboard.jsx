import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (

        <AuthenticatedLayout >

            <Head title="Dashboard" />


            <div className="h-screen" style={{ minHeight: "700px", height: "100vh" }}>
               
            </div>
        </AuthenticatedLayout>

    );
}
