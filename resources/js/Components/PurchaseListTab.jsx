import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { CreditCard, Edit, Eye, Trash } from 'lucide-react';
import React from 'react';
import { Table } from 'react-bootstrap';

const PurchaseListTab = ({ client, clientVendors, tableRef }) => {

  

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

 

    return (

        <>
          
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