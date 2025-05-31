import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function LedgerTab({ client }) {
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const getFinalAmount = (amount) => {
        const baseAmount = Number(amount);
        if (isNaN(baseAmount)) return 0;
        const serviceChargeRate = client?.service_charge?.service_charge || 0;
        const taxRate = client?.tax || 0;
        const withService = baseAmount + (baseAmount * serviceChargeRate) / 100;
        const withTax = withService + (withService * taxRate) / 100;
        return withTax;
    };

    return (
        <div className="table-responsive">
            <Table size="sm" bordered hover className="mb-0">
                <thead>
                    <tr>
                        <th className="text-start">Item</th>
                        <th className="text-start">Buying</th>
                        <th className="text-start">Selling</th>
                        <th className="text-start">Qty</th>
                        <th className="text-end">Total</th>
                        <th className="text-end">Final Amount</th>
                        <th className="text-end"></th>
                    </tr>
                </thead>
                <tbody>
                    {client.accounts.map((entry) => (
                        <React.Fragment key={`account-${entry.id}`}>
                            <motion.tr 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <td className="text-start">
                                    <div className="fw-medium">{entry.item_name}</div>
                                </td>
                                <td className="text-start">
                                    <span className="badge bg-light-subtle text-dark border px-2 py-1">
                                        ₹{entry.buying_price}
                                    </span>
                                </td>
                                <td className="text-start">
                                    <span className="badge bg-light-subtle text-dark border px-2 py-1">
                                        ₹{Number(entry.selling_price)}
                                    </span>
                                </td>
                                <td className="text-start">{entry.count}</td>
                                <td className="text-end">
                                    <span className="fw-medium text-success">
                                        ₹{entry.total_amount}
                                    </span>
                                </td>
                                <td className="text-end">
                                    <span className="fw-medium text-success">
                                        ₹{getFinalAmount(entry.total_amount)}
                                    </span>
                                </td>
                                <td className="text-end">
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
                                </td>
                            </motion.tr>

                            {expandedRows.includes(entry.id) && (
                                <motion.tr
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-light"
                                >
                                    <td colSpan={7}>
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
                                                    {entry.description?.length > 0 && (
                                                        <div className="mb-2">
                                                            <span className="text-muted">Description:</span>
                                                            <ul className="list-unstyled ps-3 mt-1 mb-0">
                                                                {entry.description.map((dim, index) => (
                                                                    <li key={index} className="d-flex align-items-center text-secondary small mb-1">
                                                                        <i className="ti ti-point-filled me-1 fs-7"></i>
                                                                        <span>{dim}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="fw-bold mb-3">Pricing Breakdown</h6>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Unit Price:</span>{' '}
                                                        ₹{entry.selling_price}
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Quantity:</span>{' '}
                                                        {entry.count}
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Subtotal:</span>{' '}
                                                        ₹{entry.selling_price * entry.count}
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Service Charge ({client?.service_charge?.service_charge || 0}%):</span>{' '}
                                                        ₹{(entry.total_amount * (client?.service_charge?.service_charge || 0) / 100).toFixed(2)}
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Tax ({client?.tax || 0}%):</span>{' '}
                                                        ₹{((entry.total_amount + (entry.total_amount * (client?.service_charge?.service_charge || 0) / 100)) * (client?.tax || 0) / 100)}
                                                    </div>
                                                    <div className="fw-bold">
                                                        <span className="text-muted">Final Amount:</span>{' '}
                                                        ₹{getFinalAmount(entry.total_amount).toFixed(2)}
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
}