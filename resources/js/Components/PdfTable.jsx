import React, { useState, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link, router } from '@inertiajs/react';
import { ProformaPdf } from '@/Pages/PDF/ProformaPdf';
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';
import { Download, Edit, FileText, RefreshCw, Trash2 } from 'lucide-react';
import { InvoicePdf } from '@/Pages/PDF/InvoicePdf';

export default function PdfTable({ client, CompanyProfile, BankProfile }) {


    const [convertingId, setConvertingId] = useState(null);

    const mergedData = useMemo(() => {
        const entries = [];

        if (client?.invoice_refrences?.length > 0) {
            client.invoice_refrences.forEach(reference => {
                entries.push({
                    id: reference.id,
                    type: 'Invoice',
                    reference_number: reference.invoice_number,
                    created_at: reference.created_at,
                    products: reference.products,
                    is_price_visible: reference.is_price_visible
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
                    products: reference.products,
                    is_price_visible: reference.is_price_visible,
                    is_converted_to_invoice: reference.is_converted_to_invoice
                });
            });
        }

        return entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [client]);

    const handleDeleteItem = (id, type) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `This will permanently delete the ${type.toLowerCase()}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const routeName = type === 'Invoice' ? 'invoice.destroy' : 'proforma.destroy';
                router.delete(route(routeName, { id }), {
                    onSuccess: () => {
                        Swal.fire('Deleted!', `${type} has been deleted.`, 'success');
                    },
                    onError: () => {
                        Swal.fire('Failed!', `Failed to delete the ${type.toLowerCase()}.`, 'error');
                    }
                });
            }
        });
    };

    const handleConvertToInvoice = (id) => {
        Swal.fire({
            title: 'Convert to Quotation?',
            text: 'This will create a new invoice from the proforma',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Convert'
        }).then((result) => {
            if (result.isConfirmed) {
                setConvertingId(id);
                router.post(route('create-invoice-from-pdf', { id }), {
                    onSuccess: () => {
                        Swal.fire('Success!', 'Quotation Created.', 'success');
                        setConvertingId(null);
                    },
                    onError: () => {
                        Swal.fire('Error!', 'Failed to create Quotation.', 'error');
                        setConvertingId(null);
                    }
                });
            }
        });
    };

    return (
        <>
            <div className="table-responsive">

                <div className="d-flex justify-content-end align-items-center mb-3">
                    <div className='d-flex align-items-center gap-2 mt-2 mb-2'>
                        <Link
                            href={route('invoice.create', { client_id: client.id })}
                            className="btn btn-sm btn-primary d-flex align-items-center gap-2"
                        >
                            Create Quotition
                        </Link>
                      <Link
                            href={route('proforma.create', { client_id: client.id })}
                            className="btn btn-sm btn-primary d-flex align-items-center gap-2"
                        >
                            Create Estimate
                        </Link>
                    </div>
                </div>

                <Table size="sm" bordered hover className="mb-0">
                    <thead>
                        <tr>
                            <th className="text-start">Date</th>
                            <th className="text-start">Type</th>
                            <th className="text-start">Reference</th>
                            <th className="text-start">Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedData.length > 0 ? (
                            mergedData.map(entry => (
                                <tr key={`${entry.type}-${entry.id}`} className="align-middle">
                                    <td className="text-start">
                                        <div className="d-flex flex-column">
                                            <span className="small">
                                                {new Date(entry.created_at).toLocaleDateString("en-US", {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <small className="text-muted">
                                                {new Date(entry.created_at).toLocaleTimeString("en-US", {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </small>
                                        </div>
                                    </td>

                                    <td className="text-start">
                                        <span className={`badge ${entry.type === 'Invoice' ? 'bg-primary' : 'bg-info'} text-white d-flex align-items-center gap-1`}>
                                            {entry.type}
                                        </span>
                                    </td>

                                    <td className="text-start">
                                        <span className="font-monospace">{entry.reference_number}</span>
                                    </td>

                                    <td className="text-start">
                                        {entry.type === 'Proforma' && (
                                            <span className={`badge ${entry.is_converted_to_invoice ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {entry.is_converted_to_invoice ? 'Converted' : 'Pending'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="text-end">
                                        <div className="d-flex gap-2 justify-content-end">
                                            {entry.type === 'Proforma' && !entry.is_converted_to_invoice && (
                                                <button
                                                    onClick={() => handleConvertToInvoice(entry.id)}
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                                    disabled={convertingId === entry.id}
                                                    title="Convert to Invoice"
                                                >
                                                    {convertingId === entry.id ? (
                                                        <RefreshCw size={16} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Download size={16} />
                                                            <span className="d-none d-md-inline">Convert</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}



                                            {
                                                entry.type === 'Proforma' && (

                                                    <>
                                                        <Link
                                                            href={entry.type === 'Invoice'
                                                                ? route('invoice.edit', { id: entry.id })
                                                                : route('proforma.edit', { id: entry.id })
                                                            }
                                                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                                        >
                                                            <Edit size={16} />
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDeleteItem(entry.id, entry.type)}
                                                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>

                                                )
                                            }

                                            <PDFDownloadLink
                                                document={
                                                    entry.type === 'Invoice' ? (
                                                        <InvoicePdf client={client} CompanyProfile={CompanyProfile} data={entry} BankProfile={BankProfile} />
                                                    ) : (
                                                        <ProformaPdf client={client} CompanyProfile={CompanyProfile} data={entry} BankProfile={BankProfile} />
                                                    )
                                                }
                                                fileName={`${entry.type.toLowerCase()}-${entry.reference_number}.pdf`}
                                                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                            >
                                                {({ loading }) => (
                                                    <>
                                                        {loading ? (
                                                            <RefreshCw size={16} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Download size={16} />
                                                                
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </PDFDownloadLink>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">
                                    No invoices or proformas found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
}



