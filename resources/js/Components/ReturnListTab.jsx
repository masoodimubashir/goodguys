// components/ReturnListTab.jsx
import React from 'react';

export default function ReturnListTab({ client, tableRef, handleEditAccount, handleDeleteItem }) {
    // Helper function to check if file is an image
    const isImageFile = (filename) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    };

    // Helper function to get file extension
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    // Flatten the return lists data from purchase lists
    const returnLists = client.purchase_lists
        .filter(purchase => purchase.return_lists && purchase.return_lists.length > 0)
        .flatMap(purchase => 
            purchase.return_lists.map(returnItem => ({
                ...returnItem,
                purchase_list_id: purchase.id,
                type: 'return-list'
            }))
        );

    return (
        <div className="app-scroll table-responsive">
            <table ref={tableRef} className="table table-striped text-start align-middle">
                <thead>
                    <tr>
                        <th className="text-start align-middle">Created At</th>
                        <th className="text-start align-middle">Vendor Name</th>
                        <th className="text-start align-middle">Return Date</th>
                        <th className="text-start align-middle">Bill Total</th>
                        <th className="text-start align-middle">Bill</th>
                        <th className="text-start align-middle">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {returnLists.length > 0 ? (
                        returnLists.map((entry) => {
                            const fileExtension = entry.bill ? getFileExtension(entry.bill) : null;

                            return (
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
                                        <div className="fw-medium">{entry.vendor_name}</div>
                                    </td>

                                    <td className="text-start align-middle">
                                        {entry.return_date ? (
                                            new Date(entry.return_date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                        ) : (
                                            <span className="text-muted">N/A</span>
                                        )}
                                    </td>

                                    <td className="text-start align-middle">
                                        {entry.bill_total ? (
                                            <div className="fw-medium">{entry.bill_total}</div>
                                        ) : (
                                            <span className="text-muted">N/A</span>
                                        )}
                                    </td>

                                    <td className="text-start align-middle">
                                        {entry.bill ? (
                                            <div className="d-flex align-items-center">
                                                {isImageFile(entry.bill) ? (
                                                    <div className="position-relative">
                                                        <img
                                                            src={`/storage/${entry.bill}`}
                                                            alt="Bill preview"
                                                            className="img-thumbnail cursor-pointer"
                                                            style={{
                                                                width: '60px',
                                                                height: '60px',
                                                                objectFit: 'cover'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/images/default-file.png';
                                                            }}
                                                        />
                                                        <a
                                                            href={`/storage/${entry.bill}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="stretched-link"
                                                            title="View full size"
                                                        ></a>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className={`ti ti-file-type-${fileExtension} fs-4`}></i>
                                                        <a
                                                            href={`/storage/${entry.bill}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary"
                                                        >
                                                            View {fileExtension?.toUpperCase()} File
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted">No bill uploaded</span>
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
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                <div className="d-flex flex-column align-items-center">
                                    <i className="ti ti-archive fs-1 text-muted mb-2"></i>
                                    <p className="text-muted">No return lists found</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}