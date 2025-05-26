import React, { useEffect, useState } from 'react';
import { useForm, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Edit, Trash2, Plus, Calendar, IndianRupeeIcon, Package, User, ChevronDown, ChevronRight, RotateCcw, Check, CheckCircle, Search } from 'lucide-react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PurchasedProduct({ purchaseList }) {

    const [searchTerm, setSearchTerm] = useState('');
    const { delete: destroy } = useForm();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const flash = usePage().props.flash;


    const [state, setState] = useState({
        showAddProduct: false,
        editingProductId: null,
        expandedProducts: {},
        showAddReturn: {},
        editingReturnId: null,
        selectedProducts: {}, // Track selected products for challan creation
        showChallanForm: false, // Show/hide challan creation form
    });

    const challanForm = useForm({
        client_id: purchaseList.client.id,
        purchase_list_id: purchaseList.id,
        service_charge: purchaseList.client.service_charge?.service_charge || 0,
        challan: [],
        challan_number: '',
        challan_date: new Date().toISOString().split('T')[0],
        is_price_visible: true,
    });

    const toggleProductSelection = (productId) => {
        setState(prev => ({
            ...prev,
            selectedProducts: {
                ...prev.selectedProducts,
                [productId]: !prev.selectedProducts[productId]
            }
        }));
    };


    // Handle challan creation
    const handleCreateChallan = (e) => {
        e.preventDefault();

        // Prepare items data from selected products
        const selectedItems = purchaseList.purchased_products
            .filter(product => state.selectedProducts[product.id])
            .map(product => ({
                item_name: product.product_name,
                price: product.price,
                unit_count: calculateRemainingQuantity(product),
                description: product.description,
                is_price_visible: challanForm.data.is_price_visible
            }));

        challanForm.setData('challan', selectedItems);

        challanForm.post(route('challan.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setState(prev => ({
                    ...prev,
                    selectedProducts: {},
                    showChallanForm: false
                }));
                ShowMessage('success', 'Challan created successfully');
            }
        });
    };



    const resetFilters = () => {
        setSearchTerm('');
        setDateRange([null, null]);

        router.get(route('purchase-list.show', {
            purchase_list: purchaseList.id
        }), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('purchase-list.show', {
            purchase_list: purchaseList.id,
            search: searchTerm,
            start_date: startDate ? startDate.toISOString().split('T')[0] : null,
            end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        }), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Calculate totals for purchased products
    const purchasedTotal = purchaseList.purchased_products?.reduce((sum, product) =>
        sum + (parseFloat(product.price || 0) * parseInt(product.unit_count || 0)), 0) || 0;

    // Calculate totals for returns - sum all returns across all products
    const returnedTotal = purchaseList.purchased_products?.reduce((sum, product) => {
        const productReturns = product.return_lists?.reduce((returnSum, returnItem) =>
            returnSum + parseFloat(returnItem.bill_total * returnItem.unit_count || 0), 0) || 0;
        return sum + productReturns;
    }, 0) || 0;

    const netTotal = purchasedTotal - returnedTotal;
    const productCount = purchaseList.purchased_products?.length || 0;

    // Product Form Handlers
    const addProductForm = useForm({
        purchase_list_id: purchaseList.id,
        product_name: '',
        price: '',
        unit_count: '',
        description: '',
    });

    const editProductForm = useForm({
        product_name: '', price: '', unit_count: '', description: '',
    });

    // Return Form Handlers
    const addReturnForm = useForm({
        purchased_product_id: '',
        vendor_name: purchaseList.vendor_name,
        return_date: new Date().toISOString().split('T')[0],
        unit_count: '',
        bill_total: '',
        bill_description: ''
    });

    const editReturnForm = useForm({
        purchased_product_id: '',
        vendor_name: '',
        return_date: '',
        unit_count: '',
        bill_total: '',
        bill_description: ''
    });

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    // Toggle functions
    const toggleAddProduct = () => {
        setState(prev => ({ ...prev, showAddProduct: !prev.showAddProduct, editingProductId: null }));
        addProductForm.reset();
        addProductForm.clearErrors();
    };

    const toggleProductExpansion = (productId) => {
        setState(prev => ({
            ...prev,
            expandedProducts: {
                ...prev.expandedProducts,
                [productId]: !prev.expandedProducts[productId]
            }
        }));
    };

    const toggleAddReturn = (product) => {
        setState(prev => ({
            ...prev,
            showAddReturn: {
                ...prev.showAddReturn,
                [product.id]: !prev.showAddReturn[product.id]
            },
            editingReturnId: null
        }));

        if (!state.showAddReturn[product.id]) {
            addReturnForm.setData({
                purchased_product_id: product.id,
                vendor_name: purchaseList.vendor_name,
                return_date: new Date().toISOString().split('T')[0],
                unit_count: '',
                bill_total: product.price, // Prefill with product price
                bill_description: ''
            });
        } else {
            addReturnForm.reset();
            addReturnForm.clearErrors();
        }
    };

    const startProductEdit = (product) => {
        setState(prev => ({ ...prev, editingProductId: product.id, showAddProduct: false }));
        editProductForm.setData({ ...product });
    };

    const startReturnEdit = (returnItem) => {
        setState(prev => ({
            ...prev,
            editingReturnId: returnItem.id,
            showAddReturn: {}
        }));
        editReturnForm.setData({
            ...returnItem,
            return_date: returnItem.return_date
        });
    };

    // Handle functions
    const handleAddProduct = (e) => {
        e.preventDefault();
        addProductForm.post(route('purchased-product.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toggleAddProduct();
                ShowMessage('success', 'Product created');
            }
        });
    };

    const handleEditProduct = (e) => {
        e.preventDefault();
        editProductForm.put(route('purchased-product.update', state.editingProductId), {
            preserveScroll: true,
            onSuccess: () => {
                setState(prev => ({ ...prev, editingProductId: null }));
                ShowMessage('success', 'Product updated');
            }
        });
    };

    const handleAddReturn = (e) => {
        e.preventDefault();

        const product = purchaseList.purchased_products.find(
            p => p.id === addReturnForm.data.purchased_product_id
        );

        // Calculate already returned quantities and amounts
        const totalReturnedQty = product.return_lists?.reduce(
            (sum, returnItem) => sum + parseInt(returnItem.unit_count || 0), 0) || 0;

        const totalReturnedAmount = product.return_lists?.reduce(
            (sum, returnItem) => sum + parseFloat(returnItem.bill_total || 0), 0) || 0;

        // Validation checks
        const remainingQty = product.unit_count - totalReturnedQty;
        const remainingAmount = calcTotal(product.price, product.unit_count) - totalReturnedAmount;
        const returnQty = parseInt(addReturnForm.data.unit_count || 0);
        const returnAmount = parseFloat(addReturnForm.data.bill_total || 0);

        if (returnQty > remainingQty) {
            ShowMessage('error', `Cannot return more than ${remainingQty} units`);
            return;
        }

        if (returnAmount > remainingAmount) {
            ShowMessage('error', `Cannot return more than ₹${remainingAmount.toLocaleString('en-IN')}`);
            return;
        }

        addReturnForm.post(route('return-list.store'), {
            preserveScroll: true,
            onSuccess: () => {
                const productId = addReturnForm.data.purchased_product_id;
                setState(prev => ({
                    ...prev,
                    showAddReturn: { ...prev.showAddReturn, [productId]: false }
                }));
                ShowMessage('success', 'Return created');
            }
        });
    };


    const handleEditReturn = (e) => {
        e.preventDefault();

        const returnItem = purchaseList.purchased_products
            .flatMap(p => p.return_lists || [])
            .find(r => r.id === state.editingReturnId);

        const product = purchaseList.purchased_products.find(
            p => p.id === returnItem.purchased_product_id
        );

        // Calculate already returned quantities and amounts excluding current return
        const totalReturnedQty = product.return_lists?.reduce(
            (sum, r) => r.id !== returnItem.id ? sum + parseInt(r.unit_count || 0) : sum, 0) || 0;

        const totalReturnedAmount = product.return_lists?.reduce(
            (sum, r) => r.id !== returnItem.id ? sum + parseFloat(r.bill_total || 0) : sum, 0) || 0;

        // Validation checks
        const remainingQty = product.unit_count - totalReturnedQty;
        const remainingAmount = calcTotal(product.price, product.unit_count) - totalReturnedAmount;
        const returnQty = parseInt(editReturnForm.data.unit_count || 0);
        const returnAmount = parseFloat(editReturnForm.data.bill_total || 0);

        if (returnQty > remainingQty) {
            ShowMessage('error', `Cannot return more than ${remainingQty} units`);
            return;
        }

        if (returnAmount > remainingAmount) {
            ShowMessage('error', `Cannot return more than ₹${remainingAmount.toLocaleString('en-IN')}`);
            return;
        }

        editReturnForm.put(route('return-list.update', state.editingReturnId), {
            preserveScroll: true,
            onSuccess: () => {
                setState(prev => ({ ...prev, editingReturnId: null }));
                ShowMessage('success', 'Return updated');
            }
        });
    };

    const deleteProduct = (id) => {
        destroy(route('purchased-product.destroy', id), { preserveScroll: true });
    };

    const deleteReturn = (id) => {
        destroy(route('return-list.destroy', id), { preserveScroll: true });
    };

    const calcTotal = (price, count) => (parseFloat(price || 0) * parseInt(count || 0));

    // Update calculateRemainingAmount to include quantity check
    const calculateRemainingAmount = (product) => {

        console.log('Calculating remaining amount for product:', product);

        const productTotal = calcTotal(product.price, product.unit_count);
        const returnsTotal = product.return_lists?.reduce(
            (sum, returnItem) => sum + parseFloat(returnItem.bill_total * returnItem.unit_count || 0), 0) || 0;
        return productTotal - returnsTotal;
    };

    const calculateRemainingQuantity = (product) => {
        const returnsQty = product.return_lists?.reduce(
            (sum, returnItem) => sum + parseInt(returnItem.unit_count || 0), 0) || 0;
        return product.unit_count - returnsQty;
    };

    return (
        <AuthenticatedLayout>
            <Link href={route('clients.show', purchaseList.client_id)} className="btn btn-sm btn-secondary mb-3" >
                Back
            </Link >

            {/* Stats Cards */}
            <div className="row g-4 mb-4">


                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card border-0 shadow-sm card-hover h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="stats-icon bg-blue-light me-3">
                                    <IndianRupeeIcon className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="small text-slate-600 mb-1">Purchased Total</p>
                                    <h6 className="fw-bold text-slate-800 mb-0">₹{purchasedTotal.toLocaleString('en-IN')}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card border-0 shadow-sm card-hover h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="stats-icon bg-red-light me-3">
                                    <IndianRupeeIcon className="text-red-600" />
                                </div>
                                <div>
                                    <p className="small text-slate-600 mb-1">Returned Total</p>
                                    <h6 className="fw-bold text-slate-800 mb-0">₹{returnedTotal.toLocaleString('en-IN')}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-4 col-lg-2">
                    <div className="card border-0 shadow-sm card-hover h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="stats-icon bg-green-light me-3">
                                    <IndianRupeeIcon className="text-green-600" />
                                </div>
                                <div>
                                    <p className="small text-slate-600 mb-1">Net Total</p>
                                    <h6 className="fw-bold text-slate-800 mb-0">₹{netTotal.toLocaleString('en-IN')}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-4 col-lg-2">
                    <div className="card border-0 shadow-sm card-hover h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="stats-icon bg-green-light me-3">
                                    <Package className="text-green-600" />
                                </div>
                                <div>
                                    <p className="small text-slate-600 mb-1">Products</p>
                                    <h6 className="fw-bold text-slate-800 mb-0">{productCount}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-4 col-lg-2">
                    <div className="card border-0 shadow-sm card-hover h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="stats-icon bg-purple-light me-3">
                                    <User className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="small text-slate-600 mb-1">Vendor</p>
                                    <h6 className="fw-semibold text-slate-800 mb-0">{purchaseList.vendor_name}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Products Section with Nested Returns */}
            <Card className="mb-4 mt-4 ">


                <Card.Header className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 me-3">Purchase Management</h5>

                    <div className="d-flex align-items-center gap-2">


                        <Form onSubmit={handleSearch}>
                            <InputGroup >
                                <Form.Control
                                    size='sm'
                                    type="text"
                                    placeholder="Press Enter To Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => setDateRange(update)}
                                    isClearable={true}
                                    placeholderText="Date range"
                                    className="form-control form-control-sm"
                                    dateFormat="yyyy-MM-dd"
                                />
                                <Button
                                    type="submit"
                                    size='sm'
                                    variant="outline-secondary"
                                >
                                    <Search size={14} /> {/* Import Search icon from lucide-react */}
                                </Button>
                                <Button
                                    size='sm'
                                    variant="outline-danger"
                                    onClick={resetFilters}
                                    disabled={!searchTerm && !startDate && !endDate}
                                >
                                    <RotateCcw size={14} /> {/* Import RotateCcw icon from lucide-react */}
                                </Button>
                            </InputGroup>
                        </Form>


                        <Button size="sm" onClick={toggleAddProduct} variant={state.showAddProduct ? "secondary" : "primary"}>
                            {state.showAddProduct ? "Cancel" : <><Plus size={14} className="me-1" />Add Product</>}
                        </Button>

                        {Object.values(state.selectedProducts).filter(Boolean).length > 0 && (
                            <Button
                                size="sm"
                                variant="success"
                                onClick={() => setState(prev => ({ ...prev, showChallanForm: true }))}
                            >
                                <CheckCircle size={14} className="me-1" />
                                Create Challan ({Object.values(state.selectedProducts).filter(Boolean).length})
                            </Button>
                        )}
                    </div>

                </Card.Header>


                {/* Challan Creation Form */}
                {state.showChallanForm && (
                    <Card.Body className="bg-light">
                        <Form onSubmit={handleCreateChallan}>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Challan Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={challanForm.data.challan_number}
                                            onChange={e => challanForm.setData('challan_number', e.target.value)}
                                            placeholder="Auto-generated if empty"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Service Charge</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>₹</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                value={challanForm.data.service_charge}
                                                onChange={e => challanForm.setData('service_charge', e.target.value)}
                                                min="0"
                                                step="0.01"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Challan Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={challanForm.data.challan_date}
                                            onChange={e => challanForm.setData('challan_date', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12} className="d-flex justify-content-end">
                                    <Button
                                        variant="secondary"
                                        className="me-2"
                                        onClick={() => setState(prev => ({ ...prev, showChallanForm: false }))}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={challanForm.processing}>
                                        {challanForm.processing ? 'Creating...' : 'Create Challan'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                )}

                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table bordered hover className="mb-0">
                            <thead>
                                <tr>
                                    <th width="20"></th>
                                    <th width="100"></th>
                                    <th>Product Name</th>
                                    <th>Unit Price (₹)</th>
                                    <th>Quantity</th>
                                    <th>Total (₹)</th>
                                    <th>Remaining (₹)</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Add Product Row */}
                                {state.showAddProduct && (
                                    <tr className="table-success">
                                        <td></td>
                                        <td></td>

                                        <td>
                                            <Form.Control
                                                size="sm"
                                                value={addProductForm.data.product_name}
                                                onChange={e => addProductForm.setData('product_name', e.target.value)}
                                                placeholder="Product name"
                                            />
                                        </td>
                                        <td>
                                            <InputGroup size="sm">
                                                <InputGroup.Text>₹</InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    value={addProductForm.data.price}
                                                    onChange={e => addProductForm.setData('price', e.target.value)}
                                                    placeholder="Price"
                                                />
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                value={addProductForm.data.unit_count}
                                                onChange={e => addProductForm.setData('unit_count', e.target.value)}
                                                placeholder="Quantity"
                                            />
                                        </td>
                                        <td className="fw-bold">
                                            ₹{calcTotal(addProductForm.data.price, addProductForm.data.unit_count).toLocaleString('en-IN')}
                                        </td>
                                        <td></td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                as="textarea"
                                                rows={1}
                                                value={addProductForm.data.description}
                                                onChange={e => addProductForm.setData('description', e.target.value)}
                                                placeholder="Description"
                                            />
                                        </td>
                                        <td className="text-nowrap">
                                            <Button size="sm" variant="success" onClick={handleAddProduct}>
                                                <Plus size={12} className="me-1" /> Add
                                            </Button>
                                        </td>
                                    </tr>
                                )}

                                {/* Product Rows */}
                                {purchaseList.purchased_products?.map(product => {


                                    return (
                                        <React.Fragment key={product.id}>
                                            {/* Main Product Row */}
                                            <tr className={state.editingProductId === product.id ? "table-warning" : ""}>
                                                <td>
                                                    <Button
                                                        variant="link"
                                                        className="p-0"
                                                        onClick={() => toggleProductSelection(product.id)}
                                                        title="Select for challan"
                                                    >
                                                        <Check
                                                            size={18}
                                                            className={state.selectedProducts[product.id] ? "text-danger" : "text-black"}
                                                        />
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0"
                                                        onClick={() => toggleProductExpansion(product.id)}
                                                    >
                                                        {state.expandedProducts[product.id] ?
                                                            <ChevronDown size={16} /> :
                                                            <ChevronRight size={16} />
                                                        }
                                                    </Button>
                                                    {product.return_lists?.length > 0 && (
                                                        <Badge bg="info" className="ms-1">{product.return_lists.length}</Badge>
                                                    )}
                                                </td>

                                                {state.editingProductId === product.id ? (
                                                    <>
                                                        <td>
                                                            <Form.Control
                                                                size="sm"
                                                                value={editProductForm.data.product_name}
                                                                onChange={e => editProductForm.setData('product_name', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <InputGroup size="sm">
                                                                <InputGroup.Text>₹</InputGroup.Text>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editProductForm.data.price}
                                                                    onChange={e => editProductForm.setData('price', e.target.value)}
                                                                />
                                                            </InputGroup>
                                                        </td>
                                                        <td>
                                                            <Form.Control
                                                                size="sm"
                                                                type="number"
                                                                value={editProductForm.data.unit_count}
                                                                onChange={e => editProductForm.setData('unit_count', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="fw-bold">
                                                            ₹{calcTotal(editProductForm.data.price, editProductForm.data.unit_count).toLocaleString('en-IN')}
                                                        </td>
                                                        <td></td>
                                                        <td>
                                                            <Form.Control
                                                                size="sm"
                                                                as="textarea"
                                                                rows={1}
                                                                value={editProductForm.data.description}
                                                                onChange={e => editProductForm.setData('description', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="text-nowrap">
                                                            <Button size="sm" variant="success" onClick={handleEditProduct} className="me-1">
                                                                <Edit size={10} />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => setState(prev => ({ ...prev, editingProductId: null }))}
                                                            >
                                                                ×
                                                            </Button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="fw-semibold">{product.product_name}</td>
                                                        <td>₹{parseFloat(product.price).toLocaleString('en-IN')}</td>
                                                        <td>{product.unit_count}</td>
                                                        <td className="fw-bold">₹{calcTotal(product.price, product.unit_count)}</td>
                                                        <td className={`fw-bold ${calculateRemainingAmount(product) < 0 ? 'text-danger' : 'text-success'}`}>
                                                            ₹{calculateRemainingAmount(product)}
                                                        </td>
                                                        <td className="text-truncate" style={{ maxWidth: '200px' }} title={product.description}>
                                                            {product.description}
                                                        </td>
                                                        <td className="text-nowrap">
                                                            <Button size="sm" variant="info" onClick={() => startProductEdit(product)} className="me-1">
                                                                <Edit size={10} />
                                                            </Button>
                                                            <Button size="sm" variant="danger" onClick={() => deleteProduct(product.id)}>
                                                                <Trash2 size={10} />
                                                            </Button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>

                                            {/* Returns Section for Each Product */}
                                            <tr>
                                                <td colSpan={8} className="p-0">
                                                    <Collapse in={state.expandedProducts[product.id]}>
                                                        <div>
                                                            <div className="p-3">
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <h6 className="mb-0 text-muted">
                                                                        <RotateCcw size={16} className="me-2" />
                                                                        Returns for {product.product_name}
                                                                    </h6>
                                                                    <Button
                                                                        size="sm"
                                                                        variant={state.showAddReturn[product.id] ? "secondary" : "outline-primary"}
                                                                        onClick={() => toggleAddReturn(product)}
                                                                    >
                                                                        {state.showAddReturn[product.id] ? "Cancel" : <><Plus size={12} className="me-1" />Add Return</>}
                                                                    </Button>
                                                                </div>

                                                                <Table size="sm" className="mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Vendor</th>
                                                                            <th>Return Date</th>
                                                                            <th>Quantity</th>
                                                                            <th>Amount (₹)</th>
                                                                            <th>Description</th>
                                                                            <th>Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {/* Add Return Row */}
                                                                        {state.showAddReturn[product.id] && (
                                                                            <tr>
                                                                                <td>
                                                                                    <Form.Control
                                                                                        size="sm"
                                                                                        value={addReturnForm.data.vendor_name}
                                                                                        onChange={e => addReturnForm.setData('vendor_name', e.target.value)}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Form.Control
                                                                                        type="date"
                                                                                        size="sm"
                                                                                        value={addReturnForm.data.return_date}
                                                                                        onChange={e => addReturnForm.setData('return_date', e.target.value)}
                                                                                    />
                                                                                </td>

                                                                                <td>
                                                                                    <Form.Control
                                                                                        type="number"
                                                                                        size="sm"
                                                                                        value={addReturnForm.data.unit_count}
                                                                                        onChange={e => addReturnForm.setData('unit_count', e.target.value)}
                                                                                        placeholder="Qty"
                                                                                        max={product.unit_count - (product.return_lists?.reduce(
                                                                                            (sum, r) => sum + parseInt(r.unit_count || 0), 0) || 0)}
                                                                                        min={1}
                                                                                        isInvalid={addReturnForm.errors.unit_count}
                                                                                    />
                                                                                    <Form.Control.Feedback type="invalid">
                                                                                        {addReturnForm.errors.unit_count}
                                                                                    </Form.Control.Feedback>
                                                                                </td>
                                                                                <td>
                                                                                    <InputGroup size="sm">
                                                                                        <InputGroup.Text>₹</InputGroup.Text>
                                                                                        <Form.Control
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={addReturnForm.data.bill_total}
                                                                                            onChange={e => addReturnForm.setData('bill_total', e.target.value)}
                                                                                            placeholder="Amount"
                                                                                            max={calculateRemainingAmount(product)}
                                                                                            isInvalid={addReturnForm.errors.bill_total}
                                                                                        />
                                                                                    </InputGroup>
                                                                                    <Form.Control.Feedback type="invalid">
                                                                                        {addReturnForm.errors.bill_total}
                                                                                    </Form.Control.Feedback>
                                                                                </td>

                                                                                <td>
                                                                                    <Form.Control
                                                                                        size="sm"
                                                                                        value={addReturnForm.data.bill_description}
                                                                                        onChange={e => addReturnForm.setData('bill_description', e.target.value)}
                                                                                        placeholder="Description"
                                                                                    />
                                                                                </td>
                                                                                <td className="text-nowrap">
                                                                                    <Button size="sm" variant="success" onClick={handleAddReturn}>
                                                                                        <Plus size={10} className="me-1" /> Add
                                                                                    </Button>
                                                                                </td>
                                                                            </tr>
                                                                        )}

                                                                        {/* Return Rows */}
                                                                        {product.return_lists?.map(returnItem => (
                                                                            <tr key={returnItem.id} className={state.editingReturnId === returnItem.id ? "table-warning" : ""}>
                                                                                {state.editingReturnId === returnItem.id ? (
                                                                                    <>
                                                                                        <td>
                                                                                            <Form.Control
                                                                                                size="sm"
                                                                                                value={editReturnForm.data.vendor_name}
                                                                                                onChange={e => editReturnForm.setData('vendor_name', e.target.value)}
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Form.Control
                                                                                                type="date"
                                                                                                size="sm"
                                                                                                value={editReturnForm.data.return_date}
                                                                                                onChange={e => editReturnForm.setData('return_date', e.target.value)}
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Form.Control
                                                                                                type="number"
                                                                                                size="sm"
                                                                                                value={editReturnForm.data.unit_count}
                                                                                                onChange={e => editReturnForm.setData('unit_count', e.target.value)}
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <InputGroup size="sm">
                                                                                                <InputGroup.Text>₹</InputGroup.Text>
                                                                                                <Form.Control
                                                                                                    type="number"
                                                                                                    step="0.01"
                                                                                                    value={editReturnForm.data.bill_total}
                                                                                                    onChange={e => editReturnForm.setData('bill_total', e.target.value)}
                                                                                                />
                                                                                            </InputGroup>
                                                                                        </td>
                                                                                        <td>
                                                                                            <Form.Control
                                                                                                size="sm"
                                                                                                value={editReturnForm.data.bill_description}
                                                                                                onChange={e => editReturnForm.setData('bill_description', e.target.value)}
                                                                                            />
                                                                                        </td>
                                                                                        <td className="text-nowrap">
                                                                                            <Button size="sm" variant="success" onClick={handleEditReturn} className="me-1">
                                                                                                <Edit size={10} />
                                                                                            </Button>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="secondary"
                                                                                                onClick={() => setState(prev => ({ ...prev, editingReturnId: null }))}
                                                                                            >
                                                                                                ×
                                                                                            </Button>
                                                                                        </td>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <td>{returnItem.vendor_name}</td>
                                                                                        <td>{returnItem.return_date}</td>
                                                                                        <td>{returnItem.unit_count}</td>
                                                                                        <td className="fw-bold">₹{parseFloat(returnItem.bill_total * returnItem.unit_count || 0).toLocaleString('en-IN')}</td>
                                                                                        <td className="text-truncate" style={{ maxWidth: '150px' }} title={returnItem.bill_description}>
                                                                                            {returnItem.bill_description}
                                                                                        </td>
                                                                                        <td className="text-nowrap">
                                                                                            <Button size="sm" variant="info" onClick={() => startReturnEdit(returnItem)} className="me-1">
                                                                                                <Edit size={10} />
                                                                                            </Button>
                                                                                            <Button size="sm" variant="danger" onClick={() => deleteReturn(returnItem.id)}>
                                                                                                <Trash2 size={10} />
                                                                                            </Button>
                                                                                        </td>
                                                                                    </>
                                                                                )}
                                                                            </tr>
                                                                        ))}

                                                                        {/* Return Total Row */}
                                                                        {product.return_lists?.length > 0 && (
                                                                            <tr className="table-secondary">
                                                                                <td colSpan={3} className="text-end fw-bold">Returns Total:</td>
                                                                                <td className="fw-bold">
                                                                                    ₹{(product.return_lists?.reduce((sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0)}
                                                                                </td>
                                                                                <td colSpan={2}></td>
                                                                            </tr>
                                                                        )}

                                                                        {/* No Returns Message */}
                                                                        {(!product.return_lists || product.return_lists.length === 0) && !state.showAddReturn[product.id] && (
                                                                            <tr>
                                                                                <td colSpan={6} className="text-center text-muted py-3">
                                                                                    <em>No returns recorded for this product</em>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>

                        </Table>
                    </div>
                </Card.Body>
            </Card>




            <style jsx>{`
              
                .stats-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .bg-blue-light { background-color: #dbeafe; }
                .bg-red-light { background-color: #fee2e2; }
                .bg-green-light { background-color: #dcfce7; }
                .bg-purple-light { background-color: #f3e8ff; }
                
                .text-blue-600 { color: #2563eb; }
                .text-red-600 { color: #dc2626; }
                .text-green-600 { color: #16a34a; }
                .text-purple-600 { color: #9333ea; }
                
                .text-slate-600 { color: #475569; }
                .text-slate-800 { color: #1e293b; }
                
                .card-hover {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
                
                .card-hover:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
                }
                
                .table th {
                    background-color: #f8fafc;
                    border-color: #e2e8f0;
                    font-weight: 600;
                    color: #334155;
                }
                
                .table td {
                    vertical-align: middle;
                    border-color: #e2e8f0;
                }
                
                .table-success {
                    background-color: #f0fdf4 !important;
                }
                
                .table-warning {
                    background-color: #fffbeb !important;
                }
                
                .btn-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                }
                
                .form-control-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                }
                
                .text-truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>
        </AuthenticatedLayout >
    );
}
















