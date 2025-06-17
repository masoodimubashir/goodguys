import { Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";
import { Table } from "react-bootstrap";
import { Edit2, Trash, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

export default function Inventory({ inventories: initialPaginatedData }) {


    console.log(initialPaginatedData);
    

    const [paginatedData, setPaginatedData] = useState(initialPaginatedData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(initialPaginatedData.data);
    const { flash, auth } = usePage().props;
    const { delete: destroy, get } = useForm();

    const tableHead = [
        'Item Name',
        'Count',
        'Selling Price',
        'Buying Price',
        'Item Type',
        'Item Subtype',
        'Dimensions',
        'Description',
        'Actions'
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
            const filtered = paginatedData.data.filter(item =>
                item.item_name.toLowerCase().includes(term) ||
                (item.item_type && item.item_type.toLowerCase().includes(term)) ||
                (item.item_sub_type && item.item_sub_type.toLowerCase().includes(term)) ||
                (item.description && item.description.toLowerCase().includes(term))
            );
            setFilteredData(filtered);
        }
    };

    // Pagination functions
    const goToPage = (url) => {
        get(url, {
            preserveState: true,
            onSuccess: (data) => {
                setPaginatedData(data.props.inventories);
                setFilteredData(data.props.inventories.data);
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
                destroy(route('inventory.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Refresh the current page after deletion
                        get(route('inventory.index', { page: paginatedData.current_page }), {
                            preserveState: true,
                            onSuccess: (data) => {
                                setPaginatedData(data.props.inventories);
                                setFilteredData(data.props.inventories.data);
                                ShowMessage('success', flash.message);
                            }
                        });
                    },
                    onError: () => ShowMessage('error', flash.error),
                });
            }
        });
    };

    const breadcrumbs = [
        { href: '/inventory', label: 'Inventory', active: true }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Inventory" />

            <div className="row g-4">
                <div className="d-flex justify-content-between align-items-center">
                    <BreadCrumbHeader breadcrumbs={breadcrumbs} />
                    <Link href={route('inventory.create')} className="btn btn-sm btn-primary">
                        <i className="ti ti-plus me-1"></i> Add Item
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
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <Table size="sm" hover bordered>
                        <thead className="table-light">
                            <tr>
                                {tableHead.map((head, index) => (
                                    <th key={index} className="text-nowrap">{head}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td><span className="badge bg-secondary px-3 py-2">{item.item_name}</span></td>
                                        <td>{item.count}</td>
                                        <td>₹{(item.selling_price)}</td>
                                        <td>₹{(item.buying_price)}</td>
                                        <td>{item.item_type}</td>
                                        <td>{item.item_sub_type || <span className="text-muted">N/A</span>}</td>
                                        <td>
                                            {Array.isArray(item.item_dimensions) ? (
                                                item.item_dimensions.map((dimension, index) => {
                                                    const [name, value, unit] = dimension.split(',');
                                                    return (
                                                        <div key={index}>
                                                            <span className="badge bg-light text-dark border me-1 mb-1">
                                                                {name}: {value} {unit}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-muted">N/A</span>
                                            )}
                                        </td>
                                        <td>{item.description || <span className="text-muted">N/A</span>}</td>

                                        <td>
                                            <div className="d-flex align-items-center justify-items-center">
                                                <Link className="dropdown-item" href={route('inventory.edit', item.id)} title="Edit">
                                                    <Edit2 size={16}></Edit2>
                                                </Link>
                                                <button className="dropdown-item text-danger" onClick={() => handleDelete(item.id)} title="Delete">
                                                    <Trash size={16}></Trash>
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={tableHead.length} className="text-center text-muted py-4">
                                        <i className="ti ti-box fs-4 d-block mb-2"></i>
                                        {searchTerm ? 'No matching items found' : 'No inventory items found'}
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