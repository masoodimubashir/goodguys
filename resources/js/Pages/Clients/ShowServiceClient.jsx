import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Modal from 'react-bootstrap/Modal';
import PurchaseListTab from '@/Components/PurchaseListTab';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import {
    Card, Table, Button, Badge, ProgressBar, Row, Col, Form, Tabs, Tab
} from 'react-bootstrap';
import {
    ShoppingCart, Plus, Edit, Trash2, Save, XCircle, ChevronDown, ChevronRight,
    FileText, Calendar, IndianRupee, Activity, Package, RotateCcw, Eye, EyeOff,
    Download, RefreshCw, HandCoins, Undo2, BarChart3, Zap, Building2, User2,
    Phone, Mail, MapPin, Percent, TrendingUp, Banknote, Wallet, Receipt,
    Text, Box, Layers, PieChart, ShoppingBag, CreditCard, Database, ArrowRight
} from 'lucide-react';
import { ClientInfoCard } from '@/Components/ClientInfoCard';
import { BankAccountCard } from '@/Components/BankAccountCard';
import { PurchaseListModal } from '@/Components/PurchaseListModal';

export default function ShowClient({ client, modules = [], inventoryOptions = [], vendors = [], company_profile = null, client_vendors = [] }) {
    // State management
    const [activeTab, setActiveTab] = useState('overview');
    const [purchaseItems, setPurchaseItems] = useState(client.purchase_items || []);
    const [expandedItems, setExpandedItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedItems, setEditedItems] = useState({});
    const [newItem, setNewItem] = useState({
        client_id: client.id,
        unit_type: '',
        description: '',
        qty: '',
        price: '',
        narration: '',
        show: false
    });
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [animatingCards, setAnimatingCards] = useState(new Set());
    const [isCreating, setIsCreating] = useState(false);

    // Animation classes
    const animationClasses = {
        slideInUp: 'animate__animated animate__slideInUp',
        fadeIn: 'animate__animated animate__fadeIn',
        slideIn: 'animate__animated animate__slideInLeft'
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    };

    // Calculate analytics
    const calculateAnalytics = () => {
        const totalValue = purchaseItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);
        const averagePrice = purchaseItems.length > 0 ?
            purchaseItems.reduce((sum, item) => sum + parseFloat(item.price), 0) / purchaseItems.length : 0;

        const categories = {};
        purchaseItems.forEach(item => {
            const category = item.unit_type || 'Uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });

        const topCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, '');
        const topCategoryCount = topCategory ? categories[topCategory] : 0;

        return {
            totalValue,
            averagePrice,
            totalItems: purchaseItems.length,
            totalQuantity: purchaseItems.reduce((sum, item) => sum + parseInt(item.qty), 0),
            topCategory,
            topCategoryCount,
            topCategoryPercentage: purchaseItems.length > 0
                ? Math.round((topCategoryCount / purchaseItems.length) * 100)
                : 0
        };
    };

    const analytics = calculateAnalytics();

    // Toggle item expansion
    const toggleItemExpansion = (itemId) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Trigger card animation
    const triggerCardAnimation = (cardId) => {
        setAnimatingCards(prev => {
            const newSet = new Set(prev);
            newSet.add(cardId);
            return newSet;
        });

        setTimeout(() => {
            setAnimatingCards(prev => {
                const newSet = new Set(prev);
                newSet.delete(cardId);
                return newSet;
            });
        }, 1000);
    };

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
            console.error('Cannot save item - missing ID:', item);
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
                console.error('Error saving item:', errors);
                ShowMessage('Error', 'Failed to update item');
            }
        });
    };

    // Delete item
    const deleteItem = (itemId) => {
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(`/purchased-item/${itemId}`, {
                onSuccess: () => {
                    setPurchaseItems(prev => prev.filter(i => i.id !== itemId));
                    ShowMessage('Success', 'Item deleted successfully');
                },
                onError: (errors) => {
                    console.error('Error deleting item:', errors);
                    ShowMessage('Error', 'Failed to delete item');
                }
            });
        }
    };

    // Create new item - FIXED VERSION
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
                // Try multiple ways to get the created item from response
                const createdItem = response.props?.item ||
                    response.props?.purchase_item ||
                    response.props?.data?.item ||
                    response.item ||
                    response.data?.item;

                if (createdItem) {
                    setPurchaseItems(prev => [...prev, createdItem]);
                    ShowMessage('Success', 'Item created successfully');
                } else {
                    // If we can't find the item in response, refresh the data
                    router.reload({
                        only: ['client'],
                        onSuccess: (updated) => {
                            setPurchaseItems(updated.props.client.purchase_items || []);
                            ShowMessage('Success', 'Item created - data refreshed');
                        }
                    });
                }

                // Reset the form
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
                console.error('Error creating item:', errors);
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

    const breadcrumbs = [
        { href: `/clients/${client.id}`, label: 'Back', active: true }
    ];


    const { delete: destroy } = useForm();
    const flash = usePage().props.flash;

    // State management
    const [state, setState] = useState({
        showPurchaseListModal: false,
        isEditingPurchaseList: false,
        currentAccountId: null,
        currentPurchaseListId: null,
        isLoading: false
    });

    // Refs
    const refs = {
        tableRef: useRef(null),
        purchaseListRef: useRef(null),
    };

    const purchaseListForm = useInertiaForm({
        vendor_id: '',
        client_id: client.id || '',
        list_name: '',
        purchase_date: new Date().toISOString().split('T')[0],
        bill: null,
        bill_total: '',
        bill_description: '',
    });



    useEffect(() => {
        const initializeDataTables = () => {
            // Only initialize DataTables on table elements
            const tables = [
                refs.tableRef.current?.querySelector('table'),
                refs.purchaseListRef.current?.querySelector('table'),
            ].filter(Boolean); // Remove null/undefined

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

        // Cleanup function to destroy DataTables when component unmounts
        return () => {
            $('.dataTable').DataTable().destroy().clear();
        };
    }, [client.invoices, client.proformas, client.purchase_lists]);

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);



    // Modal handlers
    const openModal = (type, item = null) => {
        switch (type) {

            case 'purchase-list':
                setState(prev => ({
                    ...prev,
                    showPurchaseListModal: true,
                    isEditingPurchaseList: !!item,
                    currentPurchaseListId: item?.id || null
                }));
                purchaseListForm.reset();
                if (item) purchaseListForm.setData(item);
                break;

            default:
                break;
        }
    };

    // Form submission handlers
    const handleSubmit = async (type, e) => {

        e.preventDefault();

        let form, isEditing, currentId;

        switch (type) {

            case 'purchase-list':
                form = purchaseListForm;
                isEditing = state.isEditingPurchaseList;
                currentId = state.currentPurchaseListId;
                break;

            default:
                return;
        }

        const formData = new FormData();
        for (const key in form.data) {
            if (form.data[key] !== null) {
                formData.append(key, form.data[key]);
            }
        }

        const pascalType = type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setState(prev => ({
                    ...prev,
                    [`show${pascalType}Modal`]: false,
                    [`isEditing${pascalType}`]: false,
                    [`current${pascalType}Id`]: null
                }));
                ShowMessage('success', `${type.replace('-', ' ')} ${isEditing ? 'updated' : 'created'} successfully`);
            }
        };



        if (isEditing && currentId) {
            formData.append('_method', 'PUT');
            router.post(route(`${type}.update`, currentId), formData, options);
        } else {
            form.post(route(`${type}.store`), formData, options);
        }
    };

    // Delete handler
    const handleDelete = (itemId, type) => {
        const url = type + '.' + 'destroy';
        destroy(route(url, itemId), {
            preserveScroll: true,
            onSuccess: () => {
                Object.values(refs).forEach(ref => {
                    if (ref.current && $.fn.DataTable.isDataTable(ref.current)) {
                        $(ref.current).DataTable().ajax.reload();
                    }
                });
            }
        });
    };


    return (
        <AuthenticatedLayout>
            <Head title={`Client - ${client.client_name}`} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <BreadCrumbHeader breadcrumbs={[
                    { href: '/clients', label: 'Clients', active: false },
                    { href: `/clients/${client.id}`, label: client.client_name, active: true }
                ]} />

                <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
                        <RefreshCw size={14} />
                    </Button>

                  

                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Create
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link href={route('invoice.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-file-invoice me-2"></i> Invoice
                                </Link>
                            </li>

                            <li>
                                <Link href={route('bank-account.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-building-bank me-2"></i> Bank Account
                                </Link>
                            </li>

                            <li>
                                <Link href={route('purchased-item.index', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-building-bank me-2"></i> Purchase Item
                                </Link>
                            </li>

                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <button className="dropdown-item" onClick={() => openModal('purchase-list')}>
                                    <i className="ti ti-shopping-cart me-2"></i> Purchase List
                                </button>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>



            {/* Tab Navigation */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
                fill
            >
                <Tab eventKey="overview" title={
                    <span className="d-flex align-items-center gap-1">
                        <BarChart3 size={16} /> Overview
                    </span>
                }>
                    <div className="container-fluid py-4">
                        {/* Client Summary */}
                        <Row className="mb-4">
                            <ClientInfoCard client={client} />
                            {client.bank_account && <BankAccountCard BankProfile={client.bank_account} />}
                        </Row>

                        {/* Analytics Cards */}
                        <Row className="g-3 mb-4">
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


                        {/* Mini Preview Tables */}
                        <Row className="g-3">
                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Header className="bg-white border-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className="mb-0 d-flex align-items-center gap-2">
                                                <ShoppingCart size={18} /> Recent Purchase Items
                                            </h6>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => setActiveTab('purchase-items')}
                                            >
                                                View All <ArrowRight size={16} />
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Price</th>
                                                    <th>Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {purchaseItems.slice(0, 3).map(item => (
                                                    <tr key={item.id}>
                                                        <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                                            {item.description}
                                                        </td>
                                                        <td>{formatCurrency(item.price)}</td>
                                                        <td>{item.qty}</td>
                                                    </tr>
                                                ))}
                                                {purchaseItems.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="text-center py-4 text-muted">
                                                            No purchase items found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Header className="bg-white border-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className="mb-0 d-flex align-items-center gap-2">
                                                <CreditCard size={18} /> Recent Purchase Lists
                                            </h6>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => setActiveTab('purchase-lists')}
                                            >
                                                View All <ArrowRight size={16} />
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>List</th>
                                                    <th>Date</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {client.purchase_lists?.slice(0, 3).map(list => (
                                                    <tr key={list.id}>
                                                        <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                                            {list.list_name}
                                                        </td>
                                                        <td>{new Date(list.purchase_date).toLocaleDateString()}</td>
                                                        <td>{formatCurrency(list.bill_total)}</td>
                                                    </tr>
                                                ))}
                                                {(!client.purchase_lists || client.purchase_lists.length === 0) && (
                                                    <tr>
                                                        <td colSpan={3} className="text-center py-4 text-muted">
                                                            No purchase lists found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Tab>

                <Tab eventKey="purchase-items" title={
                    <span className="d-flex align-items-center gap-1">
                        <Package size={16} /> Purchase Items
                    </span>
                }>
                    <div className="">

                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-0 p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <h5 className="mb-0 fw-bold">Purchase Items</h5>
                                        <Badge bg="primary" pill>
                                            {purchaseItems.length} items
                                        </Badge>
                                    </div>
                                    <div className="d-flex gap-2 mb-2">
                                        <Button
                                            variant="primary"
                                            className="d-flex align-items-center gap-2"
                                            size="sm"
                                            onClick={() => setNewItem(prev => ({
                                                ...prev,
                                                show: true
                                            }))}
                                        >
                                            <Plus size={14} /> Add Item
                                        </Button>

                                    </div>
                                </div>
                            </Card.Header>



                            <Card.Body className="p-0">
                                <Table hover bordered responsive size='sm' className="mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>
                                                <div className="d-flex align-items-center gap-2">
                                                    <FileText size={14} />
                                                    Description
                                                </div>
                                            </th>
                                            <th>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Package size={14} />
                                                    Unit Type
                                                </div>
                                            </th>
                                            <th>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Activity size={14} />
                                                    Quantity
                                                </div>
                                            </th>
                                            <th>
                                                <div className="d-flex align-items-center gap-2">
                                                    <IndianRupee size={14} />
                                                    Price
                                                </div>
                                            </th>
                                            <th>
                                                <div className="d-flex align-items-center gap-2">
                                                    <IndianRupee size={14} />
                                                    Total
                                                </div>
                                            </th>
                                            <th>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Text size={14} />
                                                    Narration
                                                </div>
                                            </th>
                                            <th style={{ width: '140px' }}>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {/* New Item Row */}
                                        {newItem.show && (
                                            <tr className="table-warning bounce-in" key={newItem.id}>
                                                <td></td>
                                                <td>
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        placeholder="Item description"
                                                        value={newItem.description}
                                                        onChange={e => handleNewItemChange('description', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        placeholder="Unit type"
                                                        value={newItem.unit_type}
                                                        onChange={e => handleNewItemChange('unit_type', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        size="sm"
                                                        type="number"
                                                        min="1"
                                                        placeholder="Quantity"
                                                        value={newItem.qty}
                                                        onChange={e => handleNewItemChange('qty', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        size="sm"
                                                        type="number"
                                                        min="0"
                                                        placeholder="Price"
                                                        value={newItem.price}
                                                        onChange={e => handleNewItemChange('price', e.target.value)}
                                                    />
                                                </td>

                                                <td>
                                                    {formatCurrency((parseFloat(newItem.price) || 0) * (parseInt(newItem.qty) || 1))}
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        size="sm"
                                                        as={'textArea'}
                                                        min="0"
                                                        placeholder="enter narration"
                                                        value={newItem.narration}
                                                        onChange={e => handleNewItemChange('narration', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <CustomTooltip>
                                                            <Button
                                                                size="sm"
                                                                variant="success"
                                                                onClick={createItem}
                                                                disabled={!newItem.description || !newItem.unit_type || !newItem.qty || !newItem.price}
                                                                className="bounce-in"
                                                            >
                                                                <Save size={12} />
                                                            </Button>
                                                        </CustomTooltip>
                                                        <CustomTooltip>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-secondary"
                                                                onClick={() => setNewItem(prev => ({
                                                                    client_id: client.id,
                                                                    unit_type: '',
                                                                    description: '',
                                                                    qty: '',
                                                                    price: '',
                                                                    narration: ''
                                                                }))}
                                                            >
                                                                <XCircle size={12} />
                                                            </Button>
                                                        </CustomTooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {purchaseItems.map((item, index) => {
                                            const isExpanded = expandedItems.includes(item.id);
                                            const isEditing = editingItemId === item.id;
                                            const totalValue = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 1);

                                            return (
                                                <React.Fragment key={item.id}>
                                                    <tr className={`align-middle`}>
                                                       
                                                        <td>
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    size="sm"
                                                                    type="text"
                                                                    value={editedItems[item.id]?.description || item.description}
                                                                    onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                                                                />
                                                            ) : (
                                                                <div>
                                                                    <span className="fw-bold">{item.description}</span>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        ID: #{item.id}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    size="sm"
                                                                    type="text"
                                                                    value={editedItems[item.id]?.unit_type || item.unit_type}
                                                                    onChange={e => handleItemChange(item.id, 'unit_type', e.target.value)}
                                                                />
                                                            ) : (
                                                                <span className="fw-medium">{item.unit_type}</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    size="sm"
                                                                    type="number"
                                                                    min="0"
                                                                    value={editedItems[item.id]?.qty ?? ''}
                                                                    onChange={e => handleItemChange(
                                                                        item.id,
                                                                        'qty',
                                                                        e.target.value === '' ? '' : parseInt(e.target.value) || 0
                                                                    )}
                                                                    onFocus={e => e.target.select()}
                                                                    placeholder="Enter quantity"
                                                                />
                                                            ) : (
                                                                <span className="fw-bold">{item.qty}</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    size="sm"
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={editedItems[item.id]?.price ?? ''}
                                                                    onChange={e => handleItemChange(
                                                                        item.id,
                                                                        'price',
                                                                        e.target.value === '' ? '' : parseFloat(e.target.value) || 0
                                                                    )}
                                                                    onFocus={e => e.target.select()}
                                                                    placeholder="Enter price"
                                                                />
                                                            ) : (
                                                                <span 
                                                                className="fw-bold text-primary">
                                                                    {formatCurrency(item.price)}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span 
                                                            className="fw-bold text-success">
                                                                {formatCurrency(totalValue)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={3}
                                                                    className="fade-in"
                                                                    value={editedItems[item.id]?.narration || item.narration || ''}
                                                                    onChange={e => handleItemChange(item.id, 'narration', e.target.value)}
                                                                    placeholder="Enter item narration..."
                                                                    style={{
                                                                        minWidth: '200px',
                                                                        transition: 'all 0.3s ease',
                                                                        border: '1px solid #dee2e6',
                                                                        borderRadius: '4px',
                                                                        fontSize: '14px'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className={`text-truncate ${!item.narration ? 'text-muted' : ''}`}
                                                                   
                                                                >
                                                                    {item.narration || (
                                                                        <small className="d-flex align-items-center gap-1 text-muted">
                                                                            <FileText size={12} />
                                                                            Click to add narration
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <div className="d-flex gap-1">
                                                                    <CustomTooltip>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="success"
                                                                            onClick={() => saveItem(item)}
                                                                            className="bounce-in"
                                                                        >
                                                                            <Save size={12} />
                                                                        </Button>
                                                                    </CustomTooltip>
                                                                    <CustomTooltip>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline-secondary"
                                                                            onClick={() => {
                                                                                setEditingItemId(null);
                                                                                setEditedItems(prev => {
                                                                                    const newState = { ...prev };
                                                                                    delete newState[item.id];
                                                                                    return newState;
                                                                                });
                                                                            }}
                                                                        >
                                                                            <XCircle size={12} />
                                                                        </Button>
                                                                    </CustomTooltip>
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex gap-1">
                                                                    <CustomTooltip>
                                                                        <Button
                                                                            variant="link"
                                                                            className="p-1 text-primary"
                                                                            onClick={() => {
                                                                                setEditingItemId(item.id);
                                                                                setEditedItems(prev => ({
                                                                                    ...prev,
                                                                                    [item.id]: {
                                                                                        id: item.id,
                                                                                        unit_type: item.unit_type,
                                                                                        description: item.description,
                                                                                        qty: item.qty,
                                                                                        price: item.price,
                                                                                        narration: item.narration
                                                                                    }
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <Edit size={14} />
                                                                        </Button>
                                                                    </CustomTooltip>
                                                                    <CustomTooltip>
                                                                        <Button
                                                                            variant="link"
                                                                            className="p-1 text-danger"
                                                                            onClick={() => deleteItem(item.id)}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </Button>
                                                                    </CustomTooltip>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>

                                                  
                                                </React.Fragment>
                                            );
                                        })}

                                        {/* Empty State for Purchase Items */}
                                        {purchaseItems.length === 0 && !newItem.show && (
                                            <tr>
                                                <td colSpan={8} className="text-center py-5">
                                                    <div className="text-muted">
                                                        <Package size={20} className="mb-3 opacity-50" />
                                                        <h5 className="mb-2">No Purchase Items Found</h5>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </div>
                </Tab>

                <Tab eventKey="purchase-lists" title={
                    <span className="d-flex align-items-center gap-1">
                        <ShoppingBag size={16} /> Purchase Lists
                    </span>
                }>
                    <div className="container-fluid py-4">
                        <PurchaseListTab
                            client={client}
                            tableRef={useRef(null)}
                            handleEditAccount={(purchase_list) => openModal('purchase-list', purchase_list)}
                            handleDeleteItem={handleDelete}
                            clientVendors={client_vendors}
                        />
                    </div>
                </Tab>
            </Tabs>

            {/* ... (your existing modals) ... */}

            <PurchaseListModal
                show={state.showPurchaseListModal}
                onHide={() => setState(prev => ({ ...prev, showPurchaseListModal: false }))}
                form={purchaseListForm}
                errors={purchaseListForm.errors}
                isEditing={state.isEditingPurchaseList}
                handleSubmit={(e) => handleSubmit('purchase-list', e)}
                vendors={vendors}
            />

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
            `}</style>
        </AuthenticatedLayout>
    );
}


