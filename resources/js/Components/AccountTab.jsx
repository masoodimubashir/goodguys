import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Table } from 'react-bootstrap';
import { Plus, Edit, Trash2, X, Check, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AccountTab({
    client,
    handleEditRow,
    handleDeleteItem,
    editingRow,
    form,
    handleSubmit,
    cancelEdit,
    handleSourceChange,
    inventoryOptions,
    modules
}) {
    const [isAdding, setIsAdding] = useState(false);
    const tableHead = ['Item', 'Price', 'Qty', 'Total', ''];

    const handleAddNew = () => {
        form.reset();
        form.setData('type', 'inventory');
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
                Swal.fire(
                    'Deleted!',
                    'Your entry has been deleted.',
                    'success'
                );
            }
        });
    };

    const submitForm = (e, isNew = false) => {
        handleSubmit('account', e);
        if (isNew) setIsAdding(false);
    };

    return (
        <div className="table-responsive">
            <div className="mb-3 d-flex justify-content-end align-items-center">

                {
                    isAdding ? (
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                                onClick={submitForm}
                            >
                                <Check size={16} />
                                Save
                            </button>
                            <button
                                className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                                onClick={handleCancelAdd}
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                            onClick={handleAddNew}
                            disabled={isAdding || editingRow.id}
                        >
                            <Plus size={16} />
                            Add Entry
                        </button>
                    )
                }


            </div>

            <Table size="sm" bordered hover responsive className="mb-0">
                <thead>
                    <tr>
                        {tableHead.map((head, index) => (
                            <th key={index} className="text-start">{head}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Add New Row */}
                    {isAdding && (
                        <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <td>
                                <div className="d-flex flex-column gap-2">
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.data.type}
                                        onChange={(e) => form.setData('type', e.target.value)}
                                    >
                                        <option value="inventory">Inventory</option>
                                        <option value="module">Module</option>
                                    </select>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.data.type === 'inventory' ? form.data.inventory_id : form.data.module_id}
                                        onChange={(e) => handleSourceChange(form.data.type, e)}
                                    >
                                        <option value="">Select {form.data.type}</option>
                                        {(form.data.type === 'inventory' ? inventoryOptions : modules).map(item => (
                                            <option key={item.id} value={item.id}>
                                                {form.data.type === 'inventory' ? item.item_name : item.module_name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Description"
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                    />
                                </div>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Price"
                                    value={form.data.selling_price}
                                    onChange={(e) => form.setData('selling_price', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Qty"
                                    value={form.data.count}
                                    onChange={(e) => form.setData('count', e.target.value)}
                                />
                            </td>
                            <td className="text-end">
                                ₹{Number(form.data.selling_price * form.data.count) || 0}
                            </td>
                            <td className="text-end">
                                <div className="d-flex gap-2 justify-content-end">
                                    <button
                                        className="btn btn-sm btn-link p-0 text-danger"
                                        onClick={handleCancelAdd}
                                    >
                                        <X size={22} />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-link p-0 text-success"
                                        onClick={(e) => submitForm(e, true)}
                                        disabled={form.processing}
                                    >
                                        {form.processing ? (
                                            <Loader2 size={22} className="animate-spin" />
                                        ) : (
                                            <Check size={22} />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    )}

                    {/* Existing Rows */}
                    {[...client.accounts.map(acc => ({ ...acc, type: 'accounts' }))].map((entry) => (
                        <React.Fragment key={`${entry.type}-${entry.id}`}>
                            {editingRow.id === entry.id ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <td>
                                        <div className="d-flex flex-column gap-2">
                                            <select
                                                className="form-select form-select-sm"
                                                value={form.data.type}
                                                onChange={(e) => form.setData('type', e.target.value)}
                                            >
                                                <option value="inventory">Inventory</option>
                                                <option value="module">Module</option>
                                            </select>
                                            <select
                                                className="form-select form-select-sm"
                                                value={form.data.type === 'inventory' ? form.data.inventory_id : form.data.module_id}
                                                onChange={(e) => handleSourceChange(form.data.type, e)}
                                            >
                                                <option value="">Select {form.data.type}</option>
                                                {(form.data.type === 'inventory' ? inventoryOptions : modules).map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {form.data.type === 'inventory' ? item.item_name : item.module_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Description"
                                                value={form.data.description}
                                                onChange={(e) => form.setData('description', e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Price"
                                            value={form.data.selling_price}
                                            onChange={(e) => form.setData('selling_price', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Qty"
                                            value={form.data.count}
                                            onChange={(e) => form.setData('count', e.target.value)}
                                        />
                                    </td>
                                    <td className="text-end">
                                        ₹{Number(form.data.selling_price * form.data.count) || 0}
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
                                                onClick={submitForm}
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
                            ) : (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <td>
                                        <div className="fw-medium">{entry.item_name}</div>
                                        {entry.description && (
                                            <small className="text-muted">{entry.description}</small>
                                        )}
                                           <small className="text-muted"> <br />
                                        {new Date(entry.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </small>
                                    </td>
                                    <td>₹{Number(entry.selling_price)}</td>
                                    <td>{entry.count}</td>
                                    <td className="text-end">₹{Number(entry.selling_price * entry.count)}</td>
                                    <td className="text-end">
                                        <div className="d-flex gap-2 justify-content-end">
                                            <button
                                                className="btn btn-sm btn-link p-0 text-primary"
                                                onClick={() => handleEditRow('account', entry)}
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
}