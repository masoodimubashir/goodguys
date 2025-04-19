import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';

export default function Client({ clients: initialClients }) {
    

    const [clients, setClients] = useState(initialClients);
    const tableHead = [
        'Name', 'Client Type', 'Site  / Product', 'Email', 'Phone', 'Address',
        'Service Charge (%)', 'Actions'
    ];
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();


    useEffect(() => {
        if (flash.message) {
            ShowMessage('success', flash.message);
        }
        if (flash.error) {
            ShowMessage('error', flash.error);
        }
    }, [flash]);

    const initializeDataTable = () => {
        if (tableRef.current) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
            if (clients.length > 0) {
                $(tableRef.current).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],
                });
            }
        }
    };


    useEffect(() => {
        initializeDataTable();
        return () => {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, [clients]);

    const handleDelete = (id) => {
        destroy(route('clients.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                if ($.fn.DataTable.isDataTable(tableRef.current)) {
                    $(tableRef.current).DataTable().destroy();
                }
                setClients(clients.filter(client => client.id !== id));
                ShowMessage('success', 'Client deleted successfully');
            },
            onError: () => ShowMessage('error', 'Failed to delete client'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Clients" />

            <div className="row g-4 mb-3 mt-3">
                <div className="d-flex justify-content-end align-items-center">
                    {auth.user.role === 'admin' && (
                        <Link href={route('clients.create')} className="btn btn-primary me-2">
                            Add Client
                        </Link>
                    )}
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="app-scroll table-responsive">
                                <table ref={tableRef} className="table table-striped">
                                    <thead>
                                        <tr>
                                            {tableHead.map((head, index) => (
                                                <th key={index}>{head}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.length > 0 ? (
                                            clients.map((client) => (
                                                <tr key={client.id}>
                                                    <td>
                                                        <Link href={route('clients.show', client.id)} className="text-decoration-underline text-primary">
                                                            {client.client_name}
                                                        </Link>
                                                    </td>
                                                    
                                                    <td>{client.client_type}</td>

                                                    <td>{client.site_name ?? 'NA'}</td>

                                                    <td>{client.client_email}</td>
                                                    
                                                    <td>{client.client_phone}</td>
                                                    
                                                    <td>{client.client_address}</td>
                                                    
                                                    <td>{client.service_charge?.service_charge || 0}</td>
                                                    
                                                    
                                                    {auth.user.role === 'admin' && (
                                                        <td>
                                                            <div className="btn-group dropdown-icon-none">
                                                                <button className="border-0 icon-btn dropdown-toggle active"
                                                                    type="button" data-bs-toggle="dropdown"
                                                                    data-bs-auto-close="true" aria-expanded="false">
                                                                    <i className="ti ti-dots"></i>
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <Link className="dropdown-item" href={route('clients.edit', client.id)}>
                                                                            <i className="ti ti-edit"></i> Edit
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <button className="dropdown-item" onClick={() => handleDelete(client.id)}>
                                                                            <i className="ti ti-trash"></i> Delete
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={tableHead.length} className="text-center">No clients found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
