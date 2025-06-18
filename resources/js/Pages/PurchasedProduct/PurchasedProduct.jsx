import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup, Row, Col, Collapse, Pagination } from 'react-bootstrap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { IndianRupee, Percent, Calculator, Search, User, ChevronDown, ChevronUp, FileText, ArrowDown, ArrowUp, CreditCard } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { ShowMessage } from '@/Components/ShowMessage';

export default function PurchasedProduct({ vendor, clientAccounts }) {

    const { flash } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClient, setExpandedClient] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(10);

    // Transform clientAccounts into array and calculate grand totals
    const { clientSummaries, grandTotals } = useMemo(() => {
        const summaries = Object.values(clientAccounts).map(account => {
            const serviceChargeTotal = account.total_purchases;
            const totalWithService = account.total_purchases + serviceChargeTotal;

            return {
                ...account,
                serviceChargeTotal,
                totalWithService
            };
        });

        const totals = summaries.reduce((acc, curr) => ({
            purchases: acc.purchases + curr.total_purchases,
            returns: acc.returns + curr.total_returns,
            payments: acc.payments + curr.total_payments,
            balance: acc.balance + curr.balance,
            serviceCharge: acc.serviceCharge + curr.serviceChargeTotal,
            withService: acc.withService + curr.totalWithService
        }), {
            purchases: 0,
            returns: 0,
            payments: 0,
            balance: 0,
            serviceCharge: 0,
            withService: 0
        });

        return { clientSummaries: summaries, grandTotals: totals };
    }, [clientAccounts]);

    useEffect(() => {
        if (flash?.message) {
            ShowMessage('success', flash.message);
            // Clear the flash message after showing it
        }
        if (flash?.error) {
            ShowMessage('error', flash.error);
            // Clear the flash message after showing it
        }
    }, [flash]);

    // Filter and paginate clients
    const filteredClients = useMemo(() => {
        const filtered = clientSummaries.filter(({ client }) =>
            client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const startIdx = (currentPage - 1) * clientsPerPage;
        return filtered.slice(startIdx, startIdx + clientsPerPage);
    }, [clientSummaries, searchTerm, currentPage]);

    const totalPages = Math.ceil(clientSummaries.length / clientsPerPage);

    const toggleClientExpand = (clientId) => {
        setExpandedClient(expandedClient === clientId ? null : clientId);
    };

    const breadcrumbs = [
        { href: '/client-vendor', label: 'Parties', active: false },
        { href: `/client-vendor/${vendor.id}`, label: vendor.vendor_name, active: true }
    ];

    return (
        <AuthenticatedLayout>
            <BreadCrumbHeader breadcrumbs={breadcrumbs} />

            {/* Analytics Summary Cards */}
            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                                    <IndianRupee size={20} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">Total Purchases</h6>
                                    <h5 className="mb-0">₹{grandTotals.purchases.toLocaleString('en-IN')}</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-danger bg-opacity-10 p-2 rounded me-3">
                                    <ArrowDown size={20} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">Total Returns</h6>
                                    <h5 className="mb-0">₹{grandTotals.returns.toLocaleString('en-IN')}</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                    <ArrowUp size={20} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">Total Payments</h6>
                                    <h5 className="mb-0">₹{grandTotals.payments.toLocaleString('en-IN')}</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                                    <CreditCard size={20} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">Net Balance</h6>
                                    <h5 className="mb-0">₹{grandTotals.balance.toLocaleString('en-IN')}</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search and Client Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="p-3 border-bottom">
                        <InputGroup>
                            <InputGroup.Text className="border-0">
                                <Search size={16} />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search clients by name or email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border-0"
                            />
                        </InputGroup>
                    </div>

                    <Table hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>Client</th>
                                <th className="text-end">Purchases</th>
                                <th className="text-end">Returns</th>
                                <th className="text-end">Payments</th>
                                <th className="text-end">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length > 0 ? (
                                filteredClients.map(({
                                    client,
                                    total_purchases,
                                    total_returns,
                                    total_payments,
                                    balance,
                                    purchase_lists,
                                    serviceRate,
                                    serviceChargeTotal,
                                    totalWithService
                                }) => (
                                    <React.Fragment key={client.id}>
                                        <tr
                                            onClick={() => toggleClientExpand(client.id)}
                                            style={{ cursor: 'pointer' }}
                                            className={expandedClient === client.id ? 'table-active' : ''}
                                        >
                                            <td className="text-center">
                                                {expandedClient === client.id ?
                                                    <ChevronUp size={18} /> :
                                                    <ChevronDown size={18} />}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light p-2 rounded me-3">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <strong>{client.client_name}</strong>
                                                        <div className="small text-muted">
                                                            {client.client_email || 'No email'} | {client.client_phone || 'No phone'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <div className="fw-bold">₹{total_purchases.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="text-end">
                                                <div className="text-danger">₹{total_returns.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="text-end">
                                                <div className="text-success">₹{total_payments.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="text-end">
                                                <Badge bg={balance >= 0 ? 'success' : 'danger'} pill>
                                                    ₹{Math.abs(balance).toLocaleString('en-IN')}
                                                    {balance < 0 && ' (Cr)'}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={12} className="p-0 border-0">
                                                <Collapse in={expandedClient === client.id}>
                                                    <div className="p-3">
                                                        <Row>
                                                            {/* <Col md={12}>
                                                                <h6 className="mb-3 d-flex align-items-center">
                                                                    <FileText size={18} className="me-2" />
                                                                    Payments
                                                                </h6>
                                                                <div className="table-responsive">
                                                                    <Table bordered size="sm">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Date</th>
                                                                                <th>List Name</th>
                                                                                <th className="text-end">Amount</th>
                                                                                <th className="text-end">Service</th>
                                                                                <th className="text-end">Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                purchase_lists.map((list) => (
                                                                                    <tr key={list.id}>
                                                                                        <td>{new Date(list.created_at).toLocaleDateString()}</td>
                                                                                        <td>{list.list_name}</td>
                                                                                        <td className="text-end">₹{parseFloat(list.total_amount).toLocaleString('en-IN')}</td>
                                                                                        <td className="text-end">{serviceRate}%</td>
                                                                                        <td className="text-end fw-bold">
                                                                                            ₹{(parseFloat(list.total_amount) + (parseFloat(list.total_amount) * serviceRate / 100)).toLocaleString('en-IN')}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))

                                                                            }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </Col> */}
                                                            <Col md={12}>
                                                                <h6 className="mb-3 d-flex align-items-center">
                                                                    <CreditCard size={18} className="me-2" />
                                                                    Account Summary
                                                                </h6>
                                                                <Card>
                                                                    <Card.Body>
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Total Purchases:</span>
                                                                            <strong>₹{total_purchases.toLocaleString('en-IN')}</strong>
                                                                        </div>

                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Total Returns:</span>
                                                                            <strong className="text-danger">₹{total_returns.toLocaleString('en-IN')}</strong>
                                                                        </div>
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Total Payments:</span>
                                                                            <strong className="text-success">₹{total_payments.toLocaleString('en-IN')}</strong>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="d-flex justify-content-between">
                                                                            <span className="fw-bold">Net Balance:</span>
                                                                            <strong className={balance >= 0 ? 'text-success' : 'text-danger'}>
                                                                                ₹{Math.abs(balance).toLocaleString('en-IN')}
                                                                            </strong>
                                                                        </div>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Collapse>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                            <Search size={48} className="text-muted mb-3" />
                                            <h5>No clients found</h5>
                                            <p className="text-muted">Try adjusting your search query</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    {clientSummaries.length > clientsPerPage && (
                        <div className="d-flex justify-content-center p-3 border-top">
                            <Pagination className="mb-0">
                                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = Math.max(1, Math.min(
                                        totalPages - 4,
                                        currentPage - 2
                                    )) + i;
                                    return (
                                        <Pagination.Item
                                            key={page}
                                            active={page === currentPage}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Pagination.Item>
                                    );
                                })}
                                <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}