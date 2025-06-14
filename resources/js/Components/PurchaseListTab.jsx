import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { CreditCard, Edit, Eye, Link2, Pen, Trash, View } from 'lucide-react';
import React from 'react';
import { Button, Table, Tooltip } from 'react-bootstrap';

const PurchaseListTab = ({ client, clientVendors, tableRef }) => {



    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };


    return (

        <>


            <Table bordered size='md' ref={tableRef} className="table table-striped text-start align-middle">
                <thead>
                    <tr>
                        <th className="text-start align-middle">Party Name</th>
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

                                        <Link className='text-primary' href={route('purchase-list.index', ({ client_id: client?.id, vendor_id: entry.id }))}>
                                            {entry.vendor_name}
                                        </Link>

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
                                        {entry.contact_number}
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
                                        <Pen className='text-success' size={25} />
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