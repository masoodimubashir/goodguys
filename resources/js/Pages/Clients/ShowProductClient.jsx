import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import PdfTable from '@/Components/PdfTable';
import CostIncurredTab from '@/Components/CostIncurredTab';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { ClientInfoCard } from '@/Components/ClientInfoCard';
import { BankAccountCard } from '@/Components/BankAccountCard';
import { FileText, Activity, BarChart3, IndianRupee, Eye, EyeOff, RefreshCw, ActivityIcon } from 'lucide-react';
import ProjectDocumentTab from '@/Components/ProjectDocumentTab';
import PurchaseItemsTab from '@/Components/PurchaseItemsTab';
import { PurchaseListModal } from '@/Components/PurchaseListModal';
import ClientAccountModal from '@/Components/ClientAccountModal';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Card, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';
import PurchaseListTab from '@/Components/PurchaseListTab';
import ActivityTab from '@/Components/Activity';

export default function ShowClient({ client, purchase_items, vendors = [], company_profile = null, BankProfile = null, client_vendors = [], activities = [] }) {

    // State management
    const flash = usePage().props.flash;

    const [purchaseItems, setPurchaseItems] = useState(purchase_items || []);
    const [filteredItems, setFilteredItems] = useState(purchase_items || []);
    const [editedItems, setEditedItems] = useState({});
    const [showAnalytics, setShowAnalytics] = useState(true);

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
                        { href: `/clients/${client.id}`, label: client.client_name, active: true }
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

                    {
                        showAnalytics && (
                            <>
                                {/* Client Information */}
                                <Row >
                                    <ClientInfoCard client={client} />
                                    <Col md={6}>
                                        <Card className="border-0 shadow-sm h-100">
                                            <Card.Body className="p-3">
                                                <h6 className="mb-3 d-flex align-items-center gap-2">
                                                    <BarChart3 size={18} className="text-primary" />
                                                    Quick Stats
                                                </h6>
                                                <div className="d-flex justify-content-between">


                                                    <div className="text-center">
                                                        <h6 className="mb-1 fw-bold">{analytics.spends}</h6>
                                                        <small className="text-muted">Total Spends</small>
                                                    </div>
                                                    <div className="text-center">
                                                        <h6 className="mb-1 fw-bold">{formatCurrency(analytics.balance)}</h6>
                                                        <small className="text-muted">Balance</small>
                                                    </div>
                                                    <div className="text-center">
                                                        <h6 className="mb-1 fw-bold">{formatCurrency(analytics.deposit)}</h6>
                                                        <small className="text-muted">Deposits</small>
                                                    </div>

                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )
                    }


                    <div className="d-flex flex-wrap justify-content-end align-items-center mt-2 mb-3 gap-2">
                        <Button variant="outline-success" size="sm" onClick={() => openPurchaseListModal()}>
                            <i className="ti ti-shopping-cart me-1"></i> Party Purchase
                        </Button>

                        <Link href={route('challan.show', client?.id)} className="btn btn-outline-dark btn-sm">
                            <i className="ti ti-file-invoice me-1"></i> View Challans
                        </Link>

                        <Button variant="outline-info" size="sm" onClick={() => openClientAccountModal()}>
                            <i className="ti ti-building-bank me-1"></i>Payment
                        </Button>
                    </div>

                    {/* Tabs Section */}
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link d-flex align-items-center gap-1 active" data-bs-toggle="tab" data-bs-target="#purchase-items-tab" type="button" role="tab">
                                <Activity size={16} />
                                Payment
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link d-flex align-items-center gap-1" data-bs-toggle="tab" data-bs-target="#client-vendor-payment-tab" type="button" role="tab">
                                <ActivityIcon size={16} />

                                Activities
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link d-flex align-items-center gap-1 " data-bs-toggle="tab" data-bs-target="#vendor-tab" type="button" role="tab">
                                <Activity size={16} />
                                Party List
                            </button>
                        </li>




                        <li className="nav-item" role="presentation">
                            <button className="nav-link d-flex align-items-center gap-1" data-bs-toggle="tab" data-bs-target="#pdf-tab" type="button" role="tab">
                                <FileText size={16} />
                                PDF Report
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link d-flex align-items-center gap-1" data-bs-toggle="tab" data-bs-target="#project-document-tab" type="button" role="tab">
                                <FileText size={16} />
                                Documents
                            </button>
                        </li>



                    </ul>

                    <div className="tab-content">


                        <div className="tab-pane fade show active" id="purchase-items-tab" role="tabpanel">
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
                        </div>

                        <div className="tab-pane fade" id="client-vendor-payment-tab" role="tabpanel">
                            <ActivityTab activities={activities} client={client} />

                        </div>

                        <div className="tab-pane fade " id="vendor-tab" role="tabpanel">
                            <PurchaseListTab
                                client={client}
                                clientVendors={client_vendors}
                            />
                        </div>


                        <div className="tab-pane fade" id="pdf-tab" role="tabpanel">
                            <PdfTable client={client} CompanyProfile={company_profile} BankProfile={BankProfile} />
                        </div>

                        <div className="tab-pane fade" id="project-document-tab" role="tabpanel">
                            <ProjectDocumentTab client={client} />
                        </div>




                    </div>
                </div>

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
                                <Col md={12}>
                                    <Form.Group controlId="serviceCharge">
                                        <Form.Label>Service Charge (₹)</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>₹</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={challanForm.data.service_charge}
                                                onChange={(e) => challanForm.setData('service_charge', e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
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