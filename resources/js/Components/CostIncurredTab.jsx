import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table } from 'react-bootstrap';
import { Edit, Trash2, ChevronDown, ChevronUp, Check, X, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

const CostIncurredTab = ({ 
    client, 
    handleEditRow, 
    handleDeleteItem, 
    editingRow,
    form,
    handleSubmit,
    cancelEdit
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const handleAddNew = () => {
        form.reset();
        setIsAdding(true);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        form.reset();
    };

    const handleDelete = (id, type) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteItem(id, type);
            }
        });
    };

    return (
        <div className="table-responsive">
            <div className="mb-3 d-flex justify-content-end align-items-center">
                <button 
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                    onClick={handleAddNew}
                    disabled={isAdding || editingRow.id}
                >
                    <Plus size={16} />
                    Add Entry
                </button>
            </div>

            <Table size="sm" bordered hover className="mb-0">
                <thead>
                    <tr>
                        <th className="text-start">Entry</th>
                        <th className="text-start">Count</th>
                        <th className="text-start">Selling</th>
                        <th className="text-start">Buying</th>
                        <th className="text-end"></th>
                    </tr>
                </thead>
                <tbody>
                    {/* Add New Row */}
                    {isAdding && (
                        <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-light"
                        >
                            <td>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Entry name"
                                    value={form.data.entry_name}
                                    onChange={(e) => form.setData('entry_name', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Count"
                                    value={form.data.count}
                                    onChange={(e) => form.setData('count', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Selling price"
                                    value={form.data.selling_price}
                                    onChange={(e) => form.setData('selling_price', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Buying price"
                                    value={form.data.buying_price}
                                    onChange={(e) => form.setData('buying_price', e.target.value)}
                                />
                            </td>
                            <td className="text-end">
                                <div className="d-flex gap-2 justify-content-end">
                                    <button 
                                        className="btn btn-sm btn-link p-0 text-danger"
                                        onClick={handleCancelAdd}
                                    >
                                        <X size={18} />
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-link p-0 text-success"
                                        onClick={(e) => {
                                            handleSubmit('cost-incurred', e);
                                            setIsAdding(false);
                                        }}
                                        disabled={form.processing}
                                    >
                                        {form.processing ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Check size={18} />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    )}

                    {/* Existing Rows */}
                    {client.cost_incurreds.map(entry => ({
                        ...entry, 
                        type: 'cost-incurreds'
                    })).map((entry) => (
                        <React.Fragment key={`${entry.type}-${entry.id}`}>
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {editingRow.id === entry.id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={form.data.entry_name}
                                                onChange={(e) => form.setData('entry_name', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={form.data.count}
                                                onChange={(e) => form.setData('count', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={form.data.selling_price}
                                                onChange={(e) => form.setData('selling_price', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={form.data.buying_price}
                                                onChange={(e) => form.setData('buying_price', e.target.value)}
                                            />
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button 
                                                    className="btn btn-sm btn-link p-0 text-danger"
                                                    onClick={cancelEdit}
                                                >
                                                    <X size={18} />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-link p-0 text-success"
                                                    onClick={(e) => handleSubmit('cost-incurred', e)}
                                                    disabled={form.processing}
                                                >
                                                    {form.processing ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <Check size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="text-start">
                                            <div className="fw-medium">{entry.entry_name}</div>
                                        </td>
                                        <td className="text-start">
                                            {entry.count ?? <span className="text-muted">N/A</span>}
                                        </td>
                                        <td className="text-start">
                                            {entry.selling_price ? parseFloat(entry.selling_price).toFixed(2) : <span className="text-muted">N/A</span>}
                                        </td>
                                        <td className="text-start">
                                            {entry.buying_price ? parseFloat(entry.buying_price).toFixed(2) : <span className="text-muted">N/A</span>}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button 
                                                    className="btn btn-sm btn-link p-0 text-primary"
                                                    onClick={() => handleEditRow('cost-incurred', entry)}
                                                    disabled={isAdding || editingRow.id}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-link p-0 text-danger"
                                                    onClick={() => handleDelete(entry.id, entry.type)}
                                                    disabled={isAdding || editingRow.id}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() => toggleRow(entry.id)}
                                                >
                                                    {expandedRows.includes(entry.id) ? (
                                                        <ChevronUp size={18} />
                                                    ) : (
                                                        <ChevronDown size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </motion.tr>

                            {expandedRows.includes(entry.id) && (
                                <motion.tr
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-light"
                                >
                                    <td colSpan={5}>
                                        <div className="p-3">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="fw-bold mb-3">Details</h6>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Created:</span>{' '}
                                                        {entry.created_at ? (
                                                            new Date(entry.created_at).toLocaleString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true
                                                            })
                                                        ) : 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="fw-bold mb-3">Financials</h6>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Total Selling Value:</span>{' '}
                                                        ₹{(entry.selling_price * entry.count).toFixed(2)}
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Total Buying Value:</span>{' '}
                                                        ₹{(entry.buying_price * entry.count).toFixed(2)}
                                                    </div>
                                                    <div className="fw-bold">
                                                        <span className="text-muted">Profit/Loss:</span>{' '}
                                                        ₹{((entry.selling_price - entry.buying_price) * entry.count).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CostIncurredTab;