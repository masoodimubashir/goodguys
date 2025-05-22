import React from 'react';
import { useForm } from '@inertiajs/react';

const ReturnListTable = ({ 
    purchaseList, 
    showAddReturn, 
    toggleAddReturn, 
    editingReturnId,
    startReturnEdit,
    deleteReturn 
}) => {
    const addReturnForm = useForm({
        purchase_list_id: purchaseList.id,
        vendor_name: purchaseList.vendor_name,
        return_date: new Date().toISOString().split('T')[0],
        bill: '',
        bill_total: '',
        bill_description: ''
    });

    const editReturnForm = useForm({
        vendor_name: '', 
        return_date: '', 
        bill: '', 
        bill_total: '', 
        bill_description: ''
    });

    const handleAddReturn = (e) => {
        e.preventDefault();
        addReturnForm.post(route('return-list.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toggleAddReturn();
                // ShowMessage('success', 'Return created');
            }
        });
    };

    const handleEditReturn = (e) => {
        e.preventDefault();
        editReturnForm.put(route('return-list.update', editingReturnId), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // setState(prev => ({ ...prev, editingReturnId: null }));
                // ShowMessage('success', 'Return updated');
            }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Returned Items
                </h3>
                <button
                    onClick={toggleAddReturn}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        showAddReturn 
                            ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                            : 'bg-white text-red-600 hover:bg-red-50'
                    }`}
                >
                    {showAddReturn ? 'Cancel' : 'Add Return'}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Add Return Row */}
                        {showAddReturn && (
                            <tr className="bg-green-50 border-l-4 border-green-400">
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        value={addReturnForm.data.vendor_name}
                                        onChange={e => addReturnForm.setData('vendor_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Vendor name"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="date"
                                        value={addReturnForm.data.return_date}
                                        onChange={e => addReturnForm.setData('return_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={e => addReturnForm.setData('bill', e.target.files[0])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                            accept="image/*,.pdf"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={addReturnForm.data.bill_total}
                                        onChange={e => addReturnForm.setData('bill_total', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        value={addReturnForm.data.bill_description}
                                        onChange={e => addReturnForm.setData('bill_description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Description"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={handleAddReturn}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        )}

                        {/* Return Rows */}
                        {purchaseList.return_lists.map(returnItem => (
                            <tr 
                                key={returnItem.id} 
                                className={editingReturnId === returnItem.id ? "bg-yellow-50 border-l-4 border-yellow-400" : "hover:bg-gray-50"}
                            >
                                {editingReturnId === returnItem.id ? (
                                    // Edit Mode
                                    <>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editReturnForm.data.vendor_name}
                                                onChange={e => editReturnForm.setData('vendor_name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editReturnForm.data.bill_description}
                                                onChange={e => editReturnForm.setData('bill_description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={handleEditReturn}
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
                                        <td className="px-6 py-4 font-medium text-gray-900">{returnItem.vendor_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{returnItem.return_date}</td>
                                        <td className="px-6 py-4">
                                            {returnItem.bill ? (
                                                <a
                                                    href={`/storage/${returnItem.bill}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative inline-block"
                                                >
                                                    <img
                                                        src={`/storage/${returnItem.bill}`}
                                                        alt="Return Bill"
                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-300 shadow-sm group-hover:shadow-md transition-all duration-200"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </a>
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-red-600">${returnItem.bill_total}</td>
                                        <td className="px-6 py-4 text-gray-600">{returnItem.bill_description || 'N/A'}</td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() => startReturnEdit(returnItem)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteReturn(returnItem.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}

                        {purchaseList.return_lists.length === 0 && !showAddReturn && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <p>No returns recorded yet</p>
                                        <p className="text-sm">Click "Add Return" to get started</p>
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

export default ReturnListTable;