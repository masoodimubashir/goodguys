import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { CreditCard, Edit, Eye, Trash } from 'lucide-react';
import React from 'react';
import { Button, Table } from 'react-bootstrap';

const PurchaseListTab = ({ client, clientVendors, tableRef, openPurchaseListModal }) => {



    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };



    return (

        <>

            <div className="d-flex justify-content-end align-items-center mb-2">
              
                <div className="d-flex gap-2">
                    <Button variant="outline-success" size="sm" onClick={() => openPurchaseListModal()}>
                        <i className="ti ti-shopping-cart me-1"></i> Add List
                    </Button>
                </div>
            </div>



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
                                    <small className="text-muted"> <br />
                                        {new Date(entry.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </small>
                                </td>

                                <td className="text-start align-middle">
                                    <div className="fw-medium">
                                        <Link href={route('purchase-list.show', entry.id)} className="text-decoration-none">
                                            {entry.contact_number}
                                        </Link>
                                    </div>
                                </td>

                                <td className="text-start align-middle">
                                    {entry.email}
                                </td>

                                <td className="text-start align-middle">
                                    {entry.description}
                                </td>

                                <td className="text-start align-middle">
                                    <Link href={route('purchase-list.index', ({ client_id: client?.id, vendor_id: entry.id }))}>
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