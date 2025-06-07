import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function User({ users: initialPaginatedData }) {
    const [paginatedData, setPaginatedData] = useState(initialPaginatedData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(initialPaginatedData.data);
    const { flash, auth } = usePage().props;
    const { delete: destroy, get } = useForm();

    const tableHead = ['Name', 'Email', 'Actions'];

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    // Frontend search function
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        if (term === '') {
            setFilteredData(paginatedData.data);
        } else {
            const filtered = paginatedData.data.filter(user => 
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
            );
            setFilteredData(filtered);
        }
    };

    // Pagination functions
    const goToPage = (url) => {
        get(url, {
            preserveState: true,
            onSuccess: (data) => {
                setPaginatedData(data.props.users);
                setFilteredData(data.props.users.data);
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
                destroy(route('users.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Refresh the current page after deletion
                        get(route('users.index', { page: paginatedData.current_page }), {
                            preserveState: true,
                            onSuccess: (data) => {
                                setPaginatedData(data.props.users);
                                setFilteredData(data.props.users.data);
                                ShowMessage('success', flash.message || 'User deleted successfully');
                            }
                        });
                    },
                    onError: () => ShowMessage('error', flash.error || 'Failed to delete user'),
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            
            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <BreadCrumbHeader breadcrumbs={[
                        { href: route('users.index'), label: 'Users', active: true }
                    ]} />

                    {auth.user.role === 'admin' && (
                        <Link href={route('register')} className="btn btn-primary btn-sm">
                            <i className="ti ti-plus me-1"></i> Add User
                        </Link>
                    )}
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
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <Table responsive size="sm" hover bordered>
                        <thead>
                            <tr>
                                {tableHead.map((head, index) => (
                                    <th key={index} className={index === tableHead.length - 1 ? "text-end" : ""}>
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        {auth.user.role === 'admin' && (
                                            <td className="text-end">
                                                <div className="d-flex gap-4 justify-content-end">
                                                    <button 
                                                        className="dropdown-item" 
                                                        onClick={() => handleDelete(user.id)} 
                                                        title="Delete"
                                                    >
                                                        <i className="ti ti-trash text-danger"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                        {auth.user.role !== 'admin' && <td></td>}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={tableHead.length} className="text-center">
                                        {searchTerm ? 'No matching users found' : 'No users found'}
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