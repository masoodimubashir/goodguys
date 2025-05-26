import React, { useState } from 'react';
import { Table, Button, Form, InputGroup, Collapse, Badge } from 'react-bootstrap';
import { Edit, Trash2, Plus, RotateCcw, Check, X, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const EditChallan = ({ purchaseData: initialChallan }) => {


    // Initialize Inertia form
    const { data, setData, put, processing, errors } = useForm({
        ...initialChallan,
        purchase_list: {
            ...initialChallan?.purchase_list,
            purchased_products: initialChallan?.purchase_list?.purchased_products.map(product => ({
                ...product,
                return_lists: product.return_lists || []
            }))
        }
    });

    // UI state management
    const [state, setState] = useState({
        expandedProducts: {},
        showAddReturn: {},
        editingReturnId: null,
        editingProductId: null
    });

    // Form states
    const [forms, setForms] = useState({
        addReturn: {
            vendor_name: '',
            return_date: new Date().toISOString().split('T')[0],
            unit_count: '',
            bill_total: '',
            bill_description: ''
        },
        editReturn: {
            vendor_name: '',
            return_date: '',
            unit_count: '',
            bill_total: '',
            bill_description: ''
        },
        editProduct: {
            product_name: '',
            description: '',
            price: '',
            unit_count: ''
        }
    });

    // Helper functions
    const toggleProductExpand = (productId) => {
        setState(prev => ({
            ...prev,
            expandedProducts: {
                ...prev.expandedProducts,
                [productId]: !prev.expandedProducts[productId]
            }
        }));
    };




    const calculateRemainingQuantity = (product) => {
        const totalReturned = product.return_lists?.reduce(
            (sum, r) => sum + parseInt(r.unit_count || 0), 0) || 0;
        return product.unit_count - totalReturned;
    };

    const handleSave = () => {
        put(`/challan/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message or perform other actions
                console.log('Challan updated successfully');
            },
            onError: (errors) => {
                console.error('Error updating challan:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Edit Challan: {data.challan_number}</h4>
                    <Button
                        size='sm'
                        variant="primary"
                        onClick={handleSave}
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Returns</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.purchase_list?.purchased_products?.map((product) => (
                            <React.Fragment key={product.id}>
                                <tr>
                                    <td className="text-nowrap">

                                        {
                                            state.expandedProducts[product.id] ?
                                                <ArrowUp  onClick={() => toggleProductExpand(product.id)} /> :
                                                <ArrowDown  onClick={() => toggleProductExpand(product.id)} />
                                        }


                                    </td>
                                    <td>
                                        {product.product_name}
                                        {product.description && (
                                            <div className="text-muted small">{product.description}</div>
                                        )}
                                    </td>
                                    <td>

                                        {product.unit_count}
                                        {calculateRemainingQuantity(product) < product.unit_count && (
                                            <Badge bg="warning" className="ms-2">
                                                Remaining: {calculateRemainingQuantity(product)}
                                            </Badge>
                                        )}
                                    </td>
                                    <td>
                                        ₹${product.price}
                                    </td>
                                    <td>₹{product.price * product.unit_count}</td>
                                    <td>
                                        {product.return_lists?.length || 0} returns
                                        <br />
                                        ₹{product.return_lists?.reduce(
                                            (sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0}
                                    </td>

                                </tr>

                                {/* Expanded returns section */}
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <Collapse in={state.expandedProducts[product.id]}>
                                            <div>
                                                <div className="p-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h6 className="mb-0 text-muted">
                                                            <RotateCcw size={16} className="me-2" />
                                                            Returns for {product.product_name}
                                                        </h6>
                                                    </div>

                                                    <Table size="sm" className="mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Vendor</th>
                                                                <th>Return Date</th>
                                                                <th>Quantity</th>
                                                                <th>Amount (₹)</th>
                                                                <th>Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>


                                                            {/* Return Rows */}
                                                            {product.return_lists?.map(returnItem => (
                                                                <tr key={returnItem.id} className={state.editingReturnId === returnItem.id ? "table-warning" : ""}>

                                                                    <td>{returnItem.vendor_name}</td>
                                                                    <td>{returnItem.return_date}</td>
                                                                    <td>{returnItem.unit_count}</td>
                                                                    <td className="fw-bold">₹{parseFloat(returnItem.bill_total * returnItem.unit_count || 0).toLocaleString('en-IN')}</td>
                                                                    <td className="text-truncate" style={{ maxWidth: '150px' }} title={returnItem.bill_description}>
                                                                        {returnItem.bill_description}
                                                                    </td>

                                                                </tr>
                                                            ))}

                                                            {/* Return Total Row */}
                                                            {product.return_lists?.length > 0 && (
                                                                <tr className="table-secondary">
                                                                    <td colSpan={3} className="text-end fw-bold">Returns Total:</td>
                                                                    <td className="fw-bold">
                                                                        ₹{(product.return_lists?.reduce((sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0).toLocaleString('en-IN')}
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
                        ))}
                    </tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditChallan;