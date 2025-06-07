import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Modal from 'react-bootstrap/Modal';
import PurchaseListTab from '@/Components/PurchaseListTab';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import {
    Card, Table, Button, Badge, ProgressBar, Row, Form, Tabs, Tab, InputGroup,
    Col
} from 'react-bootstrap';
import {
    ShoppingCart, Plus, Edit, Trash2, Save, XCircle, ChevronDown, ChevronRight,
    FileText, Calendar, IndianRupee, Activity, Package, RotateCcw, Eye, EyeOff,
    Download, RefreshCw, HandCoins, Undo2, BarChart3, Zap, Building2, User2,
    Phone, Mail, MapPin, Percent, TrendingUp, Banknote, Wallet, Receipt,
    Text, Box, Layers, PieChart, ShoppingBag, CreditCard, Database, ArrowRight,
    Check, Search
} from 'lucide-react';
import { ClientInfoCard } from '@/Components/ClientInfoCard';
import { BankAccountCard } from '@/Components/BankAccountCard';
import { PurchaseListModal } from '@/Components/PurchaseListModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProjectDocumentTab from '@/Components/ProjectDocumentTab';
import Swal from 'sweetalert2';
import PurchaseItemsTab from '@/Components/PurchaseItemsTab';
import ClientAccountModal from '@/Components/ClientAccountModal';

export default function ShowServiceClient({ client, vendors = [], client_vendors = [], purchase_items }) {
    // State management
    const { delete: destroy } = useForm();
    const flash = usePage().props.flash;

    const [activeTab, setActiveTab] = useState('vendor-lists');
    const [purchaseItems, setPurchaseItems] = useState(purchase_items.data || []);
    const [filteredItems, setFilteredItems] = useState(purchase_items.data || []);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedItems, setEditedItems] = useState({});
    const [newItem, setNewItem] = useState({
        client_id: '',
        unit_type: '',
        description: '',
        qty: 1,
        price: '',
        narration: '',
        show: false
    });
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [animatingCards, setAnimatingCards] = useState(new Set());

    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // Modal states
    const [showPurchaseListModal, setShowPurchaseListModal] = useState(false);
    const [showClientAccountModal, setShowClientAccountModal] = useState(false);
    const [currentPurchaseList, setCurrentPurchaseList] = useState(null);
    const [currentClientAccount, setCurrentClientAccount] = useState(null);

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

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(item =>
                item.description.toLowerCase().includes(term) ||
                item.unit_type.toLowerCase().includes(term) ||
                item.narration?.toLowerCase().includes(term) ||
                item.id.toString().includes(term)
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


    // Calculate analytics based on filtered items
    const calculateAnalytics = () => {
        // Calculate separate sums for in, out, and total values (excluding is_created === 1)
        const validItems = filteredItems.filter(item => item.is_credited !== 1);

        console.log(validItems);
        

        const sumIn = validItems
            .filter(item => item.unit_type === 'in')
            .reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

        const sumOut = validItems
            .filter(item => item.unit_type === 'out')
            .reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

        const sumTotal = validItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0) - sumIn - sumOut;


        console.log("sumIn:", sumIn);
        console.log("sumOut:", sumOut);
        console.log("sumTotal:", sumTotal);
        

        // Final calculation: sum of in - sum of out - sum of total
        const totalValue = sumIn - sumOut - sumTotal;

        // validItems already defined above for consistency

        const averagePrice = validItems.length > 0
            ? validItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) / validItems.length
            : 0;

        const totalQuantity = validItems.reduce((sum, item) => {
            const qty = parseFloat(item.qty) || 0;
            return sum + qty;
        }, 0);

        const categories = {};
        validItems.forEach(item => {
            const category = item.unit_type || 'Uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });

        const topCategory = Object.keys(categories).reduce((a, b) =>
            categories[a] > categories[b] ? a : b, '');

        const topCategoryCount = topCategory ? categories[topCategory] : 0;

        return {
            totalValue,
            averagePrice,
            totalItems: validItems.length,
            totalQuantity,
            topCategory,
            topCategoryCount,
            topCategoryPercentage: validItems.length > 0
                ? Math.round((topCategoryCount / validItems.length) * 100)
                : 0
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
            onSuccess: (response) => {
                const updatedItem = response.props?.item || response.item;

                if (updatedItem) {
                    setPurchaseItems(prev => prev.map(i =>
                        i.id === item.id ? updatedItem : i
                    ));
                } else {
                    // Fallback: merge the changes
                    setPurchaseItems(prev => prev.map(i =>
                        i.id === item.id ? { ...i, ...cleanPayload } : i
                    ));
                }

                setEditingItemId(null);
                setEditedItems(prev => {
                    const newState = { ...prev };
                    delete newState[item.id];
                    return newState;
                });

                ShowMessage('Success', 'Item updated successfully');
            },
            onError: (errors) => {
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
                        ShowMessage('Success', 'Item deleted successfully');
                    },
                    onError: (errors) => {
                        ShowMessage('Error', 'Failed to delete item');
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
            onSuccess: (response) => {
                const createdItem = response.props?.item ||
                    response.props?.purchase_item ||
                    response.props?.data?.item ||
                    response.item ||
                    response.data?.item;

                if (createdItem) {
                    setPurchaseItems(prev => [...prev, createdItem]);
                    ShowMessage('Success', 'Item created successfully');
                } else {
                    router.reload({
                        only: ['client'],
                        onSuccess: (updated) => {
                            setPurchaseItems(updated.props.client.purchase_items || []);
                            ShowMessage('Success', 'Item created');
                        }
                    });
                }

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
            onError: (errors) => {
                ShowMessage('Error', 'Failed to create item');
            },
            onFinish: () => {
                setIsCreating(false);
            }
        });
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

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

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

        const formData = new FormData();
        for (const key in purchaseListForm.data) {
            if (purchaseListForm.data[key] !== null) {
                formData.append(key, purchaseListForm.data[key]);
            }
        }

        const isEditing = !!currentPurchaseList;
        const currentId = currentPurchaseList?.id;

        const options = {
            preserveScroll: true,
            onSuccess: () => {


            },
            onError: (errors) => {
                ShowMessage('error', 'Failed to save purchase list');
            }
        };

        if (isEditing && currentId) {
            formData.append('_method', 'PUT');
            router.post(route('purchase-list.update', currentId), formData, options);
        } else {
            purchaseListForm.post(route('purchase-list.store'), formData, options);
        }

        purchaseListForm.reset();
        setShowPurchaseListModal(false);
        setCurrentPurchaseList(null);
        ShowMessage('success', `Purchase list ${isEditing ? 'updated' : 'created'} successfully`);
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    };

    const handleClientAccountSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in clientAccountForm.data) {
            if (clientAccountForm.data[key] !== null) {
                formData.append(key, clientAccountForm.data[key]);
            }
        }

        const isEditing = !!currentClientAccount;
        const currentId = currentClientAccount?.id;

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                // Refresh data by reloading the page


            },
            onError: (errors) => {
                ShowMessage('error', 'Failed to save client account');
            }

        };



        if (isEditing && currentId) {
            formData.append('_method', 'PUT');
            router.post(route('client-account.update', currentId), formData, options);
        } else {
            clientAccountForm.post(route('client-account.store'), formData, options);
        }

        clientAccountForm.reset();
        setShowClientAccountModal(false);
        setCurrentClientAccount(null);
        router.reload();
        ShowMessage('success', `Client account ${isEditing ? 'updated' : 'created'} successfully`);
        setTimeout(() => {
            window.location.reload();
        }, 1000);



    };

    // Delete handler
    const handleDelete = (itemId, type) => {
        destroy(route(`${type}.destroy`, itemId), {
            preserveScroll: true,
            onSuccess: () => {
                ShowMessage('success', 'Item deleted successfully');
            },
            onError: () => {
                ShowMessage('error', 'Failed to delete item');
            }
        });
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
                narration: product.narration || '',
                is_price_visible: challanForm.data.is_price_visible,
                qty: product.qty,
                total: product.total,
                is_credited: product.is_credited,
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

            <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                <BreadCrumbHeader breadcrumbs={[
                    { href: '/clients', label: 'Clients', active: false },
                    { href: `/clients/${client.id}`, label: client.client_name, active: true }
                ]} />

                <div className="d-flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
                        <RefreshCw size={14} />
                    </Button>

                    <Button className="d-flex align-items-center gap-2" size="sm" onClick={() => handleAnalytics()}>
                        {showAnalytics ? <Eye size={13} /> : <EyeOff size={14} />} Analytics
                    </Button>

                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Create
                        </button>
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
                        </ul>
                    </div>
                </div>
            </div>

            {showAnalytics && (
                <div>
                    {/* Client Summary */}
                    <Row>
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
                                            <h6 className="mb-1 fw-bold">{analytics.totalItems}</h6>
                                            <small className="text-muted">Total Items</small>
                                        </div>
                                        <div className="text-center">
                                            <h6 className="mb-1 fw-bold">{analytics.totalQuantity}</h6>
                                            <small className="text-muted">Total Quantity</small>
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

                    {/* Analytics Cards */}


                </div>
            )}

            {/* Tab Navigation */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
            >

                <Tab eventKey="vendor-lists" title={
                    <span className="d-flex align-items-center gap-1">
                        <ShoppingBag size={16} /> Vendor List
                    </span>
                }>
                    <PurchaseListTab
                        client={client}
                        handleEditAccount={(purchase_list) => openPurchaseListModal(purchase_list)}
                        handleDeleteItem={handleDelete}
                        clientVendors={client_vendors}
                    />
                </Tab>

                <Tab eventKey="purchase-items" title={
                    <span className="d-flex align-items-center gap-1">
                        <Package size={16} /> Ledger
                    </span>
                }>
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
                </Tab>



                <Tab eventKey="project-document-lists" title={
                    <span className="d-flex align-items-center gap-1">
                        <FileText size={16} /> Document
                    </span>
                }>
                    <ProjectDocumentTab
                        client={client}
                    />
                </Tab>
            </Tabs>

            {/* Purchase List Modal */}
            <PurchaseListModal
                show={showPurchaseListModal}
                onHide={() => setShowPurchaseListModal(false)}
                form={purchaseListForm}
                errors={purchaseListForm.errors}
                isEditing={!!currentPurchaseList}
                handleSubmit={handlePurchaseListSubmit}
                vendors={vendors}
            />

            {/* Client Account Modal */}
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
                                                    <td>{item.description ?? 'NA'}</td>
                                                    <td>{item.unit_type ?? 'NA'}</td>
                                                    <td>
                                                        {
                                                            item.qty > 1 ? item.qty : 'NA'
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

            <style jsx>{`
                .gradient-total-value {
                    background: linear-gradient(135deg, #f5f9ff 0%, #e3eeff 100%);
                    border-left: 4px solid #3b7ddd;
                }
                .gradient-items {
                    background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
                    border-left: 4px solid #1cbb8c;
                }
                .gradient-category {
                    background: linear-gradient(135deg, #fff8f5 0%, #fff2e6 100%);
                    border-left: 4px solid #fcb92c;
                }
                .gradient-actions {
                    background: linear-gradient(135deg, #f9f7ff 0%, #f0ebff 100%);
                    border-left: 4px solid #727cf5;
                }
                .card-hover {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .animate__pulse {
                    animation-duration: 1s;
                }
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .tooltip-custom {
                    visibility: hidden;
                    width: 120px;
                    background-color: #555;
                    color: #fff;
                    text-align: center;
                    border-radius: 6px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%;
                    left: 50%;
                    margin-left: -60px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .position-relative:hover .tooltip-custom {
                    visibility: visible;
                    opacity: 1;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}