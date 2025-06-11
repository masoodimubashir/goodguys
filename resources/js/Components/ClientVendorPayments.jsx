import React, { useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { FileText, IndianRupee, Calendar, ArrowRightLeft } from 'lucide-react';

const ClientVendorPayments = ({ payments, openClientAccountModal }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate pagination data
    const totalPages = Math.ceil(payments.length / itemsPerPage);
    const paginatedData = payments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        let items = [];

        // Previous button
        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            />
        );

        // Page numbers
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        // Next button
        items.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    return (


        <>


            <div className="d-flex justify-content-end align-items-center mb-2">

                <div className="d-flex gap-2">
                    <Button variant="outline-info" size="sm" onClick={() => openClientAccountModal()}>
                        <i className="ti ti-building-bank me-1"></i> Make Payment
                    </Button>
                </div>
            </div>

            <Table hover responsive size="sm" className="mb-0">
                <thead className="table-light">
                    <tr>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <Calendar size={14} />
                                Date
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <ArrowRightLeft size={14} />
                                Transaction
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <IndianRupee size={14} />
                                Amount
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <FileText size={14} />
                                Narration
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((payment) => (
                        <tr key={payment.id}>
                            <td>
                                <small>{formatDate(payment.transaction_date)}</small>
                            </td>
                            <td>
                                <span className="">
                                    Payment to {payment.vendor?.vendor_name || 'Vendor'}
                                </span>
                            </td>
                            <td>
                                {formatCurrency(payment.amount)}
                            </td>
                            <td>
                                <small className="text-muted">
                                    {payment.narration || 'No description'}
                                </small>
                            </td>
                        </tr>
                    ))}

                    {paginatedData.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-5">
                                <div className="text-muted">
                                    <FileText size={20} className="mb-3 opacity-50" />
                                    <h5 className="mb-2">No Payments Found</h5>
                                    <p>No payment records available</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {payments.length > itemsPerPage && (
                <div className="d-flex justify-content-center">
                    <Pagination className="mb-0">
                        {renderPaginationItems()}
                    </Pagination>
                </div>
            )}
        </>

    );
};

export default ClientVendorPayments;