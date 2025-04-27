// components/AccountTab.jsx
import React from 'react';

export default function AccountTab({ client, accountRef, handleEditAccount, handleDeleteItem }) {

    const tableHead = ['Created At', 'Item Name', 'Selling Price', 'Selling Price + Service Charge', 'Total Price', 'Total Price (Service Charge + Tax)', 'Actions'];



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
            <div className="app-scroll table-responsive">
                <table ref={accountRef} className="table table-striped text-start align-middle">
                    <thead>
                        <tr>
                            {tableHead.map((head, index) => (
                                <th key={index} className="text-start align-middle">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ...client.accounts.map(acc => ({ ...acc, type: 'Account' }))].map((entry) => (
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
                                            ₹{Number(entry.selling_price)}
                                        </span>
                                    </td>

                                    <td className="text-start align-middle text-nowrap">
                                        <div className="d-flex align-items-center">
                                            <span className="text-secondary"> ₹{Number(entry.selling_price)}</span>
                                            <i className="ti ti-x mx-1 text-muted small"></i>
                                            <span className="badge bg-light text-dark">{entry.count}</span>
                                            <i className="ti ti-equal mx-1 text-muted small"></i>
                                            <span className="fw-medium"> ₹{Number(entry.selling_price * entry.count)}</span>
                                        </div>
                                    </td>

                                    <td className="text-start align-middle text-nowrap">
                                        <span className="fw-medium text-success">
                                            ₹{entry.total_amount}

                                        </span>
                                    </td>


                                    <td className="text-start align-middle text-nowrap">
                                        <span className="fw-medium text-success">
                                            ₹{getFinalAmount(entry.total_amount)}
                                        </span>
                                    </td>




                                    <td className="text-start align-middle">
                                        <div className="btn-group dropdown-icon-none">
                                            <button className="btn btn-sm btn-light-subtle border-0 rounded-circle icon-btn"
                                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="ti ti-dots"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow-sm">

                                                <li>
                                                    <button className="dropdown-item d-flex align-items-center"
                                                        onClick={() => handleEditAccount(entry)}>
                                                        <i className="ti ti-edit me-2 text-primary"></i> Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item d-flex align-items-center"
                                                        onClick={() => handleDeleteItem(entry.id, entry.type)}>
                                                        <i className="ti ti-trash me-2 text-danger"></i> Delete
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
}
