import React, { useState, useMemo } from 'react';
import { Card, Table, Badge, Form, InputGroup, Row, Col, Collapse, Pagination } from 'react-bootstrap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { IndianRupee, Percent, Calculator, Search, User, ChevronDown, ChevronUp, FileText, ArrowDown, ArrowUp, CreditCard } from 'lucide-react';

export default function PurchasedProduct({ vendor, groupedPurchaseLists }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClient, setExpandedClient] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(10);

    // Calculate analytics with client accounts
    const { clientSummaries, grandTotals } = useMemo(() => {
        const summaries = Object.entries(groupedPurchaseLists).map(([clientId, lists]) => {
            const client = lists[0].client || {};
            const totalRaw = lists.reduce((sum, list) => sum + (parseFloat(list.bill_total) || 0), 0);

            // Calculate service charges
            const serviceRate = client.service_charge?.service_charge || 0;
            const serviceChargeTotal = (totalRaw * serviceRate) / 100;
            const totalWithService = totalRaw + serviceChargeTotal;

            // Calculate account totals
            const accountInTotal = parseFloat(client.clientAccountInTotal) || 0;
            const accountOutTotal = parseFloat(client.clientAccountOutTotal) || 0;
            const netAccountBalance = accountInTotal - accountOutTotal;

            return {
                client,
                lists,
                totalRaw,
                totalWithService,
                serviceChargeTotal,
                serviceRate,
                accountInTotal,
                accountOutTotal,
                netAccountBalance
            };
        });

        // Calculate grand totals
        const grandTotals = summaries.reduce((acc, curr) => ({
            raw: acc.raw + curr.totalRaw,
            withService: acc.withService + curr.totalWithService,
            serviceCharge: acc.serviceCharge + curr.serviceChargeTotal,
            accountIn: acc.accountIn + curr.accountInTotal,
            accountOut: acc.accountOut + curr.accountOutTotal,
            netAccount: acc.netAccount + curr.netAccountBalance
        }), {
            raw: 0,
            withService: 0,
            serviceCharge: 0,
            accountIn: 0,
            accountOut: 0,
            netAccount: 0
        });

        return { clientSummaries: summaries, grandTotals };
    }, [groupedPurchaseLists]);

    // Filter clients based on search
    const filteredClients = useMemo(() => {
        if (!searchTerm) return clientSummaries;
        return clientSummaries.filter(({ client }) =>
            client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.client_email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clientSummaries, searchTerm]);

    // Get current clients for pagination
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    const toggleClientExpand = (clientId) => {
        setExpandedClient(expandedClient === clientId ? null : clientId);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const breadcrumbs = [
        { href: '/vendor', label: 'Vendor', active: false },
        { href: `/vendor/${vendor.id}`, label: `${vendor.vendor_name}`, active: true }
    ];

    return (
        <AuthenticatedLayout>
            <BreadCrumbHeader
                breadcrumbs={breadcrumbs}
            />

            {/* Analytics Summary Cards */}
            <Row className="g-3">
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                                    <IndianRupee size={20} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">Total Purchases</h6>
                                    <h5 className="mb-0">₹{grandTotals.raw.toLocaleString('en-IN')}</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                                    <Percent size={20} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">Service Charges</h6>
                                    <h5 className="mb-0">₹{grandTotals.serviceCharge.toLocaleString('en-IN')}</h5>
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
                                    <Calculator size={20} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">Grand Total</h6>
                                    <h5 className="mb-0">₹{grandTotals.withService.toLocaleString('en-IN')}</h5>
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
                                    <h6 className="text-muted mb-0">Net Account Balance</h6>
                                    <h5 className="mb-0">₹{grandTotals.netAccount.toLocaleString('en-IN')}</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search Bar */}
            <Card className=" border-0 shadow-sm">
                <Card.Body>
                    <InputGroup>
                        <InputGroup.Text className="border-0">
                            <Search size={16} />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Search clients by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0"
                        />
                    </InputGroup>
                </Card.Body>
            </Card>

            {/* Clients Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>Client</th>
                                <th className="text-end">Purchases</th>
                                <th className="text-end">Service</th>
                                <th className="text-end">Total</th>
                                <th className="text-center">Account Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentClients.length > 0 ? (
                                currentClients.map(({
                                    client,
                                    lists,
                                    totalRaw,
                                    totalWithService,
                                    serviceChargeTotal,
                                    serviceRate,
                                    accountInTotal,
                                    accountOutTotal,
                                    netAccountBalance
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
                                                    <ChevronDown size={18} />
                                                }
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light p-2 rounded me-3">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <strong>{client.client_name}
                                                            <Badge
                                                                bg={client.client_type === 'Service Client' ? 'info' : 'warning'}
                                                                className="mt-1 ms-2"
                                                            >
                                                                {client.client_type}
                                                            </Badge>
                                                        </strong>
                                                        <div className="small text-muted">
                                                            {client.client_email} | {client.client_phone}
                                                        </div>

                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <div className="fw-bold">₹{totalRaw.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="text-end">
                                                <div className="text-warning">
                                                    {serviceRate}% (₹{serviceChargeTotal.toLocaleString('en-IN')})
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <div className="fw-bold text-success">₹{totalWithService.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="text-center">
                                                <Badge bg={netAccountBalance >= 0 ? 'success' : 'danger'} pill>
                                                    ₹{netAccountBalance.toLocaleString('en-IN')}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6} className="p-0 border-0">
                                                <Collapse in={expandedClient === client.id}>
                                                    <div className="p-3">
                                                        <Row>
                                                            <Col md={12}>
                                                                <h6 className="mb-3 d-flex align-items-center">
                                                                    <FileText size={18} className="me-2" />
                                                                    Purchase Lists for {client.client_name}
                                                                </h6>
                                                                <Table bordered size="sm" className="">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>List Name</th>
                                                                            <th>Description</th>
                                                                            <th className="text-end">Amount</th>
                                                                            <th className="text-end">Service %</th>
                                                                            <th className="text-end">Total</th>
                                                                            <th>Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {lists.map((list, index) => {
                                                                            const billTotal = parseFloat(list.bill_total) || 0;
                                                                            const serviceRate = client.service_charge?.service_charge || 0;
                                                                            const serviceCharge = (billTotal * serviceRate) / 100;
                                                                            const finalTotal = billTotal + serviceCharge;

                                                                            return (
                                                                                <tr key={index}>

                                                                                    <td className="text-muted">
                                                                                        <strong>{list.list_name}</strong>
                                                                                    </td>
                                                                                    <td>
                                                                                        <small className="text-muted">
                                                                                            {list.bill_description}
                                                                                        </small>
                                                                                    </td>
                                                                                    <td className="text-end">
                                                                                        ₹{billTotal.toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td className="text-end">
                                                                                        {serviceRate}%
                                                                                    </td>
                                                                                    <td className="text-end fw-bold">
                                                                                        ₹{finalTotal.toLocaleString('en-IN')}
                                                                                    </td>
                                                                                    <td>
                                                                                        {list.purchase_date}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                            <Col md={12}>
                                                                <h6 className="mb-3 d-flex align-items-center">
                                                                    <CreditCard size={18} className="me-2" />
                                                                    Account Transactions
                                                                </h6>
                                                                <Card className="mb-3">
                                                                    <Card.Body>
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Total In:</span>
                                                                            <strong className="text-success">
                                                                                <ArrowUp size={16} className="me-1" />
                                                                                ₹{accountInTotal.toLocaleString('en-IN')}
                                                                            </strong>
                                                                        </div>
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Total Out:</span>
                                                                            <strong className="text-danger">
                                                                                <ArrowDown size={16} className="me-1" />
                                                                                ₹{accountOutTotal.toLocaleString('en-IN')}
                                                                            </strong>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>Net Balance:</span>
                                                                            <strong className={netAccountBalance >= 0 ? 'text-success' : 'text-danger'}>
                                                                                ₹{netAccountBalance.toLocaleString('en-IN')}
                                                                            </strong>
                                                                        </div>
                                                                    </Card.Body>
                                                                </Card>

                                                                <Card>
                                                                    <Card.Body>
                                                                        <h6 className="d-flex align-items-center mb-3">
                                                                            <Calculator size={16} className="me-2" />
                                                                            Financial Summary
                                                                        </h6>
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Total Purchases:</span>
                                                                            <strong>₹{totalRaw.toLocaleString('en-IN')}</strong>
                                                                        </div>
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Service Charges ({serviceRate}%):</span>
                                                                            <strong className="text-warning">
                                                                                ₹{serviceChargeTotal.toLocaleString('en-IN')}
                                                                            </strong>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Total Payable:</span>
                                                                            <strong className="text-success">
                                                                                ₹{totalWithService.toLocaleString('en-IN')}
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
                </Card.Body>
            </Card>

            {/* Pagination */}
            {filteredClients.length > clientsPerPage && (
                <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                        <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <Pagination.Item 
                                key={number} 
                                active={number === currentPage}
                                onClick={() => paginate(number)}
                            >
                                {number}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
        </AuthenticatedLayout>
    );
}