import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { CreditCard, Edit, Eye, Trash } from 'lucide-react';
import React from 'react';
import { Table } from 'react-bootstrap';

const PurchaseListTab = ({ client, clientVendors, tableRef }) => {

    console.log('Client Vendors', clientVendors);



    const isImageFile = (filename) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    const cal_total_with_service_charge = (total, service_charge) => {
        return (total + (total * service_charge / 100));
    }

    return (

        <>
            {/* <Table bordered size='sm' ref={tableRef} className="table table-striped text-start align-middle">
                <thead>
                    <tr>
                        <th className="text-start align-middle">Bill Proof</th>
                        <th className="text-start align-middle">Vendor Name</th>
                        <th className="text-start align-middle">List Name</th>
                        <th className="text-start align-middle">Purchase Date</th>
                        <th className="text-start align-middle">Bill Total</th>
                        <th className="text-start align-middle">Total with Service Charge</th>
                        <th className='text-start align-middle'>View</th>
                        <th className="text-start align-middle">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {client_vendors.map(entry => ({ ...entry, type: 'purchase-list' })).map((entry) => {
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
                                    {entry.vendor.vendor_name}
                                </td>
                                <td className="text-start align-middle">
                                    <div className="fw-medium">
                                        <Link href={route('purchase-list.show', entry.id)} className="text-decoration-none">
                                            {entry.list_name}
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


                                <td>
                                    {cal_total_with_service_charge(entry.bill_total, client.service_charge.service_charge)}
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
                                                    <Eye size={14}/> Challans
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={route('purchase-managment.index', ({ purchase_list_id: entry.id }))} className="dropdown-item">
                                                    <CreditCard size={14}/>  View Purchases
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleEditAccount(entry)}
                                                >
                                                    <Edit size={14}/> Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleDeleteItem(entry.id, entry.type)}
                                                >
                                                    <Trash size={14}/> Delete
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
            </Table> */}


            <Table bordered size='md' ref={tableRef} className="table table-striped text-start align-middle">
                <thead>
                    <tr>
                        <th className="text-start align-middle">Vendor Name</th>
                        <th className="text-start align-middle">Contact Number</th>
                        <th className="text-start align-middle">Email</th>
                        <th className="text-start align-middle">Description</th>
                        <th className="text-start align-middle">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clientVendors.map(entry => {
                        const fileExtension = entry.bill ? getFileExtension(entry.bill) : null;

                        return (
                            <tr key={`purchase-list-${entry.id}`} className="align-middle">


                                <td className="text-start align-middle">
                                    {entry.vendor_name}
                                </td>

                                <td className="text-start align-middle">
                                    <div className="fw-medium">
                                        <Link href={route('purchase-list.show', entry.id)} className="text-decoration-none">
                                            {entry.contact_number}
                                        </Link>
                                    </div>
                                </td>

                                {/* <Link href={route('purchase-list.show', entry.id)} className="text-decoration-none">
                                    <i className="ti ti-eye fs-4"></i>
                                </Link> */}

                                <td className="text-start align-middle">
                                    {entry.email}
                                </td>

                                <td className="text-start align-middle">
                                    {entry.description}
                                </td>

                                <td className="text-start align-middle">
                                    <Link href={route('purchase-list.index', ({ vendor_id: entry.id }))}>
                                        <Eye className='text-success' size={20} />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>


        </>

    );
};

export default PurchaseListTab;