import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import { Eye, Pen } from 'lucide-react';
import React, { useState } from 'react';
import { Button, Table, Pagination } from 'react-bootstrap';
import Tooltip from './Tooltip';

const PurchaseListTab = ({ client, clientVendors, tableRef }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = clientVendors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(clientVendors.length / itemsPerPage);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Table bordered responsive size='md' ref={tableRef} className="table table-striped text-start align-middle">
                <thead>
                    <tr>
                        <th className="text-start align-middle">Party Name</th>
                        <th className="text-start align-middle">Contact Number</th>
                        <th className="text-start align-middle">Email</th>
                        <th className="text-start align-middle">Description</th>
                        <th className="text-start align-middle">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(entry => (
                        <tr key={`purchase-list-${entry.id}`} className="align-middle">
                            <td className="text-start align-middle">
                                <Link className='text-primary' href={route('purchase-list.index', ({ client_id: client?.id, vendor_id: entry.id }))}>
                                    {entry.vendor_name}
                                </Link>
                                <small className="text-muted"> <br />
                                    {new Date(entry.created_at).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </small>
                            </td>

                            <td className="text-start align-middle">
                                <div className="fw-medium">
                                    {entry.contact_number}
                                </div>
                            </td>

                            <td className="text-start align-middle">
                                {entry.email}
                            </td>

                            <td className="text-start align-middle">
                                {entry.description}
                            </td>

                            <td className="text-start align-middle">
                                <Tooltip text="View">
                                    <Link href={route('purchase-list.index', ({ client_id: client?.id, vendor_id: entry.id }))}>
                                        <Eye className='text-success' size={20} />
                                    </Link>
                                </Tooltip>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            {clientVendors.length > itemsPerPage && (
                <div className="d-flex justify-content-end mt-3">
                    <Pagination>
                        <Pagination.First 
                            onClick={() => paginate(1)} 
                            disabled={currentPage === 1} 
                        />
                        <Pagination.Prev 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1} 
                        />
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <Pagination.Item
                                key={number}
                                active={number === currentPage}
                                onClick={() => paginate(number)}
                            >
                                {number}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === totalPages} 
                        />
                        <Pagination.Last 
                            onClick={() => paginate(totalPages)} 
                            disabled={currentPage === totalPages} 
                        />
                    </Pagination>
                </div>
            )}
        </>
    );
};

export default PurchaseListTab;