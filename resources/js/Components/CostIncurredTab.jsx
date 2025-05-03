import React from 'react';

const DataTableComponent = ({ client, tableRef, handleEditAccount, handleDeleteItem }) => {
    return (
        <div className="app-scroll table-responsive">
            <table ref={tableRef} className="table table-striped text-start align-middle">
                <thead>
                    <tr>
                        <th className="text-start align-middle">Entry Name</th>
                        <th className="text-start align-middle">Count</th>
                        <th className="text-start align-middle">Selling Price</th>
                        <th className="text-start align-middle">Buying Price</th>
                        <th className="text-start align-middle">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {client.cost_incurreds.map(entry => ({
                        ...entry, 
                        type: 'cost-incurred'
                    })).map((entry) => (
                        <tr key={`${entry.type}-${entry.id}`} className="align-middle">
                            <td className="text-start align-middle">
                                <div className="fw-medium">{entry.entry_name}</div>
                            </td>

                            <td className="text-start align-middle">
                                {entry.count !== null && entry.count !== undefined ? (
                                    <span>{entry.count}</span>
                                ) : (
                                    <span className="text-muted">N/A</span>
                                )}
                            </td>

                            <td className="text-start align-middle">
                                {entry.selling_price !== null && entry.selling_price !== undefined ? (
                                    <span>{parseFloat(entry.selling_price).toFixed(2)}</span>
                                ) : (
                                    <span className="text-muted">N/A</span>
                                )}
                            </td>

                            <td className="text-start align-middle">
                                {entry.buying_price !== null && entry.buying_price !== undefined ? (
                                    <span>{parseFloat(entry.buying_price).toFixed(2)}</span>
                                ) : (
                                    <span className="text-muted">N/A</span>
                                )}
                            </td>

                            <td className="text-start align-middle">
                                <div className="btn-group dropdown-icon-none">
                                    <button 
                                        className="border-0 icon-btn dropdown-toggle" 
                                        type="button"
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                    >
                                        <i className="ti ti-dots"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={() => handleEditAccount(entry)}
                                            >
                                                <i className="ti ti-edit"></i> Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={() => handleDeleteItem(entry.id, entry.type)}
                                            >
                                                <i className="ti ti-trash"></i> Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTableComponent;