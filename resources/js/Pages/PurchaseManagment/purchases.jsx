import React, { useState, useEffect } from 'react';
import {
    Edit, Trash2, Plus, Save, ChevronDown, ChevronRight,
    Wallet, IndianRupee, Phone, Mail, MapPin, FileText, Building2,
    User2, Package, RefreshCw, HandCoins, Undo2,
    TrendingUp, Calendar, Activity, BarChart3, XCircle, Eye, EyeOff, Download, Percent, Receipt,
    Zap, ShoppingCart, Banknote, RotateCcw
} from 'lucide-react';
import { Card, Table, Form, Button, Badge, ProgressBar, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import { router } from '@inertiajs/react';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';

const Purchases = ({ vendor }) => {
    // Extract data from vendor prop
    const client = vendor.purchase_lists?.[0]?.client || {};
    const purchases = vendor.purchase_lists || [];

    // State management
    const [expandedPurchases, setExpandedPurchases] = useState([]);
    const [editingAllocationId, setEditingAllocationId] = useState(null);
    const [editingReturnId, setEditingReturnId] = useState(null);
    const [editedAllocations, setEditedAllocations] = useState({});
    const [editedReturns, setEditedReturns] = useState({});
    const [newAllocations, setNewAllocations] = useState({});
    const [newReturns, setNewReturns] = useState({});
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [animatingCards, setAnimatingCards] = useState(new Set());

    // Enhanced calculations
    const totalPurchases = purchases.reduce((sum, p) => sum + parseFloat(p.bill_total || 0), 0);
    const totalAllocated = purchases.reduce((sum, p) =>
        sum + (p.purchase_managments || []).reduce((aSum, a) => aSum + parseFloat(a.amount || 0), 0), 0);
    const totalReturns = purchases.reduce((sum, p) =>
        sum + (p.return_lists || []).reduce((rSum, r) => rSum + parseFloat(r.price || 0), 0), 0);
    const totalRemaining = totalPurchases - totalAllocated - totalReturns;
    const allocationPercentage = totalPurchases > 0 ? ((totalAllocated + totalReturns) / totalPurchases) * 100 : 0;

    const getRemainingBudget = (purchase) => {
        const allocated = (purchase.purchase_managments || []).reduce((sum, a) => sum + parseFloat(a.amount || 0), 0);
        const returned = (purchase.return_lists || []).reduce((sum, r) => sum + parseFloat(r.price || 0), 0);
        return parseFloat(purchase.bill_total || 0) - allocated - returned;
    };

    // Advanced Analytics
    const analytics = {
        averagePurchaseAmount: purchases.length > 0 ? totalPurchases / purchases.length : 0,
        averagePaymentAmount: purchases.reduce((sum, p) => sum + (p.purchase_managments?.length || 0), 0) > 0
            ? totalAllocated / purchases.reduce((sum, p) => sum + (p.purchase_managments?.length || 0), 0) : 0,
        averageReturnAmount: purchases.reduce((sum, p) => sum + (p.return_lists?.length || 0), 0) > 0
            ? totalReturns / purchases.reduce((sum, p) => sum + (p.return_lists?.length || 0), 0) : 0,
        completedPurchases: purchases.filter(p => getRemainingBudget(p) <= 0).length,
        pendingPurchases: purchases.filter(p => getRemainingBudget(p) > 0).length,
        overAllocatedPurchases: purchases.filter(p => getRemainingBudget(p) < 0).length,
        totalTransactions: purchases.reduce((sum, p) =>
            sum + (p.purchase_managments?.length || 0) + (p.return_lists?.length || 0), 0),
        returnRate: totalPurchases > 0 ? (totalReturns / totalPurchases) * 100 : 0,
        paymentEfficiency: totalPurchases > 0 ? (totalAllocated / totalPurchases) * 100 : 0,
        oldestPendingDays: purchases.length > 0 ? Math.max(...purchases
            .filter(p => getRemainingBudget(p) > 0)
            .map(p => Math.floor((new Date() - new Date(p.purchase_date)) / (1000 * 60 * 60 * 24)))) : 0
    };

    // Animation CSS classes
    const animationClasses = {
        fadeIn: 'animate__animated animate__fadeIn',
        slideInUp: 'animate__animated animate__slideInUp',
        slideInDown: 'animate__animated animate__slideInDown',
        bounceIn: 'animate__animated animate__bounceIn',
        pulse: 'animate__animated animate__pulse',
        shake: 'animate__animated animate__shakeX',
        zoomIn: 'animate__animated animate__zoomIn',
        flipInX: 'animate__animated animate__flipInX'
    };

    // Trigger card animation
    const triggerCardAnimation = (cardId) => {
        setAnimatingCards(prev => new Set([...prev, cardId]));
        setTimeout(() => {
            setAnimatingCards(prev => {
                const newSet = new Set(prev);
                newSet.delete(cardId);
                return newSet;
            });
        }, 1000);
    };




    const handleAllocationChange = (purchaseId, allocationId, field, value) => {
        setEditedAllocations(prev => ({
            ...prev,
            [allocationId]: {
                ...(prev[allocationId] || {}),
                [field]: value
            }
        }));
    };

    const handleReturnChange = (purchaseId, returnId, field, value) => {
        setEditedReturns(prev => ({
            ...prev,
            [returnId]: {
                ...(prev[returnId] || {}),
                [field]: value
            }
        }));
    };

    const handleNewAllocationChange = (purchaseId, field, value) => {
        setNewAllocations(prev => ({
            ...prev,
            [purchaseId]: {
                ...(prev[purchaseId] || {}),
                [field]: value
            }
        }));
    };

    const handleNewReturnChange = (purchaseId, field, value) => {
        setNewReturns(prev => ({
            ...prev,
            [purchaseId]: {
                ...(prev[purchaseId] || {}),
                [field]: value
            }
        }));
    };

    const saveAllocation = async (purchaseId, allocation) => {
        try {
            triggerCardAnimation(`allocation-${allocation.id || 'new'}`);
            const purchase = purchases.find(p => p.id === purchaseId);
            const remaining = getRemainingBudget(purchase);

            const allocationToSave = allocation.id
                ? {
                    ...purchases
                        .find(p => p.id === purchaseId)
                        .purchase_managments.find(a => a.id === allocation.id),
                    ...editedAllocations[allocation.id]
                }
                : allocation;

            if (parseFloat(allocationToSave.amount || 0) > remaining) {
                ShowMessage('error', `Amount exceeds remaining budget (₹${remaining.toFixed(2)})`);
                return;
            }

            const formData = {
                purchase_list_id: purchaseId,
                transaction_date: allocationToSave.transaction_date,
                amount: allocationToSave.amount,
                narration: allocationToSave.narration
            };

            if (allocationToSave.id) {
                await router.put(route('purchase-managment.update', allocationToSave.id), formData, {
                    onSuccess: () => {
                        ShowMessage('success', 'Payment updated successfully');
                        setEditingAllocationId(null);
                        setEditedAllocations(prev => {
                            const newState = { ...prev };
                            delete newState[allocationToSave.id];
                            return newState;
                        });
                    },
                    onError: (errors) => {
                        ShowMessage('error', 'Failed to update allocation');
                        console.error(errors);
                    }
                });
            } else {
                await router.post(route('purchase-managment.store'), formData, {
                    onSuccess: () => {
                        ShowMessage('success', 'Payment created successfully');
                        setNewAllocations(prev => {
                            const copy = { ...prev };
                            delete copy[purchaseId];
                            return copy;
                        });
                    },
                    onError: (errors) => {
                        ShowMessage('error', 'Failed to create Payment');
                        console.error(errors);
                    }
                });
            }
        } catch (error) {
            ShowMessage('error', 'An unexpected error occurred');
            console.error(error);
        }
    };

    const saveReturn = async (purchaseId, returnItem) => {
        try {
            triggerCardAnimation(`return-${returnItem.id || 'new'}`);
            const returnToSave = returnItem.id
                ? {
                    ...purchases
                        .find(p => p.id === purchaseId)
                        .return_lists.find(r => r.id === returnItem.id),
                    ...editedReturns[returnItem.id]
                }
                : returnItem;

            const formData = {
                purchase_list_id: purchaseId,
                return_date: returnToSave.return_date,
                item_name: returnToSave.item_name,
                price: returnToSave.price,
                narration: returnToSave.narration
            };

            if (returnToSave.id) {
                await router.put(route('return-list.update', returnToSave.id), formData, {
                    onSuccess: () => {
                        ShowMessage('success', 'Return updated successfully');
                        setEditingReturnId(null);
                        setEditedReturns(prev => {
                            const newState = { ...prev };
                            delete newState[returnToSave.id];
                            return newState;
                        });
                    },
                    onError: (errors) => {
                        ShowMessage('error', 'Failed to update return');
                        console.error(errors);
                    }
                });
            } else {
                await router.post(route('return-list.store'), formData, {
                    onSuccess: () => {
                        ShowMessage('success', 'Return created successfully');
                        setNewReturns(prev => {
                            const copy = { ...prev };
                            delete copy[purchaseId];
                            return copy;
                        });
                    },
                    onError: (errors) => {
                        ShowMessage('error', 'Failed to create return');
                        console.error(errors);
                    }
                });
            }
        } catch (error) {
            ShowMessage('error', 'An unexpected error occurred');
            console.error(error);
        }
    };

    const deleteAllocation = (allocationId) => {
        if (confirm('Delete this allocation?')) {
            triggerCardAnimation(`allocation-${allocationId}`);
            router.delete(route('purchase-managment.destroy', allocationId), {
                onSuccess: () => ShowMessage('success', 'Payment deleted successfully')
            });
        }
    };

    const deleteReturn = (returnId) => {
        if (confirm('Delete this return?')) {
            triggerCardAnimation(`return-${returnId}`);
            router.delete(route('return-list.destroy', returnId), {
                onSuccess: () => ShowMessage('success', 'Return deleted successfully')
            });
        }
    };



    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount).replace('₹', '₹ ');
    };



    // Custom tooltip component
    const CustomTooltip = ({ children, text }) => (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{text}</Tooltip>}
        >
            {children}
        </OverlayTrigger>
    );

    const breadcrumbs = [
        { href: `/clients/${client.id} `, label: 'Back', active: true }
    ];

    return (
        <AuthenticatedLayout>
            <style jsx>{`
                @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
                
                .card-hover {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                }
                
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                .slide-in {
                    animation: slideIn 0.5s ease-out;
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                .fade-in {
                    animation: fadeIn 0.3s ease-in;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .bounce-in {
                    animation: bounceIn 0.6s ease-out;
                }
                
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .gradient-bg {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .gradient-success {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                }
                
                .gradient-warning {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }
                
                .gradient-info {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }
             
                
                @keyframes iconBounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                .table-row-hover {
                    transition: all 0.2s ease;
                }
                
                .table-row-hover:hover {
                    background-color: rgba(0,123,255,0.1);
                    transform: scale(1.01);
                }
                
                .progress-animated {
                    background-size: 40px 40px;
                    background-image: linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent);
                    animation: progress-bar-stripes 1s linear infinite;
                }
                
                @keyframes progress-bar-stripes {
                    0% { background-position: 40px 0; }
                    100% { background-position: 0 0; }
                }
            `}</style>

            <div className="container-fluid py-3">

                <div className="d-flex justify-content-between align-items-center">

                    <BreadCrumbHeader
                        breadcrumbs={breadcrumbs}
                    />

                   

                </div>
                {/* Enhanced Header with Analytics Toggle */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="mb-0 fw-bold">
                            <ShoppingCart size={28} className="me-2 text-primary" />
                            Purchase Management
                        </h5>
                        <Badge bg="primary" className="">
                            <Activity size={14} className="me-1" />
                            {purchases.length} Active Purchases
                        </Badge>
                    </div>
                    <div className="d-flex gap-2">
                        <CustomTooltip text="Toggle Analytics View">
                            <Button
                                variant={showAnalytics ? "primary" : "outline-primary"}
                                onClick={() => setShowAnalytics(!showAnalytics)}
                                className="d-flex align-items-center gap-2"
                            >
                                {showAnalytics ? <EyeOff size={10} /> : <Eye size={10} />}
                                Analytics
                            </Button>
                        </CustomTooltip>
                        <CustomTooltip text="Export Data">
                            <Button variant="success" className="d-flex align-items-center gap-2">
                                <Download size={16} />
                                Export
                            </Button>
                        </CustomTooltip>
                    </div>
                </div>

                {/* Vendor and Client Information Cards */}
                <Row className="g-3 mb-4">
                    <Col md={6}>
                        <Card className={`shadow-sm border-0 rounded-4 card-hover ${animationClasses.slideInUp}`}>
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                        <Building2 size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold">{vendor.vendor_name}</h6>
                                        <small className="text-muted">Vendor Details</small>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="mb-2 d-flex align-items-center gap-2">
                                        <Phone size={16} className="text-muted" />
                                        <span className="fw-medium">{vendor.contact_number}</span>
                                    </p>
                                    <p className="mb-2 d-flex align-items-center gap-2">
                                        <Mail size={16} className="text-muted" />
                                        <span className="fw-medium">{vendor.email}</span>
                                    </p>
                                    <p className="mb-2 d-flex align-items-center gap-2">
                                        <MapPin size={16} className="text-muted" />
                                        <span className="fw-medium">{vendor.address}</span>
                                    </p>
                                    <p className="mb-0 d-flex align-items-center gap-2">
                                        <FileText size={16} className="text-muted" />
                                        <span className="fw-medium">{vendor.description}</span>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className={`shadow-sm border-0 rounded-4 card-hover ${animationClasses.slideInUp}`} style={{ animationDelay: '0.1s' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                        <User2 size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold">{client.client_name}</h6>
                                        <small className="text-muted">Client Information</small>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="mb-2 d-flex align-items-center gap-2">
                                        <Building2 size={16} className="text-muted" />
                                        <span className="fw-medium">{client.site_name}</span>
                                    </p>
                                    <p className="mb-0 d-flex align-items-center gap-2">
                                        <MapPin size={16} className="text-muted" />
                                        <span className="fw-medium">{client.client_address}</span>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Enhanced Analytics Cards */}
                {showAnalytics && (
                    <div className={`mb-4 ${animationClasses.fadeIn}`}>
                        {/* Primary Metrics */}
                        <Row className="g-3 mb-3">
                            <Col md={3}>
                                <Card className={`border-0 shadow-sm h-100 card-hover gradient-bg text-white ${animatingCards.has('total-bill') ? 'pulse-animation' : ''}`}>
                                    <Card.Body className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h6 className="text-white-50 mb-1">Total Bill Amount</h6>
                                                <h6 className="mb-0 fw-bold">{formatCurrency(totalPurchases)}</h6>
                                                <small className="text-white-75">
                                                    <TrendingUp size={12} className="me-1" />
                                                    Avg: {formatCurrency(analytics.averagePurchaseAmount)}
                                                </small>
                                            </div>
                                            <div className="bg-white bg-opacity-20 p-3 rounded-circle text-black">
                                                <Receipt size={28} className="" />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card className={`border-0 shadow-sm h-100 card-hover gradient-success text-white ${animatingCards.has('total-paid') ? 'pulse-animation' : ''}`}>
                                    <Card.Body className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h6 className="text-white-50 mb-1">Total Payments</h6>
                                                <h6 className="mb-0 fw-bold">{formatCurrency(totalAllocated)}</h6>
                                                <small className="text-white-75">
                                                    <Percent size={12} className="me-1" />
                                                    {analytics.paymentEfficiency.toFixed(1)}% Efficiency
                                                </small>
                                            </div>
                                            <div className="bg-white bg-opacity-20 p-3 rounded-circle text-black">
                                                <Banknote size={28} className="" />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card className={`border-0 shadow-sm h-100 card-hover gradient-warning text-white ${animatingCards.has('total-returns') ? 'pulse-animation' : ''}`}>
                                    <Card.Body className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h6 className="text-white-50 mb-1">Total Returns</h6>
                                                <h6 className="mb-0 fw-bold">{formatCurrency(totalReturns)}</h6>
                                                <small className="text-white-75">
                                                    <RotateCcw size={12} className="me-1" />
                                                    {analytics.returnRate.toFixed(1)}% Return Rate
                                                </small>
                                            </div>
                                            <div className="bg-white bg-opacity-20 p-3 rounded-circle text-black">
                                                <Package size={28} className="" />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card className={`border-0 shadow-sm h-100 card-hover gradient-info text-white ${animatingCards.has('remaining') ? 'pulse-animation' : ''}`}>
                                    <Card.Body className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h6 className="text-white-50 mb-1">Remaining Balance</h6>
                                                <h6 className={`mb-0 fw-bold ${totalRemaining < 0 ? 'text-danger' : ''}`}>
                                                    {formatCurrency(totalRemaining)}
                                                </h6>
                                                <div className="mt-2">
                                                    <ProgressBar
                                                        now={Math.min(allocationPercentage, 100)}
                                                        variant={allocationPercentage > 100 ? 'danger' : 'light'}
                                                        className="progress-animated"
                                                        style={{ height: '4px' }}
                                                    />
                                                    <small className="text-white-75">
                                                        {allocationPercentage.toFixed(1)}% Complete
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="bg-white bg-opacity-20 p-3 rounded-circle text-black">
                                                <Wallet size={28} className="" />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>



                        {/* Advanced Analytics Row */}
                        <Row className="g-3">
                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="p-3">
                                        <h6 className="mb-3 d-flex align-items-center gap-2">
                                            <BarChart3 size={18} className="text-primary" />
                                            Average Amounts
                                        </h6>
                                        <div className="space-y-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">Purchase Amount</span>
                                                <span className="fw-bold">{formatCurrency(analytics.averagePurchaseAmount)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">Payment Amount</span>
                                                <span className="fw-bold">{formatCurrency(analytics.averagePaymentAmount)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">Return Amount</span>
                                                <span className="fw-bold">{formatCurrency(analytics.averageReturnAmount)}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>


                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="p-3">
                                        <h6 className="mb-3 d-flex align-items-center gap-2">
                                            <Zap size={18} className="text-warning" />
                                            Quick Stats
                                        </h6>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-muted d-flex align-items-center gap-2">
                                                <HandCoins size={14} />
                                                Total Payments
                                            </span>
                                            <Badge bg="primary" className="px-2 py-1">
                                                {purchases.reduce((sum, p) => sum + (p.purchase_managments?.length || 0), 0)}
                                            </Badge>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <span className="text-muted d-flex align-items-center gap-2">
                                                <Undo2 size={14} />
                                                Total Returns
                                            </span>
                                            <Badge bg="warning" className="px-2 py-1">
                                                {purchases.reduce((sum, p) => sum + (p.return_lists?.length || 0), 0)}
                                            </Badge>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* Enhanced Footer with Additional Actions */}
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <small className="text-muted">
                            Last updated: {new Date().toLocaleString()}
                        </small>
                        <Badge bg="light" text="dark" className="d-flex align-items-center gap-1">
                            <Activity size={12} />
                            Live Data
                        </Badge>
                    </div>
                    <div className="d-flex gap-2">
                        <CustomTooltip text="Refresh Data">
                            <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
                                <RefreshCw size={14} />
                            </Button>
                        </CustomTooltip>
                        <CustomTooltip text="Print Report">
                            <Button variant="outline-secondary" size="sm" onClick={() => window.print()}>
                                <Download size={14} />
                            </Button>
                        </CustomTooltip>
                        <CustomTooltip text="Export to Excel">
                            <Button variant="outline-success" size="sm">
                                <FileText size={14} />
                            </Button>
                        </CustomTooltip>
                    </div>
                </div>

                {/* Enhanced Purchases Table */}
                <Card className={`shadow-sm border-0 ${animationClasses.slideInUp}`}>

                    <Card.Header className="bg-white border-0 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                    <ShoppingCart size={20} className="text-primary" />
                                    Purchase List
                                </h5>
                                <Badge  >
                                    {purchases.length} Total
                                </Badge>
                            </div>
                            <div className="d-flex gap-2">

                            </div>
                        </div>
                    </Card.Header>

                    <Table hover bordered responsive size='sm' className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>Bill Proof</th>
                                <th>
                                    <div className="d-flex align-items-center gap-2">
                                        <FileText size={14} />
                                        Purchase Details
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center gap-2">
                                        <Calendar size={14} />
                                        Date
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center gap-2">
                                        <IndianRupee size={14} />
                                        Bill Total
                                    </div>
                                </th>

                                <th>
                                    <div className="d-flex align-items-center gap-2">
                                        <Activity size={14} />
                                        Progress
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchases.map((purchase, index) => {
                                const remaining = getRemainingBudget(purchase);
                                const isExpanded = expandedPurchases.includes(purchase.id);
                                const returns = purchase.return_lists || [];
                                const purchaseProgress = purchase.bill_total > 0 ?
                                    ((parseFloat(purchase.bill_total) - remaining) / parseFloat(purchase.bill_total)) * 100 : 0;

                                return (
                                    <React.Fragment key={purchase.id}>
                                        <tr className={`align-middle`}>
                                            <td>
                                                <Button
                                                    variant="link"
                                                    className="p-0 text-primary"
                                                    onClick={() => setExpandedPurchases(prev =>
                                                        prev.includes(purchase.id)
                                                            ? prev.filter(id => id !== purchase.id)
                                                            : [...prev, purchase.id]
                                                    )}
                                                >
                                                    {isExpanded
                                                        ? <ChevronDown size={16} className="" />
                                                        : <ChevronRight size={16} />
                                                    }
                                                </Button>
                                            </td>
                                            <td>

                                                <div className="position-relative">
                                                    <img
                                                        src={`/storage/${purchase.bill}`}
                                                        alt="Bill Proof"
                                                        className="rounded"
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                    <div
                                                        className="position-absolute top-0 start-0 d-flex align-items-center justify-content-center rounded"
                                                        style={{
                                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s ease',
                                                            height: '50px',
                                                            width: '50px'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.opacity = 1}
                                                        onMouseLeave={(e) => e.target.style.opacity = 0}
                                                    >
                                                        <a
                                                            href={`/storage/${purchase.bill}`}
                                                            download={`bill-${purchase.id}.jpg`}
                                                        >
                                                            <Download size={20} className='text-white' />
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>

                                                <div>
                                                    <span className="fw-bold">{purchase.list_name}</span>
                                                    <br />
                                                    <small className="text-muted">
                                                        ID: #{purchase.id}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>

                                                <div>
                                                    <span className="fw-medium">
                                                        {new Date(purchase.purchase_date).toLocaleDateString()}
                                                    </span>
                                                    <br />
                                                    <small className="text-muted">
                                                        {Math.floor((new Date() - new Date(purchase.purchase_date)) / (1000 * 60 * 60 * 24))} days ago
                                                    </small>
                                                </div>
                                            </td>
                                            <td>

                                                <div>
                                                    <span className="fw-bold text-primary">
                                                        {formatCurrency(purchase.bill_total)}
                                                    </span>
                                                    <br />
                                                    <small className="text-muted">
                                                        Remaining: {formatCurrency(remaining)}
                                                    </small>
                                                    <br />
                                                    <small>
                                                        Total Returns {formatCurrency(
                                                            (purchase.return_lists || []).reduce((sum, r) => sum + parseFloat(r.price || 0), 0)
                                                        )}
                                                    </small>
                                                    <br />
                                                    <small>
                                                        Total Paid  {formatCurrency(
                                                            (purchase.purchase_managments || []).reduce((sum, a) => sum + parseFloat(a.amount || 0), 0)
                                                        )}
                                                    </small>
                                                </div>
                                            </td>

                                            <td>
                                                <div style={{ width: '120px' }}>
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <small className="text-muted">
                                                            {purchaseProgress.toFixed(0)}%
                                                        </small>
                                                        <small className="text-muted">
                                                            {purchase.purchase_managments?.length || 0} payments
                                                        </small>
                                                    </div>
                                                    <ProgressBar
                                                        now={Math.min(purchaseProgress, 100)}
                                                        variant={purchaseProgress > 100 ? 'danger' :
                                                            purchaseProgress === 100 ? 'success' : 'primary'}
                                                        style={{ height: '6px' }}
                                                        className={purchaseProgress > 0 ? 'progress-animated' : ''}
                                                    />
                                                </div>
                                            </td>

                                        </tr>



                                        {/* Expanded Content with Enhanced Animations */}
                                        {
                                            isExpanded && (
                                                <>
                                                    {/* Enhanced Payments Section */}
                                                    <tr className="fade-in">
                                                        <td colSpan={7} className="p-0">
                                                            <div className="p-4">
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                                                        <Banknote size={16} className="text-black" />
                                                                        Payment History
                                                                        <Badge>
                                                                            {purchase.purchase_managments?.length || 0} payments
                                                                        </Badge>
                                                                    </h6>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="success"
                                                                        className="d-flex align-items-center gap-2 bounce-in"
                                                                        onClick={() => {
                                                                            setNewAllocations(prev => ({
                                                                                ...prev,
                                                                                [purchase.id]: {
                                                                                    purchase_list_id: purchase.id,
                                                                                    transaction_date: new Date().toISOString().split('T')[0],
                                                                                    amount: '',
                                                                                    narration: ''
                                                                                }
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <Plus size={12} />
                                                                        Add Payment
                                                                    </Button>
                                                                </div>

                                                                <Card className="border-0 shadow-sm">
                                                                    <Table hover responsive className="mb-0">
                                                                        <thead className="table-success">
                                                                            <tr>
                                                                                <th>
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <Calendar size={14} />
                                                                                        Date
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
                                                                                <th style={{ width: '140px' }}>Actions</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {(purchase.purchase_managments || []).map((allocation, allocIndex) => {
                                                                                const isEditingAllocation = editingAllocationId === allocation.id;

                                                                                return (
                                                                                    <tr key={allocation.id}>
                                                                                        <td>
                                                                                            {isEditingAllocation ? (
                                                                                                <Form.Control
                                                                                                    size="sm"
                                                                                                    type="date"
                                                                                                    value={editedAllocations[allocation.id]?.transaction_date || allocation.transaction_date}
                                                                                                    onChange={e => handleAllocationChange(
                                                                                                        purchase.id,
                                                                                                        allocation.id,
                                                                                                        'transaction_date',
                                                                                                        e.target.value
                                                                                                    )}
                                                                                                    className="fade-in"
                                                                                                />
                                                                                            ) : (
                                                                                                <div>
                                                                                                    <span className="fw-medium">
                                                                                                        {new Date(allocation.transaction_date).toLocaleDateString()}
                                                                                                    </span>
                                                                                                    <br />
                                                                                                    <small className="text-muted">
                                                                                                        Payment #{allocIndex + 1}
                                                                                                    </small>
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            {isEditingAllocation ? (
                                                                                                <Form.Control
                                                                                                    size="sm"
                                                                                                    type="number"
                                                                                                    min="0"
                                                                                                    value={editedAllocations[allocation.id]?.amount || allocation.amount}
                                                                                                    onChange={e => handleAllocationChange(
                                                                                                        purchase.id,
                                                                                                        allocation.id,
                                                                                                        'amount',
                                                                                                        e.target.value
                                                                                                    )}
                                                                                                    className="fade-in"
                                                                                                />
                                                                                            ) : (
                                                                                                <span className="fw-bold text-success">
                                                                                                    {formatCurrency(allocation.amount)}
                                                                                                </span>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            {isEditingAllocation ? (
                                                                                                <Form.Control
                                                                                                    size="sm"
                                                                                                    as="textarea"
                                                                                                    rows={2}
                                                                                                    value={editedAllocations[allocation.id]?.narration || allocation.narration}
                                                                                                    onChange={e => handleAllocationChange(
                                                                                                        purchase.id,
                                                                                                        allocation.id,
                                                                                                        'narration',
                                                                                                        e.target.value
                                                                                                    )}
                                                                                                    className="fade-in"
                                                                                                />
                                                                                            ) : (
                                                                                                <div className="text-truncate" style={{ maxWidth: '250px' }}>
                                                                                                    {allocation.narration || 'No description'}
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            {isEditingAllocation ? (
                                                                                                <div className="d-flex gap-1">
                                                                                                    <CustomTooltip text="Save Payment">
                                                                                                        <Button
                                                                                                            size="sm"
                                                                                                            variant="success"
                                                                                                            onClick={() => saveAllocation(purchase.id, allocation)}
                                                                                                            className="bounce-in"
                                                                                                        >
                                                                                                            <Save size={12} />
                                                                                                        </Button>
                                                                                                    </CustomTooltip>
                                                                                                    <CustomTooltip text="Cancel">
                                                                                                        <Button
                                                                                                            size="sm"
                                                                                                            variant="outline-secondary"
                                                                                                            onClick={() => {
                                                                                                                setEditingAllocationId(null);
                                                                                                                setEditedAllocations(prev => {
                                                                                                                    const newState = { ...prev };
                                                                                                                    delete newState[allocation.id];
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
                                                                                                    <CustomTooltip text="Edit Payment">
                                                                                                        <Button
                                                                                                            variant="link"
                                                                                                            className="p-1 text-success"
                                                                                                            onClick={() => {
                                                                                                                setEditingAllocationId(allocation.id);
                                                                                                                setEditedAllocations(prev => ({
                                                                                                                    ...prev,
                                                                                                                    [allocation.id]: {
                                                                                                                        transaction_date: allocation.transaction_date,
                                                                                                                        amount: allocation.amount,
                                                                                                                        narration: allocation.narration
                                                                                                                    }
                                                                                                                }));
                                                                                                            }}
                                                                                                        >
                                                                                                            <Edit size={14} />
                                                                                                        </Button>
                                                                                                    </CustomTooltip>
                                                                                                    <CustomTooltip text="Delete Payment">
                                                                                                        <Button
                                                                                                            variant="link"
                                                                                                            className="p-1 text-danger"
                                                                                                            onClick={() => deleteAllocation(allocation.id)}
                                                                                                        >
                                                                                                            <Trash2 size={14} />
                                                                                                        </Button>
                                                                                                    </CustomTooltip>
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}

                                                                            {/* New Allocation Row */}
                                                                            {newAllocations[purchase.id] && (
                                                                                <tr className="table-warning bounce-in">
                                                                                    <td>
                                                                                        <Form.Control
                                                                                            size="sm"
                                                                                            type="date"
                                                                                            value={newAllocations[purchase.id]?.transaction_date || ''}
                                                                                            onChange={e => handleNewAllocationChange(
                                                                                                purchase.id,
                                                                                                'transaction_date',
                                                                                                e.target.value
                                                                                            )}
                                                                                            placeholder="Select date"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Form.Control
                                                                                            size="sm"
                                                                                            type="number"
                                                                                            min="0"
                                                                                            max={remaining}
                                                                                            placeholder={`Max: ${formatCurrency(remaining)}`}
                                                                                            value={newAllocations[purchase.id]?.amount || ''}
                                                                                            onChange={e => handleNewAllocationChange(
                                                                                                purchase.id,
                                                                                                'amount',
                                                                                                e.target.value
                                                                                            )}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Form.Control
                                                                                            size="sm"
                                                                                            as="textarea"
                                                                                            rows={2}
                                                                                            placeholder="Payment description..."
                                                                                            value={newAllocations[purchase.id]?.narration || ''}
                                                                                            onChange={e => handleNewAllocationChange(
                                                                                                purchase.id,
                                                                                                'narration',
                                                                                                e.target.value
                                                                                            )}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="d-flex gap-1">
                                                                                            <CustomTooltip text="Save Payment">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="success"
                                                                                                    onClick={() => saveAllocation(purchase.id, newAllocations[purchase.id])}
                                                                                                    disabled={!newAllocations[purchase.id]?.amount || !newAllocations[purchase.id]?.transaction_date}
                                                                                                    className="bounce-in"
                                                                                                >
                                                                                                    <Save size={12} />
                                                                                                </Button>
                                                                                            </CustomTooltip>
                                                                                            <CustomTooltip text="Cancel">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline-secondary"
                                                                                                    onClick={() => setNewAllocations(prev => {
                                                                                                        const copy = { ...prev };
                                                                                                        delete copy[purchase.id];
                                                                                                        return copy;
                                                                                                    })}
                                                                                                >
                                                                                                    <XCircle size={12} />
                                                                                                </Button>
                                                                                            </CustomTooltip>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}

                                                                            {/* Empty State */}
                                                                            {(!purchase.purchase_managments || purchase.purchase_managments.length === 0) && !newAllocations[purchase.id] && (
                                                                                <tr>
                                                                                    <td colSpan={4} className="text-center py-4">
                                                                                        <div className="text-muted">
                                                                                            <HandCoins size={32} className="mb-2 opacity-50" />
                                                                                            <p className="mb-0">No payments recorded yet</p>
                                                                                            <small>Click "Add Payment" to get started</small>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </Table>
                                                                </Card>
                                                            </div>
                                                        </td>
                                                    </tr>



                                                    {/* Enhanced Returns Section */}
                                                    <tr className="fade-in">
                                                        <td colSpan={7} className="p-0">
                                                            <div className="p-4">
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                                                        <RotateCcw size={16} className="text-black" />
                                                                        Return History
                                                                        <Badge bg="warning" className="ms-2">
                                                                            {returns.length} returns
                                                                        </Badge>
                                                                    </h6>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="warning"
                                                                        className="d-flex align-items-center gap-2 bounce-in"
                                                                        onClick={() => {
                                                                            setNewReturns(prev => ({
                                                                                ...prev,
                                                                                [purchase.id]: {
                                                                                    purchase_list_id: purchase.id,
                                                                                    return_date: new Date().toISOString().split('T')[0],
                                                                                    item_name: '',
                                                                                    price: '',
                                                                                    narration: ''
                                                                                }
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <Plus size={12} />
                                                                        Add Return
                                                                    </Button>
                                                                </div>

                                                                <Card className="border-0 shadow-sm">
                                                                    <Table hover responsive className="mb-0">
                                                                        <thead className="table-warning">
                                                                            <tr>
                                                                                <th>
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <Calendar size={14} />
                                                                                        Return Date
                                                                                    </div>
                                                                                </th>
                                                                                <th>
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <Package size={14} />
                                                                                        Item Name
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
                                                                                        <FileText size={14} />
                                                                                        Narration
                                                                                    </div>
                                                                                </th>
                                                                                <th style={{ width: '140px' }}>Actions</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {returns.map((returnItem, returnIndex) => {
                                                                                const isEditingReturn = editingReturnId === returnItem.id;

                                                                                return (
                                                                                    <tr key={returnItem.id} >
                                                                                        <td>
                                                                                            {isEditingReturn ? (
                                                                                                <Form.Control
                                                                                                    size="sm"
                                                                                                    type="date"
                                                                                                    value={editedReturns[returnItem.id]?.return_date || returnItem.return_date}
                                                                                                    onChange={e => handleReturnChange(
                                                                                                        purchase.id,
                                                                                                        returnItem.id,
                                                                                                        'return_date',
                                                                                                        e.target.value
                                                                                                    )}
                                                                                                    className="fade-in"
                                                                                                />
                                                                                            ) : (
                                                                                                <div>
                                                                                                    <span className="fw-medium">
                                                                                                        {new Date(returnItem.return_date).toLocaleDateString()}
                                                                                                    </span>
                                                                                                    <br />
                                                                                                    <small className="text-muted">
                                                                                                        Return #{returnIndex + 1}
                                                                                                    </small>
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            {isEditingReturn ? (
                                                                                                <Form.Control
                                                                                                    size="sm"
                                                                                                    type="text"
                                                                                                    value={editedReturns[returnItem.id]?.item_name || returnItem.item_name}
                                                                                                    onChange={e => handleReturnChange(
                                                                                                        purchase.id,
                                                                                                        returnItem.id,
                                                                                                        'item_name',
                                                                                                        e.target.value
                                                                                                    )}
                                                                                                    className="fade-in"
                                                                                                />
                                                                                            ) : (
                                                                                                <div className="text-truncate fw-medium" style={{ maxWidth: '200px' }}>
                                                                                                    {returnItem.item_name}
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            {isEditingReturn ? (
                                                                                                <Form.Control
                                                                                                    size="sm"
                                                                                                    type="number"
                                                                                                    min="0"
                                                                                                    value={editedReturns[returnItem.id]?.price || returnItem.price}
                                                                                                    onChange={e => handleReturnChange(
                                                                                                        purchase.id,
                                                                                                        returnItem.id,
                                                                                                        'price',
                                                                                                        e.target.value
                                                                                                    )}
                                                                                                    className="fade-in"
                                                                                                />
                                                                                            ) : (
                                                                                                <span className="fw-bold text-warning">
                                                                                                    {formatCurrency(returnItem.price)}
                                                                                                </span>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            {isEditingReturn ? (
                                                                                                <Form.Control
                                                                                                    size="sm"
                                                                                                    as="textarea"
                                                                                                    rows={2}
                                                                                                    value={editedReturns[returnItem.id]?.narration || returnItem.narration}
                                                                                                    onChange={e => handleReturnChange(
                                                                                                        purchase.id,
                                                                                                        returnItem.id,
                                                                                                        'narration',
                                                                                                        e.target.value
                                                                                                    )}
                                                                                                    className="fade-in"
                                                                                                />
                                                                                            ) : (
                                                                                                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                                                                                    {returnItem.narration || 'No description'}
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            {isEditingReturn ? (
                                                                                                <div className="d-flex gap-1">
                                                                                                    <CustomTooltip text="Save Return">
                                                                                                        <Button
                                                                                                            size="sm"
                                                                                                            variant="success"
                                                                                                            onClick={() => saveReturn(purchase.id, returnItem)}
                                                                                                            className="bounce-in"
                                                                                                        >
                                                                                                            <Save size={12} />
                                                                                                        </Button>
                                                                                                    </CustomTooltip>
                                                                                                    <CustomTooltip text="Cancel">
                                                                                                        <Button
                                                                                                            size="sm"
                                                                                                            variant="outline-secondary"
                                                                                                            onClick={() => {
                                                                                                                setEditingReturnId(null);
                                                                                                                setEditedReturns(prev => {
                                                                                                                    const newState = { ...prev };
                                                                                                                    delete newState[returnItem.id];
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
                                                                                                    <CustomTooltip text="Edit Return">
                                                                                                        <Button
                                                                                                            variant="link"
                                                                                                            className="p-1 text-warning"
                                                                                                            onClick={() => {
                                                                                                                setEditingReturnId(returnItem.id);
                                                                                                                setEditedReturns(prev => ({
                                                                                                                    ...prev,
                                                                                                                    [returnItem.id]: {
                                                                                                                        return_date: returnItem.return_date,
                                                                                                                        item_name: returnItem.item_name,
                                                                                                                        price: returnItem.price,
                                                                                                                        narration: returnItem.narration
                                                                                                                    }
                                                                                                                }));
                                                                                                            }}
                                                                                                        >
                                                                                                            <Edit size={14} />
                                                                                                        </Button>
                                                                                                    </CustomTooltip>
                                                                                                    <CustomTooltip text="Delete Return">
                                                                                                        <Button
                                                                                                            variant="link"
                                                                                                            className="p-1 text-danger"
                                                                                                            onClick={() => deleteReturn(returnItem.id)}
                                                                                                        >
                                                                                                            <Trash2 size={14} />
                                                                                                        </Button>
                                                                                                    </CustomTooltip>
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}

                                                                            {/* New Return Row */}
                                                                            {newReturns[purchase.id] && (
                                                                                <tr className="table-warning bounce-in">
                                                                                    <td>
                                                                                        <Form.Control
                                                                                            size="sm"
                                                                                            type="date"
                                                                                            value={newReturns[purchase.id]?.return_date || ''}
                                                                                            onChange={e => handleNewReturnChange(
                                                                                                purchase.id,
                                                                                                'return_date',
                                                                                                e.target.value
                                                                                            )}
                                                                                            placeholder="Select return date"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Form.Control
                                                                                            size="sm"
                                                                                            type="text"
                                                                                            placeholder="Item name..."
                                                                                            value={newReturns[purchase.id]?.item_name || ''}
                                                                                            onChange={e => handleNewReturnChange(
                                                                                                purchase.id,
                                                                                                'item_name',
                                                                                                e.target.value
                                                                                            )}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Form.Control
                                                                                            size="sm"
                                                                                            type="number"
                                                                                            min="0"
                                                                                            placeholder="Return price"
                                                                                            value={newReturns[purchase.id]?.price || ''}
                                                                                            onChange={e => handleNewReturnChange(
                                                                                                purchase.id,
                                                                                                'price',
                                                                                                e.target.value
                                                                                            )}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Form.Control
                                                                                            size="sm"
                                                                                            as="textarea"
                                                                                            rows={2}
                                                                                            placeholder="Return reason..."
                                                                                            value={newReturns[purchase.id]?.narration || ''}
                                                                                            onChange={e => handleNewReturnChange(
                                                                                                purchase.id,
                                                                                                'narration',
                                                                                                e.target.value
                                                                                            )}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="d-flex gap-1">
                                                                                            <CustomTooltip text="Save Return">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="success"
                                                                                                    onClick={() => saveReturn(purchase.id, newReturns[purchase.id])}
                                                                                                    disabled={!newReturns[purchase.id]?.price || !newReturns[purchase.id]?.return_date || !newReturns[purchase.id]?.item_name}
                                                                                                    className="bounce-in"
                                                                                                >
                                                                                                    <Save size={12} />
                                                                                                </Button>
                                                                                            </CustomTooltip>
                                                                                            <CustomTooltip text="Cancel">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline-secondary"
                                                                                                    onClick={() => setNewReturns(prev => {
                                                                                                        const copy = { ...prev };
                                                                                                        delete copy[purchase.id];
                                                                                                        return copy;
                                                                                                    })}
                                                                                                >
                                                                                                    <XCircle size={12} />
                                                                                                </Button>
                                                                                            </CustomTooltip>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}

                                                                            {/* Empty State for Returns */}
                                                                            {returns.length === 0 && !newReturns[purchase.id] && (
                                                                                <tr>
                                                                                    <td colSpan={5} className="text-center py-4">
                                                                                        <div className="text-muted">
                                                                                            <RotateCcw size={32} className="mb-2 opacity-50" />
                                                                                            <p className="mb-0">No returns recorded</p>
                                                                                            <small>Click "Add Return" if any items were returned</small>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </Table>
                                                                </Card>
                                                            </div>
                                                        </td>
                                                    </tr>


                                                </>
                                            )
                                        }
                                    </React.Fragment>
                                );
                            })}

                            {/* Empty State for Purchases */}
                            {purchases.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <div className="text-muted">
                                            <ShoppingCart size={48} className="mb-3 opacity-50" />
                                            <h5 className="mb-2">No Purchase List Found</h5>
                                            <p className="mb-3">Get started by creating your first purchase order</p>
                                            <Button variant="primary" className="d-flex align-items-center gap-2 mx-auto">
                                                <Plus size={16} />
                                                Create Purchase Order
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card>


            </div>
        </AuthenticatedLayout >
    );
};

export default Purchases;




