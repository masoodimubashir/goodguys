import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup, Row, Col, Collapse, Pagination, Spinner } from 'react-bootstrap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { IndianRupee, Percent, Calculator, Search, User, ChevronDown, ChevronUp, FileText, ArrowDown, ArrowUp, CreditCard } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import { ShowMessage } from '@/Components/ShowMessage';
import { Button, Modal } from 'react-bootstrap';
import Tooltip from '@/Components/Tooltip';

export default function PurchasedProduct({ vendor, clientAccounts }) {
    const { flash, errors: serverErrors } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClient, setExpandedClient] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(10);

    // Payment Modal State
    const [showModal, setShowModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        amount: '',
        created_at: new Date().toISOString().split('T')[0],
        narration: '',
        vendor_id: vendor.id,
        client_id: ''
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleOpenPaymentModal = () => {
        setPaymentData({
            amount: '',
            created_at: new Date().toISOString().split('T')[0],
            narration: '',
            vendor_id: vendor.id,
            client_id: ''
        });
        setErrors({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setErrors({});
        setProcessing(false);
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validatePayment = () => {
        const newErrors = {};
        let isValid = true;

        // Validate client selection
        if (!paymentData.client_id) {
            newErrors.client_id = 'Please select a client';
            isValid = false;
        }

        // Validate amount
        if (!paymentData.amount || paymentData.amount.trim() === '') {
            newErrors.amount = 'Amount is required';
            isValid = false;
        } else if (isNaN(paymentData.amount)) {
            newErrors.amount = 'Amount must be a number';
            isValid = false;
        } else if (parseFloat(paymentData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
            isValid = false;
        } else if (paymentData.client_id) {
            const selectedClient = clientSummaries.find(c => c.client.id === parseInt(paymentData.client_id));
            if (selectedClient && parseFloat(paymentData.amount) > selectedClient.balance) {
                newErrors.amount = `Amount cannot exceed ₹${selectedClient.balance.toLocaleString('en-IN')}`;
                isValid = false;
            }
        }

        // Validate date
        if (!paymentData.created_at) {
            newErrors.created_at = 'Date is required';
            isValid = false;
        }

    

        setErrors(newErrors);
        return isValid;
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();

        if (!validatePayment()) return;

        setProcessing(true);

        router.post('/purchase-list-payments', paymentData, {
            onSuccess: () => {
                ShowMessage('success', 'Payment done..');
                handleCloseModal();
            },
            onError: (errors) => {
                setErrors(errors);
                if (errors.balance) {
                    setErrors(prev => ({
                        ...prev,
                        amount: errors.balance
                    }));
                }
                setProcessing(false);
            },
            preserveScroll: true
        });
    };

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
        }
        if (flash?.error) {
            ShowMessage('error', flash.error);
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
        { href: `/client-vendor/${vendor.id}`, label: vendor.vendor_name, active: false },
        { href: '/client-vendor', label: 'Back', active: true },
    ];

    return (
        <AuthenticatedLayout>
            <BreadCrumbHeader breadcrumbs={breadcrumbs} />

            {/* Analytics Summary Cards */}
            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Card className=" border-0 shadow-sm">
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
                    <Card className=" border-0 shadow-sm">
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
                    <Card className=" border-0 shadow-sm">
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
                    <Card className=" border-0 shadow-sm">
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

            <div className='d-flex justify-content-end align-items-center mb-3'>
                <Tooltip text="Make payment">
                    <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={handleOpenPaymentModal}
                    >
                        Make Payment
                    </Button>
                </Tooltip>
            </div>

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
                                                        <Tooltip text={'Click To View Client'}>
                                                            <strong>
                                                                <Link href={`/clients/${client.id}`} className="text-primary">
                                                                    {client.client_name}
                                                                </Link>
                                                            </strong>
                                                        </Tooltip>
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

            {/* Payment Modal */}
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" centered>
                
                <Modal.Header closeButton>
                    <Modal.Title>
                        <CreditCard size={20} className="me-2" />
                        Make Payment
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handlePaymentSubmit} noValidate>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Select Client</Form.Label>
                            <Form.Select
                                name="client_id"
                                value={paymentData.client_id}
                                onChange={handlePaymentChange}
                                isInvalid={!!errors.client_id}
                                required
                            >
                                <option value="">Select a client</option>
                                {clientSummaries.map(({ client, balance }) => (
                                    <option key={client.id} value={client.id}>
                                        {client.client_name} (₹{balance.toLocaleString('en-IN')})
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.client_id}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount (₹)</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={paymentData.amount}
                                onChange={handlePaymentChange}
                                isInvalid={!!errors.amount}
                                placeholder="Enter payment amount"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.amount}
                            </Form.Control.Feedback>
                            {paymentData.client_id && (
                                <small className="text-muted">
                                    Max payable: ₹{
                                        clientSummaries.find(c => c.client.id === parseInt(paymentData.client_id))?.balance.toLocaleString('en-IN') || 0
                                    }
                                </small>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="created_at"
                                value={paymentData.created_at}
                                onChange={handlePaymentChange}
                                isInvalid={!!errors.created_at}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.created_at}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="narration"
                                value={paymentData.narration}
                                onChange={handlePaymentChange}
                                isInvalid={!!errors.narration}
                                placeholder="Enter payment description"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.narration}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={processing}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">Processing...</span>
                                </>
                            ) : (
                                'Make Payment'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}