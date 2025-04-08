// components/LedgerTab.jsx
import React from 'react';

export default function LedgerTab({ client, tableRef, handleEditAccount, handleDeleteItem }) {


    const getFinalAmount = (amount) => {
        const withService = amount + (amount * client.service_charge) / 100;
        const withTax = withService + (withService * client.tax) / 100;
        return withTax;
    };

    return (
        <div className="tab-pane fade" id="css-tab-pane" role="tabpanel" aria-labelledby="css-tab" tabIndex="0">
            <div className="app-scroll table-responsive">
                <table ref={tableRef} className="table table-striped text-start align-middle">
                    <thead>
                        <tr>
                            <th className="text-start align-middle">Created At</th>
                            <th className="text-start align-middle">Item Name</th>
                            <th className="text-start align-middle">Buying Price</th>
                            <th className="text-start align-middle">Selling Price</th>
                            <th className="text-start align-middle">Selling Price + Service Charge</th>
                            <th className="text-start align-middle">Count</th>
                            <th className="text-start align-middle">Total Price</th>
                            <th className="text-start align-middle">Total Price (Service Charge + Tax)</th>
                            <th className="text-start align-middle">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {client.accounts.map(acc => ({ ...acc, type: 'Account' })).map((entry) => (
                            <tr key={`${entry.type}-${entry.id}`} className="align-middle">
                                <td className="text-start align-middle">
                                    {entry.created_at ? (
                                        <div className="d-flex flex-column">
                                            <span>{new Date(entry.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}</span>
                                            <small className="text-muted">
                                                {new Date(entry.created_at).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true
                                                })}
                                            </small>
                                        </div>
                                    ) : (
                                        <span className="text-muted">N/A</span>
                                    )}
                                </td>

                                <td className="text-start align-middle">
                                    <div className="fw-medium">{entry.item_name}</div>
                                    {entry.description?.length > 0 && (
                                        <ul className="list-unstyled ps-0 mt-1 mb-0">
                                            {entry.description.map((dim, index) => (
                                                <li key={index} className="d-flex align-items-center text-secondary small mb-1">
                                                    <i className="ti ti-point-filled me-1 fs-7"></i>
                                                    <span>{dim}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </td>

                                <td className="text-start align-middle text-nowrap">
                                    <span className="badge bg-light-subtle text-dark border px-2 py-1">
                                        ₹{entry.buying_price}
                                    </span>
                                </td>

                                <td className="text-start align-middle text-nowrap">
                                    <span className="badge bg-light-subtle text-dark border px-2 py-1">
                                        ₹{Number(entry.selling_price)}
                                    </span>
                                </td>



                                <td className="text-start align-middle text-nowrap">
                                    <div className="d-flex align-items-center">
                                        <span className="text-secondary"> ₹{entry.selling_price}</span>
                                        +
                                        <span className="badge bg-light text-dark"> ₹{entry.service_charge_amount}</span>
                                        <i className="ti ti-equal mx-1 text-muted small"></i>
                                        <span className="fw-medium">
                                            ₹{entry.selling_price + entry.service_charge_amount}
                                        </span>
                                    </div>
                                </td>

                                <td className="text-start align-middle">
                                    {entry.count}
                                </td>

                                <td className="text-start align-middle text-nowrap">
                                    <span className="fw-medium text-success">
                                        ₹{(entry.total_amount)}
                                    </span>
                                </td>

                                <td className="text-start align-middle text-nowrap">
                                    <span className="fw-medium text-success">
                                        ₹{getFinalAmount(entry.total_amount)}
                                    </span>
                                </td>


                                <td className="text-start align-middle">
                                    <div className="btn-group dropdown-icon-none">
                                        <button className="border-0 icon-btn dropdown-toggle" type="button"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-dots"></i>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button className="dropdown-item" onClick={() => handleEditAccount(entry)}>
                                                    <i className="ti ti-edit"></i> Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item" onClick={() => handleDeleteItem(entry.id, entry.type)}>
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
        </div>
    );
}
