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
import { FileText, Activity, Building, EyeOff, Eye, Receipt, TrendingUp, Percent, Package, BarChart3 } from 'lucide-react';
import ProjectDocumentTab from '@/Components/ProjectDocumentTab';
import PurchaseItemsTab from '@/Components/PurchaseItemsTab';
import { PurchaseListModal } from '@/Components/PurchaseListModal';
import ClientAccountModal from '@/Components/ClientAccountModal';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Card, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

export default function ShowClient({ client, purchase_items, vendors = [], company_profile = null }) {
    const flash = usePage().props.flash;

    // State management for purchase items
    const [purchaseItems, setPurchaseItems] = useState(purchase_items.data || []);
    const [filteredItems, setFilteredItems] = useState(purchase_items.data || []);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedItems, setEditedItems] = useState({});
    const [newItem, setNewItem] = useState({
        client_id: client.id || '',
        unit_type: '',
        description: '',
        qty: 1,
        price: '',
        narration: '',
        show: false
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [isCreating, setIsCreating] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);


    // Modal states
    const [showPurchaseListModal, setShowPurchaseListModal] = useState(false);
    const [showClientAccountModal, setShowClientAccountModal] = useState(false);
    const [currentPurchaseList, setCurrentPurchaseList] = useState(null);
    const [currentClientAccount, setCurrentClientAccount] = useState(null);
    const [animatingCards, setAnimatingCards] = useState(new Set());

    // Challan state
    const [challanState, setChallanState] = useState({
        showChallanForm: false,
        selectedProducts: {}
    });



    // Refs
    const tableRef = useRef(null);
    const costIncurredRef = useRef(null);

    // Form handlers
    const costIncurredForm = useInertiaForm({
        client_id: client.id,
        entry_name: '',
        count: '',
        selling_price: '',
        buying_price: '',
    });

    const purchaseListForm = useInertiaForm({
        vendor_id: '',
        client_id: client.id || '',
        list_name: '',
        purchase_date: new Date().toISOString().split('T')[0],
        bill: null,
        bill_total: '',
        bill_description: '',
    });

    const clientAccountForm = useInertiaForm({
        client_id: client.id || '',
        payment_type: '',
        payment_flow: '',
        amount: '',
        narration: ''
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

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(item =>
                item.description?.toLowerCase().includes(term) ||
                item.unit_type?.toLowerCase().includes(term) ||
                item.narration?.toLowerCase().includes(term) ||
                item.id.toString().includes(term)
            );
        }

        if (startDate && endDate) {
            results = results.filter(item => {
                const itemDate = new Date(item.created_at);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        setFilteredItems(results);
    }, [searchTerm, dateRange, purchaseItems]);

    // Initialize DataTables
    useEffect(() => {
        const initializeDataTables = () => {
            const tables = [
                tableRef.current?.querySelector('table'),
                costIncurredRef.current?.querySelector('table')
            ].filter(Boolean);

            tables.forEach(table => {
                if ($.fn.DataTable.isDataTable(table)) {
                    $(table).DataTable().destroy();
                }
                $(table).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]]
                });
            });
        };

        initializeDataTables();

        return () => {
            $('.dataTable').DataTable().destroy().clear();
        };
    }, [client.invoices, client.proformas, client.accounts, client.cost_incurred, purchaseItems]);

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

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

    // Save edited item
    const saveItem = (item) => {
        if (!item?.id) {
            ShowMessage('Error', 'Cannot save item - missing ID');
            return;
        }

        const payload = {
            _method: 'PUT',
            client_id: client.id,
            ...editedItems[item.id],
            qty: editedItems[item.id]?.qty !== undefined ?
                Number(editedItems[item.id].qty) : item.qty,
            price: editedItems[item.id]?.price !== undefined ?
                Number(editedItems[item.id].price) : item.price
        };

        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
        );

        router.post(`/purchased-item/${item.id}`, cleanPayload, {
            onSuccess: () => {
                setPurchaseItems(prev => prev.map(i =>
                    i.id === item.id ? { ...i, ...cleanPayload } : i
                ));
                setEditingItemId(null);
                setEditedItems(prev => {
                    const newState = { ...prev };
                    delete newState[item.id];
                    return newState;
                });
                ShowMessage('Success', 'Item updated successfully');
            },
            onError: () => {
                ShowMessage('Error', 'Failed to update item');
            }
        });
    };

    // Delete item
    const deleteItem = (itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this item. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/purchased-item/${itemId}`, {
                    onSuccess: () => {
                        setPurchaseItems(prev => prev.filter(i => i.id !== itemId));
                        ShowMessage('success', 'Item deleted successfully');
                    },
                    onError: () => {
                        ShowMessage('error', 'Failed to delete item');
                    }
                });
            }
        });
    };

    // Create new item
    const createItem = () => {
        setIsCreating(true);
        const itemData = {
            client_id: client.id,
            unit_type: newItem.unit_type,
            description: newItem.description,
            qty: Number(newItem.qty),
            price: Number(newItem.price),
            narration: newItem.narration
        };

        router.post('/purchased-item', itemData, {
            onSuccess: () => {
                setPurchaseItems(prev => [...prev, itemData]);
                ShowMessage('Success', 'Item created successfully');
                setNewItem({
                    client_id: client.id,
                    unit_type: '',
                    description: '',
                    qty: '',
                    price: '',
                    narration: '',
                    show: false
                });
            },
            onError: () => {
                ShowMessage('Error', 'Failed to create item');
            },
            onFinish: () => {
                setIsCreating(false);
            }
        });
    };

    // Modal handlers
    const openPurchaseListModal = (item = null) => {
        setCurrentPurchaseList(item);
        if (item) {
            purchaseListForm.setData(item);
        } else {
            purchaseListForm.reset();
        }
        setShowPurchaseListModal(true);
    };

    const openClientAccountModal = (item = null) => {
        setCurrentClientAccount(item);
        if (item) {
            clientAccountForm.setData(item);
        } else {
            clientAccountForm.reset();
        }
        setShowClientAccountModal(true);
    };

    // Form submission handlers
    const handlePurchaseListSubmit = async (e) => {
        e.preventDefault();
        const isEditing = !!currentPurchaseList;

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                purchaseListForm.reset();
                setShowPurchaseListModal(false);
                setCurrentPurchaseList(null);
                ShowMessage('success', `Purchase list ${isEditing ? 'updated' : 'created'} successfully`);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: () => {
                ShowMessage('error', 'Failed to save purchase list');
            }
        };

        if (isEditing) {
            purchaseListForm.put(route('purchase-list.update', currentPurchaseList.id), options);
        } else {
            purchaseListForm.post(route('purchase-list.store'), options);
        }


    };

    const handleClientAccountSubmit = async (e) => {
        e.preventDefault();
        const isEditing = !!currentClientAccount;

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                clientAccountForm.reset();
                setShowClientAccountModal(false);
                setCurrentClientAccount(null);
                ShowMessage('success', `Client account ${isEditing ? 'updated' : 'created'} successfully`);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: () => {
                ShowMessage('error', 'Failed to save client account');
            }
        };

        if (isEditing) {
            clientAccountForm.put(route('client-account.update', currentClientAccount.id), options);
        } else {
            clientAccountForm.post(route('client-account.store'), options);
        }


    };

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

    // Reset date filter
    const resetDateFilter = () => {
        setDateRange([null, null]);
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

    // Custom tooltip component
    const CustomTooltip = ({ text, children }) => (
        <div className="position-relative d-inline-block">
            {children}
            <div className="tooltip-custom">
                <span className="tooltiptext">{text}</span>
            </div>
        </div>
    );

    // Handle challan creation
    const handleCreateChallan = (e) => {
        e.preventDefault();

        const selectedItems = purchaseItems
            .filter(product => challanState.selectedProducts[product.id])
            .map(product => ({
                item_id: product.id,
                description: product.description,
                unit_type: product.unit_type,
                price: product.price,
                narration: product.narration || '',
                is_price_visible: challanForm.data.is_price_visible,
                qty: product.qty,
                total: product.total,
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
            },
            onError: (errors) => {
                ShowMessage('error', 'Failed to create challan');
            }
        });
    };


    // Challan Form
    const challanForm = useForm({
        client_id: client.id,
        service_charge: client.service_charge?.service_charge || 0,
        challan: [],
        challan_number: '',
        challan_date: new Date().toISOString().split('T')[0],
        is_price_visible: true,
    });

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

    const calculateAnalytics = () => {
        const totalValue = filteredItems.reduce((sum, item) => {
            const qty = parseFloat(item.qty) || 0;
            const price = parseFloat(item.price) || 0;
            const unitType = item.unit_type;

            // Determine the base value
            const value = qty > 1 ? qty : qty * price;

            // Apply sign based on unit type
            const signedValue = unitType === 'out' ? -value : value;

            return sum + signedValue;
        }, 0);

        const averagePrice = filteredItems.length > 0
            ? filteredItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) / filteredItems.length
            : 0;

        const totalQuantity = filteredItems.reduce((sum, item) => {
            const qty = parseFloat(item.qty) || 0;
            return sum + qty;
        }, 0);

        const categories = {};
        filteredItems.forEach(item => {
            const category = item.unit_type || 'Uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });

        const topCategory = Object.keys(categories).reduce((a, b) =>
            categories[a] > categories[b] ? a : b, '');

        const topCategoryCount = topCategory ? categories[topCategory] : 0;

        return {
            totalValue,
            averagePrice,
            totalItems: filteredItems.length,
            totalQuantity,
            topCategory,
            topCategoryCount,
            topCategoryPercentage: filteredItems.length > 0
                ? Math.round((topCategoryCount / filteredItems.length) * 100)
                : 0
        };
    };


    const analytics = calculateAnalytics();

    return (
        <AuthenticatedLayout>
            <Head title={`Client - ${client.client_name}`} />

            <div className="d-flex justify-content-between align-items-center">
                <BreadCrumbHeader breadcrumbs={[
                    { href: '/clients', label: 'Clients', active: false },
                    { href: `/clients/${client.id}`, label: client.client_name, active: true }
                ]} />

                <div className="dropdown">
                    <Button className="btn btn-primary dropdown-toggle  me-2" size='sm' data-bs-toggle="dropdown">
                        Create
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => handleAnalytics()}>
                        {showAnalytics ? <Eye size={13} /> : <EyeOff size={14} />} Analytics
                    </Button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <Link href={route('challan.show', client.id)} className="dropdown-item">
                                <i className="ti ti-building-bank me-2"></i> Challans
                            </Link>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => openPurchaseListModal()}>
                                <i className="ti ti-shopping-cart me-2"></i> Purchase List
                            </button>
                        </li>
                        <li>
                            <button onClick={() => openClientAccountModal()} className="dropdown-item">
                                <i className="ti ti-building-bank me-2"></i> Add Payment
                            </button>
                        </li>
                        <li>
                            <Link
                                href={route('bank-account.create', { client_id: client.id })}
                                className="dropdown-item d-flex align-items-center gap-2"
                            >
                                <Building size={16} />
                                Bank Account
                            </Link>
                        </li>
                    </ul>
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
                                {client.bank_account && <BankAccountCard BankProfile={client.bank_account} />}
                            </Row>

                            {/* Analytics Cards */}
                            <Row className="g-3">
                                <Col md={3}>
                                    <Card className={`border-0 shadow-sm h-100 card-hover gradient-bg ${animatingCards.has('total-value') ? 'pulse-animation' : ''}`}>
                                        <Card.Body className="p-3">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <h6 className="mb-1">Total Inventory Value</h6>
                                                    <h6 className="mb-0 fw-bold ">{formatCurrency(analytics.totalValue)}</h6>
                                                    <small className="">
                                                        <TrendingUp size={12} className="me-1" />
                                                        Avg: {formatCurrency(analytics.averagePrice)} per unit
                                                    </small>
                                                </div>
                                                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                                                    <Receipt size={28} className="" />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className={`border-0 shadow-sm h-100 card-hover gradient-success ${animatingCards.has('total-items') ? 'pulse-animation' : ''}`}>
                                        <Card.Body className="p-3">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <h6 className="mb-1">Total Items</h6>
                                                    <h6 className="mb-0 fw-bold">{analytics.totalItems}</h6>
                                                    <small>
                                                        <Percent size={12} className="me-1" />
                                                        {analytics.totalQuantity} Total Quantity
                                                    </small>
                                                </div>
                                                <div className="bg-white bg-opacity-20 p-3 rounded-circle text-black">
                                                    <Package size={28} className="" />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="p-3">
                                            <h6 className="mb-3 d-flex align-items-center gap-2">
                                                <BarChart3 size={18} className="text-primary" />
                                                Quick Stats
                                            </h6>
                                            <div className="d-flex justify-content-between">
                                                <div className="text-center">
                                                    <h6 className="mb-1 fw-bold">{analytics.totalItems}</h6>
                                                    <small className="text-muted">Total Items</small>
                                                </div>
                                                <div className="text-center">
                                                    <h6 className="mb-1 fw-bold">{analytics.totalQuantity}</h6>
                                                    <small className="text-muted">Total Quantity</small>
                                                </div>
                                                <div className="text-center">
                                                    <h6 className="mb-1 fw-bold">{formatCurrency(analytics.averagePrice)}</h6>
                                                    <small className="text-muted">Avg. Price</small>
                                                </div>
                                                <div className="text-center">
                                                    <h6 className="mb-1 fw-bold">{formatCurrency(analytics.totalValue)}</h6>
                                                    <small className="text-muted">Total Value</small>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )
                }



                {/* Tabs Section */}
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link d-flex align-items-center gap-1 active" data-bs-toggle="tab" data-bs-target="#purchase-items-tab" type="button" role="tab">
                            <Activity size={16} />
                            Purchase Items
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
                            setPurchaseItems={setPurchaseItems}
                            editingItemId={editingItemId}
                            setEditingItemId={setEditingItemId}
                            editedItems={editedItems}
                            setEditedItems={setEditedItems}
                            newItem={newItem}
                            setNewItem={setNewItem}
                            challanState={challanState}
                            setChallanState={setChallanState}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            startDate={startDate}
                            endDate={endDate}
                            handleItemChange={handleItemChange}
                            handleNewItemChange={handleNewItemChange}
                            saveItem={saveItem}
                            deleteItem={deleteItem}
                            createItem={createItem}
                            toggleProductSelection={toggleProductSelection}
                            openChallanForm={openChallanForm}
                            resetDateFilter={resetDateFilter}
                            formatCurrency={formatCurrency}
                            CustomTooltip={CustomTooltip}
                            isCreating={isCreating}
                            purchase_items={purchase_items}
                        />
                    </div>



                    <div className="tab-pane fade" id="pdf-tab" role="tabpanel">
                        <PdfTable client={client} CompanyProfile={company_profile || {}} />
                    </div>

                    <div className="tab-pane fade" id="project-document-tab" role="tabpanel">
                        <ProjectDocumentTab client={client} />
                    </div>
                </div>
            </div>

            <PurchaseListModal
                show={showPurchaseListModal}
                onHide={() => setShowPurchaseListModal(false)}
                form={purchaseListForm}
                errors={purchaseListForm.errors}
                isEditing={!!currentPurchaseList}
                handleSubmit={handlePurchaseListSubmit}
                vendors={vendors}
            />

            <ClientAccountModal
                show={showClientAccountModal}
                onHide={() => setShowClientAccountModal(false)}
                form={clientAccountForm}
                errors={clientAccountForm.errors}
                isEditing={!!currentClientAccount}
                handleSubmit={handleClientAccountSubmit}
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
                                                    <td>{item.unit_type}</td>
                                                    <td>
                                                        {
                                                            item.qty > 0 ? item.qty : 'NA'
                                                        }
                                                    </td>
                                                    <td>{formatCurrency(item.price)}</td>
                                                    <td>
                                                        {
                                                            item.qty > 0 ?
                                                                formatCurrency(item.price * item.qty) : item.price
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