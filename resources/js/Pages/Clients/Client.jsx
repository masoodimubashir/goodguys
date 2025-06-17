import React, { useEffect, useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Client({ clients: initialPaginatedData }) {


    

    const [paginatedData, setPaginatedData] = useState(initialPaginatedData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(initialPaginatedData.data);
    const { flash, auth } = usePage().props;
    const { delete: destroy, get } = useForm();

    const tableHead = [
        'Name', 'Client Type', 'Site / Product', 'Email', 'Phone', 'Address',
        'Service Charge', 'Actions'
    ];

     useEffect(() => {
        if (flash.message) {
            ShowMessage('success', flash.message);
            // Clear the flash message
            router.reload({ only: [], preserveScroll: true, preserveState: true });
        }
        if (flash.error) {
            ShowMessage('error', flash.error);
            // Clear the flash message
            router.reload({ only: [], preserveScroll: true, preserveState: true });
        }
    }, [flash]);

    // Frontend search function
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        if (term === '') {
            setFilteredData(paginatedData.data);
        } else {
            const filtered = paginatedData.data.filter(client => 
                client.client_name.toLowerCase().includes(term) ||
                (client.client_type && client.client_type.toLowerCase().includes(term)) ||
                (client.site_name && client.site_name.toLowerCase().includes(term)) ||
                (client.client_email && client.client_email.toLowerCase().includes(term)) ||
                (client.client_phone && client.client_phone.toLowerCase().includes(term))
            );
            setFilteredData(filtered);
        }
    };


    // Pagination functions
    const goToPage = (url) => {
        get(url, {
            preserveState: true,
            onSuccess: (data) => {
                setPaginatedData(data.props.clients);
                setFilteredData(data.props.clients.data);
                setSearchTerm(''); // Reset search on page change
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('clients.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Refresh the current page after deletion
                        get(route('clients.index', { page: paginatedData.current_page }), {
                            preserveState: true,
                            onSuccess: (data) => {
                                setPaginatedData(data.props.clients);
                                setFilteredData(data.props.clients.data);
                            }
                        });
                    },
                    onError: () => ShowMessage('error', flash.error || 'Failed to delete client'),
                });
            }
        });
    };

    const breadcrumbs = [
        { href: '/clients', label: 'Clients', active: true }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Clients" />

            <div className="row g-4">
                <div className="d-flex justify-content-between align-items-center">
                    <BreadCrumbHeader breadcrumbs={breadcrumbs} />

                    <Link href={route('clients.create')} className="btn btn-sm btn-primary me-2">
                        <i className="ti ti-plus me-1"></i> Add Client
                    </Link>
                </div>

                {/* Search Input */}
                <div className="col-12">
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <Table size="sm" bordered hover responsive>
                        <thead>
                            <tr>
                                {tableHead.map((head, index) => (
                                    <th key={index}>{head}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((client) => (
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
                                        <td>
                                            <div className="d-flex">
                                                <Link className="dropdown-item" href={route('clients.edit', client.id)} title='Edit'>
                                                    <i className="ti ti-edit"></i>
                                                </Link>
                                                <button className="dropdown-item" onClick={() => handleDelete(client.id)} title='Delete'>
                                                    <i className="ti ti-trash text-danger"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={tableHead.length} className="text-center">
                                        {searchTerm ? 'No matching clients found' : 'No clients found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination Controls */}
                    {filteredData.length > 0 && !searchTerm && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                Showing {paginatedData.from} to {paginatedData.to} of {paginatedData.total} entries
                            </div>
                            <div className="d-flex">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${!paginatedData.prev_page_url ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => goToPage(paginatedData.prev_page_url)}
                                            disabled={!paginatedData.prev_page_url}
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                    </li>
                                    
                                    {Array.from({ length: paginatedData.last_page }, (_, i) => i + 1).map(page => (
                                        <li key={page} className={`page-item ${page === paginatedData.current_page ? 'active' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => goToPage(`${paginatedData.path}?page=${page}`)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}
                                    
                                    <li className={`page-item ${!paginatedData.next_page_url ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => goToPage(paginatedData.next_page_url)}
                                            disabled={!paginatedData.next_page_url}
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}