import React, { useState } from 'react';
import {
    Edit, Trash2, Plus, ChevronDown, ChevronRight,
    ShoppingCart, Package, RotateCcw, IndianRupee, Calendar,
    FileText, Activity, BarChart3, XCircle, Eye, EyeOff,
    Download, Percent, Receipt, Zap, Banknote, TrendingUp,
    Wallet,
    Undo2,
    Save
} from 'lucide-react';
import { Card, Table, Form, Button, Badge, ProgressBar, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import { Link, router } from '@inertiajs/react';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import Swal from 'sweetalert2';

const Purchases = ({ vendor, purchaseLists, Client, purchaseListPayments }) => {

    const client = Client || {};
    const purchases = purchaseLists.data || [];

    // State management
    const [expandedPurchases, setExpandedPurchases] = useState([]);
    const [editingReturnId, setEditingReturnId] = useState(null);
    const [editedReturns, setEditedReturns] = useState({});
    const [newReturns, setNewReturns] = useState({});
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [animatingCards, setAnimatingCards] = useState(new Set());

    const totalPurchases = purchases.reduce((sum, p) => sum + parseFloat(p.bill_total || 0), 0);
    const totalReturns = purchases.reduce((sum, p) =>
        sum + (p.return_lists || []).reduce((rSum, r) => rSum + parseFloat(r.price || 0), 0), 0);

    // Calculate payment totals
    const totalPayments = purchaseListPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const payableAmount = totalPurchases - totalReturns;
    const remainingBalance = payableAmount - totalPayments;

    const paymentProgress = payableAmount > 0 ?
        (totalPayments / payableAmount) * 100 :
        payableAmount === 0 ? 100 : 0;

    const getRemainingBudget = (purchase) => {
        const returned = (purchase.return_lists || []).reduce((sum, r) => sum + parseFloat(r.price || 0), 0);
        return parseFloat(purchase.bill_total || 0) - returned;
    };

    const analytics = {
        totalPurchases,
        totalReturns,
        totalPayments,
        remainingBalance,
        paymentProgress,
        averagePurchaseAmount: purchases.length > 0 ? totalPurchases / purchases.length : 0,
        averageReturnAmount: purchases.reduce((sum, p) => sum + (p.return_lists?.length || 0), 0) > 0
            ? totalReturns / purchases.reduce((sum, p) => sum + (p.return_lists?.length || 0), 0) : 0,
        completedPurchases: purchases.filter(p => getRemainingBudget(p) <= 0).length,
        pendingPurchases: purchases.filter(p => getRemainingBudget(p) > 0).length,
        overPaidPurchases: purchases.filter(p => getRemainingBudget(p) < 0).length,
        returnRate: totalPurchases > 0 ? (totalReturns / totalPurchases) * 100 : 0,
        paymentRate: payableAmount > 0 ? paymentProgress : 0,
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

    const handleReturnChange = (purchaseId, returnId, field, value) => {
        setEditedReturns(prev => ({
            ...prev,
            [returnId]: {
                ...(prev[returnId] || {}),
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
                client_id: client.id,
                vendor_id: vendor.id,
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





    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount).replace('₹', '₹ ');
    };

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


    const [expandedPayments, setExpandedPayments] = useState([]);
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [editedPayments, setEditedPayments] = useState({});
    const [newPayment, setNewPayment] = useState(null);

    // Calculate payment totals

    // Payment handlers
    const handlePaymentChange = (paymentId, field, value) => {
        setEditedPayments(prev => ({
            ...prev,
            [paymentId]: {
                ...(prev[paymentId] || {}),
                [field]: value
            }
        }));
    };

    const handleNewPaymentChange = (field, value) => {
        setNewPayment(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const savePayment = async (payment) => {
        try {
            const paymentToSave = payment.id
                ? {
                    ...purchaseListPayments.find(p => p.id === payment.id),
                    ...editedPayments[payment.id]
                }
                : payment;

            const formData = {
                client_id: client.id,
                vendor_id: vendor.id,
                amount: paymentToSave.amount,
                transaction_date: paymentToSave.transaction_date,
                narration: paymentToSave.narration,
                // Add other payment fields as needed
            };

            if (paymentToSave.id) {
                await router.put(route('purchase-list-payments.update', paymentToSave.id), formData, {
                    onSuccess: () => {
                        ShowMessage('success', 'Payment updated successfully');
                        setEditingPaymentId(null);
                        setEditedPayments(prev => {
                            const newState = { ...prev };
                            delete newState[paymentToSave.id];
                            return newState;
                        });
                    },
                    onError: (errors) => {
                        ShowMessage('error', 'Failed to update payment');
                        console.error(errors);
                    }
                });
            } else {
                await router.post(route('purchase-list-payments.store'), formData, {
                    onSuccess: () => {
                        ShowMessage('success', 'Payment created successfully');
                        setNewPayment(null);
                    },
                    onError: (errors) => {
                        ShowMessage('error', 'Failed to create payment');
                        console.error(errors);
                    }
                });
            }
        } catch (error) {
            ShowMessage('error', 'An unexpected error occurred');
            console.error(error);
        }
    };



    return (
        <AuthenticatedLayout>
            <div>
                <BreadCrumbHeader breadcrumbs={breadcrumbs} />

                {/* Enhanced Header with Analytics Toggle */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <h6 className="mb-0 fw-bold d-flex  align-items-center">
                            <ShoppingCart size={20} className="me-2 text-primary" />
                            Purchase List
                        </h6>
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
                                className="d-flex align-items-center gap-2 btn-sm"
                            >
                                {showAnalytics ? <EyeOff size={10} /> : <Eye size={10} />}
                                Analytics
                            </Button>
                        </CustomTooltip>
                        <Button
                            variant="success"
                            size="sm"
                            className="d-flex align-items-center gap-2"
                            onClick={() => {
                                setNewPayment({
                                    client_id: client.id,
                                    vendor_id: vendor.id,
                                    amount: '',
                                    transaction_date: new Date().toISOString().split('T')[0],
                                    narration: '',
                                    // Add other default fields as needed
                                });
                            }}
                        >
                            <Plus size={14} />
                            Add Payment
                        </Button>
                    </div>

                </div>

                {showAnalytics && (
                    <>
                        {showAnalytics && (
                            <div className={`mb-4 ${animationClasses.fadeIn}`}>
                                {/* Primary Metrics */}
                                <Row className="g-3 mb-3">
                                    <Col md={3}>
                                        <Card className={`border-0 shadow-sm h-100 card-hover gradient-bg  ${animatingCards.has('total-bill') ? 'pulse-animation' : ''}`}>
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h6 className="-50 mb-1">Total Bill Amount</h6>
                                                        <h6 className="mb-0 fw-bold">{formatCurrency(analytics.totalPurchases)}</h6>
                                                        <small className="-75">
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
                                        <Card className={`border-0 shadow-sm h-100 card-hover gradient-warning  ${animatingCards.has('total-returns') ? 'pulse-animation' : ''}`}>
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h6 className="-50 mb-1">Total Returns</h6>
                                                        <h6 className="mb-0 fw-bold">{formatCurrency(analytics.totalReturns)}</h6>
                                                        <small className="-75">
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
                                        <Card className={`border-0 shadow-sm h-100 card-hover gradient-success  ${animatingCards.has('total-payments') ? 'pulse-animation' : ''}`}>
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h6 className="-50 mb-1">Total Payments</h6>
                                                        <h6 className="mb-0 fw-bold">{formatCurrency(analytics.totalPayments)}</h6>
                                                        <small className="-75">
                                                            <Banknote size={12} className="me-1" />
                                                            {purchaseListPayments.length} payments
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
                                        <Card className={`border-0 shadow-sm h-100 card-hover gradient-info  ${animatingCards.has('remaining') ? 'pulse-animation' : ''}`}>
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h6 className="-50 mb-1">Remaining Balance</h6>
                                                        <h6 className={`mb-0 fw-bold ${analytics.remainingBalance < 0 ? 'text-danger' : ''}`}>
                                                            {formatCurrency(analytics.remainingBalance)}
                                                        </h6>
                                                        <div className="mt-2">
                                                            <ProgressBar
                                                                now={Math.min(analytics.paymentProgress, 100)}
                                                                variant={analytics.paymentProgress > 100 ? 'danger' : 'success'}
                                                                className="progress-animated"
                                                                style={{ height: '4px' }}
                                                            />
                                                            <small className="-75">
                                                                {analytics.paymentProgress.toFixed(1)}% Paid
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
                            </div>
                        )}
                    </>


                )}


                {/* Enhanced Purchases Table */}
                <div className={`border-0 ${animationClasses.slideInUp} mb-5`}>
                    <h5>Purchase Section</h5>
                    <Table hover bordered responsive size='sm' className="mb-0 mt-2">
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
                                                    {
                                                        purchase.bill ? <img
                                                            src={`/storage/${purchase.bill}`}
                                                            alt="Bill Proof"
                                                            className="rounded"
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                        />
                                                        : 'NA'
                                                    }

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
                                                            <Download size={20} className='' />
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
                                                            returns.reduce((sum, r) => sum + parseFloat(r.price || 0), 0)
                                                        )}
                                                    </small>
                                                </div>
                                            </td>


                                        </tr>

                                        {isExpanded && (
                                            <tr className="fade-in">
                                                <td colSpan={7} className="p-0">
                                                    <div className="p-4">
                                                        {/* Enhanced Returns Section */}
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
                                        )}
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
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <div className="card-footer mt-2 d-flex justify-content-end align-items-center">
                        <ul className="pagination justify-content-center">
                            {purchaseLists.links.map((link, index) => {
                                if (link.label === 'Previous' || link.label === 'Next') return null;
                                return (
                                    <li
                                        key={index}
                                        className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                    >
                                        <Link
                                            className="page-link"
                                            href={link.url || '#'}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Payments Table Section */}
                <div className="mt-5">
                    <h5>Purchase Section</h5>


                    <Card className="border-0 shadow-sm mt-2">
                        <Table hover responsive className="mb-0">
                            <thead className="table-success">
                                <tr>
                                    <th>#</th>
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
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseListPayments.map((payment, index) => {
                                    const isEditing = editingPaymentId === payment.id;

                                    return (
                                        <tr key={payment.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {isEditing ? (
                                                    <Form.Control
                                                        size="sm"
                                                        type="date"
                                                        value={editedPayments[payment.id]?.transaction_date || payment.transaction_date}
                                                        onChange={(e) => handlePaymentChange(payment.id, 'transaction_date', e.target.value)}
                                                    />
                                                ) : (
                                                    new Date(payment.transaction_date).toLocaleDateString()
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <Form.Control
                                                        size="sm"
                                                        type="number"
                                                        value={editedPayments[payment.id]?.amount || payment.amount}
                                                        onChange={(e) => handlePaymentChange(payment.id, 'amount', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="fw-bold text-success">
                                                        {formatCurrency(payment.amount)}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <Form.Control
                                                        size="sm"
                                                        as="textarea"
                                                        rows={2}
                                                        value={editedPayments[payment.id]?.narration || payment.narration}
                                                        onChange={(e) => handlePaymentChange(payment.id, 'narration', e.target.value)}
                                                    />
                                                ) : (
                                                    payment.narration || 'No description'
                                                )}
                                            </td>
                                            <td>
                                                {new Date(payment.created_at).toLocaleString()}
                                            </td>

                                        </tr>
                                    );
                                })}

                                {/* New Payment Row */}
                                {newPayment && (
                                    <tr className="table-success">
                                        <td>#</td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                type="date"
                                                value={newPayment.transaction_date || ''}
                                                onChange={(e) => handleNewPaymentChange('transaction_date', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                value={newPayment.amount || ''}
                                                onChange={(e) => handleNewPaymentChange('amount', e.target.value)}
                                                placeholder="Amount"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                as="textarea"
                                                rows={2}
                                                value={newPayment.narration || ''}
                                                onChange={(e) => handleNewPaymentChange('narration', e.target.value)}
                                                placeholder="Payment description..."
                                            />
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => savePayment(newPayment)}
                                                    disabled={!newPayment.amount || !newPayment.transaction_date}
                                                >
                                                    <Save size={14} />
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => setNewPayment(null)}
                                                >
                                                    <XCircle size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {purchaseListPayments.length === 0 && !newPayment && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">
                                            <div className="text-muted">
                                                <Banknote size={32} className="mb-2 opacity-50" />
                                                <p className="mb-0">No payments recorded</p>
                                                <small>Click "Add Payment" to record a new payment</small>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>


                </div>





            </div>

        </AuthenticatedLayout >
    );
};

export default Purchases;