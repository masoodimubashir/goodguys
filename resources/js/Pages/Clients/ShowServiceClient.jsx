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
    Card, Table, Button, Badge, ProgressBar, Row, Col, Form, Tabs, Tab, InputGroup
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

export default function ShowServiceClient({ client, vendors = [], client_vendors = [] }) {


    // State management

    const { delete: destroy } = useForm();
    const flash = usePage().props.flash;

    const [activeTab, setActiveTab] = useState('purchase-items');
    const [purchaseItems, setPurchaseItems] = useState(client.purchase_items || []);
    const [filteredItems, setFilteredItems] = useState(client.purchase_items || []);
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
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

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
        const totalValue = filteredItems.reduce((sum, item) => {
            const qty = parseInt(item.qty);
            const price = parseFloat(item.price);
            return qty > 0 ? sum + (price * qty) : item.price;
        }, 0);

        const averagePrice = filteredItems.length > 0 ?
            filteredItems.reduce((sum, item) => sum + parseFloat(item.price), 0) / filteredItems.length : 0;

        const categories = {};
        filteredItems.forEach(item => {
            const category = item.unit_type || 'Uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });

        const topCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, '');
        const topCategoryCount = topCategory ? categories[topCategory] : 0;

        return {
            totalValue,
            averagePrice,
            totalItems: filteredItems.length,
            totalQuantity: filteredItems.reduce((sum, item) => sum + parseInt(item.qty), 0),
            topCategory,
            topCategoryCount,
            topCategoryPercentage: filteredItems.length > 0
                ? Math.round((topCategoryCount / filteredItems.length) * 100)
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
                        console.error('Error deleting item:', errors);
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
            const tables = [
                refs.tableRef.current?.querySelector('table'),
                refs.purchaseListRef.current?.querySelector('table'),
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
    }, [client.invoices, client.proformas, client.purchase_lists]);

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    // Modal handlers
    const openModal = (type, item = null) => {
        setState(prev => ({
            ...prev,
            showPurchaseListModal: true,
            isEditingPurchaseList: !!item,
            currentPurchaseListId: item?.id || null
        }));
        purchaseListForm.reset();
        if (item) purchaseListForm.setData(item);
    };

    // Form submission handlers
    const handleSubmit = async (type, e) => {
        e.preventDefault();

        let form, isEditing, currentId;

        form = purchaseListForm;
        isEditing = state.isEditingPurchaseList;
        currentId = state.currentPurchaseListId;
        form.reset();

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



    // Alternative Option 2: Use router.post directly
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
            console.error('Error creating challan:', errors);
            ShowMessage('error', 'Failed to create challan');
        }
    });
};


    // Reset date filter
    const resetDateFilter = () => {
        setDateRange([null, null]);
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
                    <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
                        <RefreshCw size={14} />
                    </Button>

                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Create
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">

                            <li>
                                <Link href={route('bank-account.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-building-bank me-2"></i> Bank Account
                                </Link>
                            </li>
                            {/* <li>
                                <Link href={route('purchased-item.index', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-building-bank me-2"></i> Purchase Item
                                </Link>
                            </li> */}
                            <li>
                                <Link href={route('challan.show', client.id)} className="dropdown-item">
                                    <i className="ti ti-building-bank me-2"></i> Challans
                                </Link>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => openModal('purchase-list')}>
                                    <i className="ti ti-shopping-cart me-2"></i> Purchase List
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                {/* Client Summary */}
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
            </div>

            {/* Tab Navigation */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
            >
                <Tab eventKey="purchase-items" title={
                    <span className="d-flex align-items-center gap-1">
                        <Package size={16} /> Ledger
                    </span>
                }>
                    <div className="">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center gap-2">
                                <Badge bg="primary" pill>
                                    {filteredItems.length} items
                                </Badge>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="primary"
                                    className="d-flex align-items-center gap-2"
                                    size="sm"
                                    onClick={() => setNewItem(prev => ({ ...prev, show: true }))}
                                >
                                    <Plus size={16} /> Add Entry
                                </Button>
                                <Button
                                    variant="success"
                                    className="d-flex align-items-center gap-2"
                                    size="sm"
                                    onClick={openChallanForm}
                                    disabled={!Object.values(challanState.selectedProducts).some(selected => selected)}
                                >
                                    <ShoppingCart size={16} /> Create Challan
                                </Button>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className=" d-flex gap-3">
                            <div className="flex-grow-1">
                                <InputGroup>
                                    <InputGroup.Text>
                                        <Search size={14} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                            <div className="d-flex gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => setDateRange(update)}
                                        isClearable={true}
                                        placeholderText="Filter by date range"
                                        className="form-control form-control-sm"
                                    />
                                    {(startDate || endDate) && (
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={resetDateFilter}
                                            title="Clear date filter"
                                        >
                                            <XCircle size={14} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>



                        <Table hover responsive size='sm' className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>
                                        <Button
                                            variant="link"
                                            className="p-0"
                                            onClick={() => {
                                                const allSelected = purchaseItems.every(item => challanState.selectedProducts[item.id]);
                                                const newSelection = {};
                                                purchaseItems.forEach(item => {
                                                    newSelection[item.id] = !allSelected;
                                                });
                                                setChallanState(prev => ({
                                                    ...prev,
                                                    selectedProducts: newSelection
                                                }));
                                            }}
                                            title="Select all for challan"
                                        >
                                            <Check
                                                size={18}
                                                className={purchaseItems.length > 0 && purchaseItems.every(item => challanState.selectedProducts[item.id])
                                                    ? "text-danger"
                                                    : "text-muted"}
                                            />
                                        </Button>
                                    </th>
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
                                                value={newItem.qty > 0 ? newItem.qty : newItem.qty}
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
                                            {newItem.qty > 0 ?
                                                formatCurrency((parseFloat(newItem.price) || 0) * (parseInt(newItem.qty) || 1)) : newItem.qty}
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
                                                            narration: '',
                                                            show: false
                                                        }))}
                                                    >
                                                        <XCircle size={12} />
                                                    </Button>
                                                </CustomTooltip>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {filteredItems.map((item, index) => {
                                    const isExpanded = expandedItems.includes(item.id);
                                    const isEditing = editingItemId === item.id;
                                    const totalValue = item.qty > 0 ? (parseFloat(item.price) || 0) * (parseInt(item.qty) || 1) : item.price;

                                    return (
                                        <React.Fragment key={item.id}>
                                            <tr className={`align-middle`}>
                                                <td>
                                                    <Button
                                                        variant="link"
                                                        className="p-0"
                                                        onClick={() => toggleProductSelection(item.id)}
                                                        title="Select for challan"
                                                    >
                                                        <Check
                                                            size={18}
                                                            className={challanState.selectedProducts[item.id] ? "text-danger" : "text-muted"}
                                                        />
                                                    </Button>
                                                </td>
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
                                                        <span className="fw-bold">{item.qty > 0 ? item.qty : 'NA'}</span>
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
                                {filteredItems.length === 0 && !newItem.show && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-5">
                                            <div className="text-muted">
                                                <Package size={20} className="mb-3 opacity-50" />
                                                <h5 className="mb-2">No Items Found</h5>
                                                {searchTerm || (startDate || endDate) ? (
                                                    <p>No items match your search criteria</p>
                                                ) : (
                                                    <p>No items available for this client</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Tab>

                <Tab eventKey="purchase-lists" title={
                    <span className="d-flex align-items-center gap-1">
                        <ShoppingBag size={16} /> Vendor List
                    </span>
                }>
                    <PurchaseListTab
                        client={client}
                        tableRef={useRef(null)}
                        handleEditAccount={(purchase_list) => openModal('purchase-list', purchase_list)}
                        handleDeleteItem={handleDelete}
                        clientVendors={client_vendors}
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
                show={state.showPurchaseListModal}
                onHide={() => setState(prev => ({ ...prev, showPurchaseListModal: false }))}
                form={purchaseListForm}
                errors={purchaseListForm.errors}
                isEditing={state.isEditingPurchaseList}
                handleSubmit={(e) => handleSubmit('purchase-list', e)}
                vendors={vendors}
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