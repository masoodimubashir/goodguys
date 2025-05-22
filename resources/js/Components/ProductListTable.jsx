import React from 'react';
import { useForm } from '@inertiajs/react';

const ProductListTable = ({ 
    purchaseList, 
    showAddProduct, 
    toggleAddProduct, 
    editingProductId,
    startProductEdit,
    deleteProduct 
}) => {
    const addProductForm = useForm({
        purchase_list_id: purchaseList.id,
        product_name: '', 
        price: '', 
        unit_count: '', 
        description: '',
    });

    const editProductForm = useForm({
        product_name: '', 
        price: '', 
        unit_count: '', 
        description: '',
    });

    const calcTotal = (price, count) => (parseFloat(price || 0) * parseInt(count || 0)).toFixed(2);

    const handleAddProduct = (e) => {
        e.preventDefault();
        addProductForm.post(route('purchased-product.store'), {
            preserveScroll: true,
            onSuccess: () => { 
                toggleAddProduct(); 
                // ShowMessage('success', 'Product created'); 
            }
        });
    };

    const handleEditProduct = (e) => {
        e.preventDefault();
        editProductForm.put(route('purchased-product.update', editingProductId), {
            preserveScroll: true,
            onSuccess: () => { 
                // setState(prev => ({ ...prev, editingProductId: null })); 
                // ShowMessage('success', 'Product updated'); 
            }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                    </svg>
                    Purchased Products
                </h3>
                <button
                    onClick={toggleAddProduct}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        showAddProduct 
                            ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    {showAddProduct ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Add Product Row */}
                        {showAddProduct && (
                            <tr className="bg-green-50 border-l-4 border-green-400">
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        value={addProductForm.data.product_name}
                                        onChange={e => addProductForm.setData('product_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Product name"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={addProductForm.data.price}
                                        onChange={e => addProductForm.setData('price', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        value={addProductForm.data.unit_count}
                                        onChange={e => addProductForm.setData('unit_count', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="0"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-green-600">
                                        ${calcTotal(addProductForm.data.price, addProductForm.data.unit_count)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        value={addProductForm.data.description}
                                        onChange={e => addProductForm.setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Description"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={handleAddProduct}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        )}

                        {/* Product Rows */}
                        {purchaseList.purchased_products.map(product => (
                            <tr 
                                key={product.id} 
                                className={editingProductId === product.id ? "bg-yellow-50 border-l-4 border-yellow-400" : "hover:bg-gray-50"}
                            >
                                {editingProductId === product.id ? (
                                    // Edit Mode
                                    <>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editProductForm.data.product_name}
                                                onChange={e => editProductForm.setData('product_name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editProductForm.data.price}
                                                onChange={e => editProductForm.setData('price', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={editProductForm.data.unit_count}
                                                onChange={e => editProductForm.setData('unit_count', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-yellow-600">
                                                ${calcTotal(editProductForm.data.price, editProductForm.data.unit_count)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editProductForm.data.description}
                                                onChange={e => editProductForm.setData('description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={handleEditProduct}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => {/* Cancel edit */}}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    // View Mode
                                    <>
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.product_name}</td>
                                        <td className="px-6 py-4 text-gray-600">${product.price}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.unit_count}</td>
                                        <td className="px-6 py-4 font-semibold text-green-600">
                                            ${calcTotal(product.price, product.unit_count)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{product.description || 'N/A'}</td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() => startProductEdit(product)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}

                        {purchaseList.purchased_products.length === 0 && !showAddProduct && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                                        </svg>
                                        <p>No products added yet</p>
                                        <p className="text-sm">Click "Add Product" to get started</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListTable;