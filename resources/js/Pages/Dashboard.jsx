import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { InvoicePdf } from '@/Pdf/InvoicePdf';
import { Head } from '@inertiajs/react';
import { PDFViewer } from '@react-pdf/renderer';

export default function Dashboard() {
    return (

        <AuthenticatedLayout >

            <Head title="Dashboard" />


            <div className="h-screen" style={{ minHeight: "700px", height: "100vh" }}>
                <PDFViewer>
                    <InvoicePdf />
                </PDFViewer>
            </div>
        </AuthenticatedLayout>

    );
}
