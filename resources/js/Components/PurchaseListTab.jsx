import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import React from 'react';

const PurchaseListTab = ({ client, tableRef, handleEditAccount, handleDeleteItem }) => {

    const isImageFile = (filename) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    return (

        <>
            <table ref={tableRef} className="table table-striped text-start align-middle">
                <thead>
                    <tr>
                        <th className="text-start align-middle">Bill</th>

                        <th className="text-start align-middle">Vendor Name</th>
                        <th className="text-start align-middle">Purchase Date</th>
                        <th className="text-start align-middle">Bill Total</th>
                        <th className='text-start align-middle'>View</th>
                        <th className="text-start align-middle">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {client.purchase_lists.map(entry => ({
                        ...entry,
                        type: 'purchase-list'
                    })).map((entry) => {
                        const fileExtension = entry.bill ? getFileExtension(entry.bill) : null;

                        return (
                            <tr key={`${entry.type}-${entry.id}`} className="align-middle">

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
                                                            width: '50px',
                                                            height: '50px',
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
                                                        View {fileExtension.toUpperCase()} File
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted">No bill uploaded</span>
                                    )}
                                </td>

                                <td className="text-start align-middle">
                                    <div className="fw-medium">
                                        <Link href={route('purchase-list.show', entry.id)} className="text-decoration-none">
                                            {entry.vendor_name}
                                        </Link>
                                    </div>
                                </td>

                                <td className="text-start align-middle">
                                    {entry.purchase_date ? (
                                        new Date(entry.purchase_date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                    ) : (
                                        <span className="text-muted">N/A</span>
                                    )}
                                </td>

                                <td>
                                    {entry.bill_total !== null && entry.bill_total !== undefined ? (
                                        <div className="fw-medium">
                                            {entry.bill_total}
                                        </div>
                                    ) : (
                                        <span className="text-muted">N/A</span>
                                    )}
                                </td>



                                <td className="text-start align-middle">

                                    <Link href={route('purchase-list.show', entry.id)} className="text-decoration-none">
                                        <i className="ti ti-eye fs-4"></i>
                                    </Link>

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
                                                <Link
                                                    className="dropdown-item"
                                                    href={route('challan.show', entry.id)}
                                                >
                                                    <i className="ti ti-eye"></i> Challans
                                                </Link>
                                            </li>
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
                        )
                    }
                    )}
                </tbody>
            </table>

        </>

    );
};

export default PurchaseListTab;