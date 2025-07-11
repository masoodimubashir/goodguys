


import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { FileText, Activity, BarChart3, Eye, EyeOff, RefreshCw, ActivityIcon } from 'lucide-react';
import { Button, Card, Col, Dropdown, Form, InputGroup, Modal, Row, Table, Tabs, Tab } from 'react-bootstrap';

import { ClientInfoCard } from '@/Components/ClientInfoCard';
import { PaymentModal } from '@/Components/PaymentModal';
import ClientAccountModal from '@/Components/ClientAccountModal';
import { PurchaseListModal } from '@/Components/PurchaseListModal';

// Lazy load heavy components while maintaining same import paths
const PurchaseItemsTab = lazy(() => import('@/Components/PurchaseItemsTab'));
const ActivityTab = lazy(() => import('@/Components/Activity'));
const PurchaseListTab = lazy(() => import('@/Components/PurchaseListTab'));
const ProjectDocumentTab = lazy(() => import('@/Components/ProjectDocumentTab'));
const PdfTable = lazy(()=> import('@/Components/PdfTable') )

const TabPlaceholder = () => (
    <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

const AnalyticsPlaceholder = () => (
    <Row className="mb-3 g-1">
        <Col md={6}>
            <Card className="placeholder-glow">
                <Card.Body>
                    <div className="placeholder col-8"></div>
                </Card.Body>
            </Card>
        </Col>
        <Col md={6}>
            <Card className="placeholder-glow">
                <Card.Body>
                    <h6 className="mb-3 placeholder col-4"></h6>
                    <div className="d-flex justify-content-between">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center">
                                <h6 className="mb-1 placeholder col-3"></h6>
                                <small className="placeholder col-5"></small>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    </Row>
);

export default function ShowClient({ client, purchase_items, vendors = [], company_profile = null, BankProfile = null, client_vendors = [], activities = [] }) {

    // State management
    const flash = usePage().props.flash;
    const [activeTab, setActiveTab] = useState('purchase-items');
    const [purchaseItems, setPurchaseItems] = useState(purchase_items || []);
    const [filteredItems, setFilteredItems] = useState(purchase_items || []);
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [showPaymentModal, setshowPaymentModal] = useState(false);
    const [editedItems, setEditedItems] = useState({});


    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // Modal states
    const [animatingCards, setAnimatingCards] = useState(new Set());


    // State management in parent component
    const [showPurchaseListModal, setShowPurchaseListModal] = useState(false);
    const [currentPurchaseList, setCurrentPurchaseList] = useState(null);

    // In your parent component
    const [showClientAccountModal, setShowClientAccountModal] = useState(false);
    const [currentClientAccount, setCurrentClientAccount] = useState(null);

    // When opening the modal
    const openPurchaseListModal = (item = null) => {
        setCurrentPurchaseList(item);
        setShowPurchaseListModal(true);
    };

    // When opening the modal for editing
    const openClientAccountModal = (item = null) => {
        setCurrentClientAccount(item);
        setShowClientAccountModal(true);
    }

    const [newItem, setNewItem] = useState({
        client_id: '',
        unit_type: '',
        description: '',
        qty: 1,
        price: '',
        narration: '',
        show: false,
        created_at: new Date().toISOString().split('T')[0],
    });

    // Challan state
    const [challanState, setChallanState] = useState({
        showChallanForm: false,
        selectedProducts: {}
    });

    const challanForm = useForm({
        client_id: client.id,
        service_charge: client.service_charge?.service_charge || 0,
        challan: [],
        challan_number: '',
        challan_date: new Date().toISOString().split('T')[0],
        is_price_visible: true,
    });


    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    };

    // Filter items based on search term and date range
    useEffect(() => {
        let results = purchaseItems;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(item =>
                item.unit_type?.toLowerCase()?.includes(term) ||
                item.description?.toLowerCase().includes(term),
            );
        }

        // Apply date range filter if both dates are selected
        if (startDate && endDate) {
            results = results.filter(item => {
                const itemDate = new Date(item.created_at);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        setFilteredItems(results);
    }, [searchTerm, dateRange, purchaseItems]);


    const calculateAnalytics = () => {

        const returns = filteredItems.filter(item => item.payment_flow === null).reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);


        const sumIn = filteredItems
            .filter(item => item.payment_flow === 1)
            .reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

        const sumOut = filteredItems
            .filter(item => item.payment_flow === 0)
            .reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

        const spends = filteredItems.filter(item =>
            item.payment_flow === 0
        ).reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0) - returns;


        const categories = {};
        filteredItems.forEach(item => {
            const category = item.payment_flow || 'Uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });

        return {
            deposit: sumIn,
            balance: (sumIn - sumOut) + returns,
            spends: spends,
        };
    };


    const analytics = calculateAnalytics();


    const activity_total = () => {
        const total = activities
            .filter(activity => activity.is_credited === 0)
            .reduce((sum, activity) => sum + activity.total, 0);

        return total;
    };

    const expenditure = activity_total();


    // Handle field changes for editing
    const handleItemChange = (itemId, field, value) => {

        setEditedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    // Handle new item field changes
    const handleNewItemChange = (field, value) => {

        setNewItem(prev => ({
            ...prev,
            [field]: value
        }));
    };





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




    // Toggle product selection for challan
    const toggleProductSelection = (id) => {
        setChallanState(prev => ({
            ...prev,
            selectedProducts: {
                ...prev.selectedProducts,
                [id]: !prev.selectedProducts[id]
            }
        }));
    };

    // Open challan creation form
    const openChallanForm = () => {
        const hasSelectedItems = Object.values(challanState.selectedProducts).some(selected => selected);
        if (!hasSelectedItems) {
            ShowMessage('Warning', 'Please select at least one item to create a challan');
            return;
        }
        setChallanState(prev => ({ ...prev, showChallanForm: true }));
    };

    // Handle challan creation
    const handleCreateChallan = (e) => {

        e.preventDefault();

        const selectedItems = purchaseItems
            .filter(product => challanState.selectedProducts[product.id])
            .map(product => ({
                item_id: product.id,
                description: product.description,
                unit_type: product.unit_type ?? 'NA',
                price: product.price,
                narration: product.narration ?? 'NA',
                is_price_visible: challanForm.data.is_price_visible,
                qty: product.qty,
                total: product.total,
                payment_flow: product.payment_flow,
                created_at: product.created_at
            }));

        const payload = {
            ...challanForm.data,
            challan: selectedItems
        };

        router.post(route('challan.store'), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setChallanState(prev => ({
                    ...prev,
                    selectedProducts: {},
                    showChallanForm: false
                }));
                ShowMessage('success', 'Challan created successfully');
                router.reload();
            },
            onError: (errors) => {
                ShowMessage('error', 'Failed to create challan');
            }
        });
    };

    // Reset date filter
    const resetDateFilter = () => {
        setDateRange([null, null]);
    };

    // Handle analytics refresh
    const handleAnalytics = () => {
        // Add animation to cards
        setAnimatingCards(new Set(['total-value', 'total-items']));

        // Remove animation after 1 second
        setTimeout(() => {
            setAnimatingCards(new Set());
        }, 1000);

        // Toggle analytics visibility
        setShowAnalytics(!showAnalytics);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Client - ${client.client_name}`} />

            <div className="d-flex justify-content-between align-items-center">
                <BreadCrumbHeader breadcrumbs={[
                    { href: '/clients', label: 'Clients', active: false },
                    { href: `/clients/${client.id}`, label: client.client_name, active: false },
                    { href: '/clients', label: 'Back', active: true },
                ]} />

                <div className="d-flex flex-wrap gap-2 justify-content-end">
                    <Button variant="outline-secondary" size="sm" onClick={() => window.location.reload()}>
                        <RefreshCw size={14} />
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => handleAnalytics()}>
                        {showAnalytics ? <Eye size={13} /> : <EyeOff size={14} />} Analytics
                    </Button>

                </div>
            </div>

            {/* Main Content */}
            <div>

                {showAnalytics && (
                    <Row className="mb-3 g-1">
                        <Col md={6}>
                            <ClientInfoCard client={client} />
                        </Col>

                        <Col md={6}>
                            <Card className="border-0  shadow-sm rounded-3 ">
                                <Card.Body className="">
                                    <h6 className="mb-3 d-flex align-items-center gap-2">
                                        <BarChart3 size={18} className="text-primary" /> Quick Stats
                                    </h6>
                                    <div className="d-flex justify-content-between">
                                        <div className="text-center">
                                            <h6 className="mb-1 fw-bold">{analytics.spends}</h6>
                                            <small className="text-muted">Total Spend</small>
                                        </div>
                                        <div className="text-center">
                                            <h6 className="mb-1 fw-bold">{formatCurrency(analytics.balance)}</h6>
                                            <small className="text-muted">Balance</small>
                                        </div>
                                        <div className="text-center">
                                            <h6 className="mb-1 fw-bold">{formatCurrency(analytics.deposit)}</h6>
                                            <small className="text-muted">Deposits</small>
                                        </div>
                                        <div className="text-center">
                                            <h6 className="mb-1 fw-bold">{formatCurrency(expenditure)}</h6>
                                            <small className="text-muted">Expenditure</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                )}


                <div className="d-flex flex-wrap justify-content-end align-items-center mt-2 mb-3 gap-2">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" size="sm" className="d-flex align-items-center shadow-sm">
                            Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openPurchaseListModal()}>
                                <i className="ti ti-receipt me-2"></i> Create Bill
                            </Dropdown.Item>
                            <Dropdown.Item href={route('challan.show', client?.id)}>
                                <i className="ti ti-truck-delivery me-2"></i> Challans
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => openClientAccountModal()}>
                                <i className="ti ti-wallet me-2"></i> Client Payments
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setshowPaymentModal(true)}>
                                <i className="ti ti-cash me-2"></i> Payments
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-3"
                >
                    <Tab
                        eventKey="purchase-items"
                        title={
                            <span className="d-flex align-items-center gap-1">
                                <Activity size={16} />
                                Payment
                            </span>
                        }
                    >
                        <Suspense fallback={<TabPlaceholder />}>
                            <PurchaseItemsTab
                                filteredItems={filteredItems}
                                purchaseItems={purchaseItems}
                                editedItems={editedItems}
                                newItem={newItem}
                                setNewItem={setNewItem}
                                challanState={challanState}
                                setChallanState={setChallanState}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                setDateRange={setDateRange}
                                startDate={startDate}
                                endDate={endDate}
                                handleItemChange={handleItemChange}
                                handleNewItemChange={handleNewItemChange}
                                toggleProductSelection={toggleProductSelection}
                                openChallanForm={openChallanForm}
                                resetDateFilter={resetDateFilter}
                                formatCurrency={formatCurrency}
                                client={client}
                                client_vendors={client_vendors}
                                setPurchaseItems={setPurchaseItems}
                                setFilteredItems={setFilteredItems}
                            />
                        </Suspense>
                    </Tab>

                    <Tab
                        eventKey="activities"
                        title={
                            <span className="d-flex align-items-center gap-1">
                                <ActivityIcon size={16} />
                                Activities
                            </span>
                        }
                    >
                        <Suspense fallback={<TabPlaceholder />}>
                            <ActivityTab
                                activities={activities}
                                client={client}
                                setPurchaseItems={setPurchaseItems}
                                setFilteredItems={setFilteredItems}
                                vendors={vendors}
                            />
                        </Suspense>
                    </Tab>

                    <Tab
                        eventKey="vendor-list"
                        title={
                            <span className="d-flex align-items-center gap-1">
                                <Activity size={16} />
                                Party List
                            </span>
                        }
                    >
                        <Suspense fallback={<TabPlaceholder />}>
                            <PurchaseListTab
                                client={client}
                                handleEditAccount={(purchase_list) => openPurchaseListModal(purchase_list)}
                                clientVendors={client_vendors}
                            />
                        </Suspense>
                    </Tab>

                    <Tab
                        eventKey="pdf-report"
                        title={
                            <span className="d-flex align-items-center gap-1">
                                <FileText size={16} />
                                PDF Report
                            </span>
                        }
                    >
                        <Suspense fallback={<TabPlaceholder />}>
                            <PdfTable client={client} CompanyProfile={company_profile} BankProfile={BankProfile} />
                        </Suspense>
                    </Tab>

                    <Tab
                        eventKey="documents"
                        title={
                            <span className="d-flex align-items-center gap-1">
                                <FileText size={16} />
                                Documents
                            </span>
                        }
                    >
                        <Suspense fallback={<TabPlaceholder />}>
                            <ProjectDocumentTab client={client} />
                        </Suspense>
                    </Tab>
                </Tabs>

            </div>

            <PaymentModal
                show={showPaymentModal}
                onHide={() => setshowPaymentModal(false)}
                client_vendors={client_vendors}
                setPurchaseItems={setPurchaseItems}
                setFilteredItems={setFilteredItems}
                client={client}
            />

            <PurchaseListModal
                show={showPurchaseListModal}
                onHide={() => setShowPurchaseListModal(false)}
                vendors={vendors}
                isEditing={!!currentPurchaseList}
                initialData={currentPurchaseList}
                setPurchaseItems={setPurchaseItems}
                setFilteredItems={setFilteredItems}
                client={client}
            />

            <ClientAccountModal
                show={showClientAccountModal}
                onHide={() => setShowClientAccountModal(false)}
                isEditing={!!currentClientAccount}
                balance={analytics.balance}
                client={client}
                setPurchaseItems={setPurchaseItems}
                setFilteredItems={setFilteredItems}
            />

            {/* Challan Creation Modal */}
            <Modal
                show={challanState.showChallanForm}
                onHide={() => setChallanState(prev => ({ ...prev, showChallanForm: false }))}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Challan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateChallan}>
                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <Form.Group controlId="challanNumber">
                                    <Form.Label>Challan Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Will be auto-generated if empty"
                                        value={challanForm.data.challan_number}
                                        onChange={(e) => challanForm.setData('challan_number', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="challanDate">
                                    <Form.Label>Challan Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={challanForm.data.challan_date}
                                        onChange={(e) => challanForm.setData('challan_date', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            {challanForm.data.service_charge !== 0 && (
                                <Col md={12}>
                                    <Form.Group controlId="serviceCharge">
                                        <Form.Label>Service Charge (₹)</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>₹</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={challanForm.data.service_charge}
                                                onChange={(e) => challanForm.setData('service_charge', e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            )}

                            <Col md={12}>
                                <Form.Check
                                    type="switch"
                                    id="showPrices"
                                    label="Show prices on challan"
                                    checked={challanForm.data.is_price_visible}
                                    onChange={(e) => challanForm.setData('is_price_visible', e.target.checked)}
                                />
                            </Col>
                        </Row>

                        <div className="mt-4">
                            <h6 className="mb-3">Selected Items ({Object.values(challanState.selectedProducts).filter(Boolean).length})</h6>
                            <div className="table-responsive">
                                <Table bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Unit Type</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseItems
                                            .filter(item => challanState.selectedProducts[item.id])
                                            .map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.description}</td>
                                                    <td>{item.unit_type ?? 'NA'}</td>
                                                    <td>
                                                        {
                                                            item.qty > 1 ? item.qty : 'NA'
                                                        }
                                                    </td>
                                                    <td>{formatCurrency(item.price)}</td>
                                                    <td>
                                                        {
                                                            item.total
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setChallanState(prev => ({ ...prev, showChallanForm: false }))}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={challanForm.processing}
                            >
                                {challanForm.processing ? 'Creating...' : 'Create Challan'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </AuthenticatedLayout >
    );

}