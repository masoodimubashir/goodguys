import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link, router } from '@inertiajs/react';
import { InvoicePdf } from '@/Pages/PDF/InvoicePdf';
import { ProformaPdf } from '@/Pages/PDF/ProformaPdf';

export default function PdfTable({ client, pdfRef }) {



    const mergedData = React.useMemo(() => {

        const entries = [];

        if (client?.invoice_refrences?.length > 0) {
            client.invoice_refrences.forEach(reference => {
                entries.push({
                    id: reference.id,
                    type: 'Invoice',
                    reference_number: reference.invoice_number,
                    created_at: reference.created_at,
                    invoices: reference.invoices
                });
            });
        }

        if (client?.proforma_refrences?.length > 0) {
            client.proforma_refrences.forEach(reference => {
                entries.push({
                    id: reference.id,
                    type: 'Proforma',
                    reference_number: reference.proforma_number,
                    created_at: reference.created_at,
                    proformas: reference.proformas
                });
            });
        }

        return entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [client]);



    const handleDeleteItem = (id, type) => {

        const routeName = type === 'Invoice' ? 'invoice.destroy' : 'proforma.destroy';
        router.delete(route(routeName, { id }), {
            onSuccess: () => {
                Swal.fire('Deleted!', `${type} has been deleted.`, 'success');
            },
            onError: () => {
                Swal.fire('Failed!', `Failed to delete the ${type.toLowerCase()}.`, 'error');
            }
        });
    };



    return (
        <div className="table-responsive">
            <table className="table table-striped text-start align-middle" ref={pdfRef}>
                <thead>
                    <tr>
                        <th>Created At</th>
                        <th>Type</th>
                        <th>Reference #</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mergedData.length > 0 ? (
                        mergedData.map(entry => (
                            <tr key={`${entry.type}-${entry.id}`} className="align-middle">
                                <td>
                                    <div className="d-flex flex-column">
                                        <span>{new Date(entry.created_at).toLocaleDateString("en-US", {
                                            year: "numeric", month: "long", day: "numeric"
                                        })}</span>
                                        <small className="text-muted">
                                            {new Date(entry.created_at).toLocaleTimeString("en-US", {
                                                hour: "2-digit", minute: "2-digit", hour12: true
                                            })}
                                        </small>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${entry.type === 'Invoice' ? 'bg-primary' : 'bg-info'} text-white`}>
                                        {entry.type}
                                    </span>
                                </td>
                                <td>{entry.reference_number}</td>
                                <td>
                                    <div className="btn-group dropdown-icon-none">
                                        <button
                                            className="btn btn-sm btn-light-subtle border-0 rounded-circle icon-btn"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="ti ti-dots"></i>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                            <li>
                                                <Link
                                                    className="dropdown-item d-flex align-items-center"
                                                    href={
                                                        entry.type === 'Invoice' ? (
                                                            route(`invoice.edit`, { id: entry.id })

                                                        ) : (
                                                            route(`proforma.edit`, { id: entry.id })
                                                        )
                                                    }
                                                >
                                                    <i className="ti ti-edit me-2 text-primary"></i> Edit
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex align-items-center"
                                                    onClick={() => handleDeleteItem(entry.id, entry.type)}
                                                >
                                                    <i className="ti ti-trash me-2 text-danger"></i> Delete
                                                </button>
                                            </li>
                                            <li>
                                                <PDFDownloadLink
                                                    document={
                                                        entry.type === 'Invoice' ? (
                                                            <InvoicePdf client={client} data={entry} />
                                                        ) : (
                                                            <ProformaPdf client={client} data={entry} />
                                                        )
                                                    }
                                                    fileName={`${entry.type.toLowerCase()}-${entry.id}.pdf`}
                                                    className="dropdown-item d-flex align-items-center"
                                                >
                                                    {({ loading }) => (
                                                        <>
                                                            <i className="ti ti-download me-2 text-success"></i>
                                                            {loading ? 'Preparing PDF...' : 'Download PDF'}
                                                        </>
                                                    )}
                                                </PDFDownloadLink>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-muted">
                                No Invoices or Proformas Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
