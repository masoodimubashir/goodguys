import React, { useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function PurchasedProduct({ purchaseList }) {
    const flash = usePage().props.flash;
    const { delete: destroy } = useForm();

    const [state, setState] = useState({
        showAddProduct: false,
        editingProductId: null,
        showAddReturn: false,
        editingReturnId: null,
    });

    const addProductForm = useForm({
        purchase_list_id: purchaseList.id,
        product_name: '', price: '', unit_count: '', description: '',
    });

    const editProductForm = useForm({
        product_name: '', price: '', unit_count: '', description: '',
    });

    const addReturnForm = useForm({
        purchase_list_id: purchaseList.id,
        vendor_name: purchaseList.vendor_name,
        return_date: new Date().toISOString().split('T')[0],
        bill: '',
        bill_total: '',
        bill_description: ''
    });

    const editReturnForm = useForm({
        vendor_name: '', return_date: '', bill: '', bill_total: '', bill_description: ''
    });

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    const toggleAddProduct = () => {
        setState(prev => ({ ...prev, showAddProduct: !prev.showAddProduct, editingProductId: null }));
        addProductForm.reset(); addProductForm.clearErrors();
    };

    const toggleAddReturn = () => {
        setState(prev => ({ ...prev, showAddReturn: !prev.showAddReturn, editingReturnId: null }));
        addReturnForm.reset(); addReturnForm.clearErrors();
    };

    const startProductEdit = (product) => {
        setState(prev => ({ ...prev, editingProductId: product.id, showAddProduct: false }));
        editProductForm.setData({ ...product });
    };

    const startReturnEdit = (r) => {
        setState(prev => ({ ...prev, editingReturnId: r.id, showAddReturn: false }));
        editReturnForm.setData({ ...r });
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        addProductForm.post(route('purchased-product.store'), {
            preserveScroll: true,
            onSuccess: () => { toggleAddProduct(); ShowMessage('success', 'Product created'); }
        });
    };

    const handleEditProduct = (e) => {
        e.preventDefault();
        editProductForm.put(route('purchased-product.update', state.editingProductId), {
            preserveScroll: true,
            onSuccess: () => { setState(prev => ({ ...prev, editingProductId: null })); ShowMessage('success', 'Product updated'); }
        });
    };

    const handleAddReturn = (e) => {
        e.preventDefault();
        addReturnForm.post(route('return-list.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toggleAddReturn();
                ShowMessage('success', 'Return created');
            }
        });

    };

    const handleEditReturn = (e) => {
        e.preventDefault();
        editReturnForm.put(route('return-list.update', state.editingReturnId), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setState(prev => ({ ...prev, editingReturnId: null }));
                ShowMessage('success', 'Return updated');
            }
        });

    };

    const deleteProduct = (id) => {
        if (confirm("Delete this product?")) {
            destroy(route('purchased-product.destroy', id), { preserveScroll: true });
        }
    };

    const deleteReturn = (id) => {
        if (confirm("Delete this return?")) {
            destroy(route('return-list.destroy', id), { preserveScroll: true });
        }
    };

    const calcTotal = (price, count) => (parseFloat(price || 0) * parseInt(count || 0)).toFixed(2);

    return (
        <AuthenticatedLayout>


            <div className="container py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div  className="bg-white p-4 rounded-lg shadow border">
                            <div className="mb-2">
                                <h2 className="text-lg font-semibold">{purchaseList.vendor_name}</h2>
                                <p className="text-sm text-black">{purchaseList.purchase_date}</p>
                            </div>
                            <p className="text-sm text-black">
                                <span className="font-medium">Client:</span> {purchaseList.client?.name}
                            </p>
                            <p className="text-sm text-black">
                                <span className="font-medium">Total:</span> ${purchaseList.bill_total}
                            </p>
                            <p className="text-sm text-black mb-2">
                                <span className="font-medium">Description:</span> {purchaseList.bill_description || 'N/A'}
                            </p>

                            {purchaseList.bill ? (
                                <a href={`/storage/${purchaseList.bill}`} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={`/storage/${purchaseList.bill}`}
                                        alt="Return Bill"
                                        className="w-full h-40 object-cover rounded hover:scale-105 transition-transform"
                                    />
                                </a>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No bill image</p>
                            )}
                        </div>
                </div>
            </div>


            <div className="container py-4">

                {/* Products Section */}
                <div className='d-flex justify-content-between mb-3'>
                    <h5>Purchased Products</h5>
                    <Button size="sm" onClick={toggleAddProduct} variant={state.showAddProduct ? "secondary" : "primary"}>
                        {state.showAddProduct ? "Cancel" : "Add Product"}
                    </Button>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th><th>Price</th><th>Count</th><th>Total</th><th>Description</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.showAddProduct && (
                            <tr className="table-success">
                                <td><Form.Control size="sm" value={addProductForm.data.product_name} onChange={e => addProductForm.setData('product_name', e.target.value)} /></td>
                                <td><Form.Control size="sm" type="number" value={addProductForm.data.price} onChange={e => addProductForm.setData('price', e.target.value)} /></td>
                                <td><Form.Control size="sm" type="number" value={addProductForm.data.unit_count} onChange={e => addProductForm.setData('unit_count', e.target.value)} /></td>
                                <td>{calcTotal(addProductForm.data.price, addProductForm.data.unit_count)}</td>
                                <td><Form.Control size="sm" value={addProductForm.data.description} onChange={e => addProductForm.setData('description', e.target.value)} /></td>
                                <td>
                                    <Button size="sm" variant="success" onClick={handleAddProduct}>Save</Button>
                                </td>
                            </tr>
                        )}
                        {purchaseList.purchased_products.map(p => (
                            <tr key={p.id} className={state.editingProductId === p.id ? "table-warning" : ""}>
                                {state.editingProductId === p.id ? (
                                    <>
                                        <td><Form.Control size="sm" value={editProductForm.data.product_name} onChange={e => editProductForm.setData('product_name', e.target.value)} /></td>
                                        <td><Form.Control size="sm" type="number" value={editProductForm.data.price} onChange={e => editProductForm.setData('price', e.target.value)} /></td>
                                        <td><Form.Control size="sm" type="number" value={editProductForm.data.unit_count} onChange={e => editProductForm.setData('unit_count', e.target.value)} /></td>
                                        <td>{calcTotal(editProductForm.data.price, editProductForm.data.unit_count)}</td>
                                        <td><Form.Control size="sm" value={editProductForm.data.description} onChange={e => editProductForm.setData('description', e.target.value)} /></td>
                                        <td>
                                            <Button size="sm" variant="success" onClick={handleEditProduct}>Update</Button>{' '}
                                            <Button size="sm" variant="secondary" onClick={() => setState(prev => ({ ...prev, editingProductId: null }))}>Cancel</Button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{p.product_name}</td>
                                        <td>{p.price}</td>
                                        <td>{p.unit_count}</td>
                                        <td>{calcTotal(p.price, p.unit_count)}</td>
                                        <td>{p.description}</td>
                                        <td>
                                            <Button size="sm" variant="info" onClick={() => startProductEdit(p)}>Edit</Button>{' '}
                                            <Button size="sm" variant="danger" onClick={() => deleteProduct(p.id)}>Delete</Button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Return List Section */}
                <div className='d-flex justify-content-between mb-3 mt-5'>
                    <h5>Returned Items</h5>
                    <Button size="sm" onClick={toggleAddReturn} variant={state.showAddReturn ? "secondary" : "primary"}>
                        {state.showAddReturn ? "Cancel" : "Add Return"}
                    </Button>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Vendor</th><th>Return Date</th><th>Bill #</th><th>Total</th><th>Description</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.showAddReturn && (
                            <tr className="table-success">
                                <td><Form.Control size="sm" value={addReturnForm.data.vendor_name} onChange={e => addReturnForm.setData('vendor_name', e.target.value)} /></td>
                                <td><Form.Control size="sm" type="date" value={addReturnForm.data.return_date} onChange={e => addReturnForm.setData('return_date', e.target.value)} /></td>
                                <td>
                                    <Form.Control size="sm" type="file" onChange={e => addReturnForm.setData('bill', e.target.files[0])} />
                                </td>
                                <td><Form.Control size="sm" type="number" step="0.01" value={addReturnForm.data.bill_total} onChange={e => addReturnForm.setData('bill_total', e.target.value)} /></td>
                                <td><Form.Control size="sm" value={addReturnForm.data.bill_description} onChange={e => addReturnForm.setData('bill_description', e.target.value)} /></td>
                                <td><Button size="sm" variant="success" onClick={handleAddReturn}>Save</Button></td>
                            </tr>
                        )}

                        {purchaseList.return_lists.map(r => (
                            <tr key={r.id} className={state.editingReturnId === r.id ? "table-warning" : ""}>
                                {state.editingReturnId === r.id ? (
                                    <>
                                        <td><Form.Control size="sm" value={editReturnForm.data.vendor_name} onChange={e => editReturnForm.setData('vendor_name', e.target.value)} /></td>
                                        <td><Form.Control size="sm" type="date" value={editReturnForm.data.return_date} onChange={e => editReturnForm.setData('return_date', e.target.value)} /></td>
                                        <td>
                                            <Form.Control size="sm" type="file" onChange={e => editReturnForm.setData('bill', e.target.files[0])} />
                                        </td>
                                        <td><Form.Control size="sm" type="number" value={editReturnForm.data.bill_total} onChange={e => editReturnForm.setData('bill_total', e.target.value)} /></td>
                                        <td><Form.Control size="sm" value={editReturnForm.data.bill_description} onChange={e => editReturnForm.setData('bill_description', e.target.value)} /></td>
                                        <td>
                                            <Button size="sm" variant="success" onClick={handleEditReturn}>Update</Button>{' '}
                                            <Button size="sm" variant="secondary" onClick={() => setState(prev => ({ ...prev, editingReturnId: null }))}>Cancel</Button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{r.vendor_name}</td>
                                        <td>{r.return_date}</td>

                                        <td>
                                            {r.bill ? (
                                                <a
                                                    href={`/storage/${r.bill}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={`/storage/${r.bill}`}
                                                        alt="Return Bill"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            rounded: '5px',
                                                            objectFit: 'cover',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '5px',
                                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                    />
                                                </a>
                                            ) : (
                                                'No file'
                                            )}
                                        </td>



                                        <td>{r.bill_total}</td>
                                        <td>{r.bill_description}</td>
                                        <td>
                                            <Button size="sm" variant="info" onClick={() => startReturnEdit(r)}>Edit</Button>{' '}
                                            <Button size="sm" variant="danger" onClick={() => deleteReturn(r.id)}>Delete</Button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </AuthenticatedLayout>
    );
}
