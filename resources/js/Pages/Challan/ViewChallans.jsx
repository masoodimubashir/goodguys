import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button, Card, Table, Badge, Modal, Form, InputGroup } from 'react-bootstrap';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';

const ViewChallans = ({ product_list }) => {
    console.log('Product List:', product_list);


    const [editingChallan, setEditingChallan] = useState(null);
    const [formData, setFormData] = useState({
        service_charge: 0,
        challan_number: ''
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(route('challan.destroy', deleteId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteId(null);
            }
        });
    };

    const handleEdit = (challan) => {
        setEditingChallan(challan);
        setFormData({
            service_charge: challan.service_charge,
            challan_number: challan.challan_number
        });
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(route('challan.update', editingChallan.id), formData, {
            onSuccess: () => {
                setShowEditModal(false);
            }
        });
    };

    // Helper to calculate totals for a challan reference
    const getChallanTotals = (challanRef) => {
        // Find all items for this challan reference
        const items = challanRef.challans || [];
        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.unit_count), 0);
        // Calculate grand total with service charge
        const grandTotal = totalAmount + (totalAmount * (challanRef.service_charge || 0) / 100);
        return {
            totalAmount,
            grandTotal
        };
    };



    return (
        <AuthenticatedLayout>
            <Head title="View Challans" />
            <div className="container py-4">
                <Card className="shadow border-0 mb-4">

                    <Card.Body>
                        <div className="mb-4">
                            <Table bordered className="mb-0">
                                <tbody>
                                    <tr>
                                        <th width="20%">Vendor Name</th>
                                        <td>{product_list.vendor_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Purchase Date</th>
                                        <td>{new Date(product_list.purchase_date).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Bill Total</th>
                                        <td>₹{product_list.bill_total?.toLocaleString('en-IN') || '0'}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <Card className="">
                <Card.Body>
                    {product_list.challan_refrences?.length > 0 ? (
                        <div className="table-responsive">
                            <Table striped hover className="mb-0 align-middle">
                                <thead >
                                    <tr>
                                        <th>Challan No.</th>
                                        <th className="text-end">Service Charge</th>
                                        <th className="text-end">Total Amount</th>
                                        <th className="text-end">Grand Total</th>
                                        <th>Created At</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product_list.challan_refrences.map((ref) => {
                                        const { totalAmount, grandTotal } = getChallanTotals(ref);
                                        return (
                                            <tr key={ref.id}>
                                                <td className="fw-semibold">{ref.challan_number}</td>
                                                <td className="text-end">{ref.service_charge}%</td>
                                                <td className="text-end">₹{totalAmount.toLocaleString('en-IN')}</td>
                                                <td className="text-end">₹{grandTotal.toLocaleString('en-IN')}</td>
                                                <td>{new Date(ref.created_at).toLocaleString()}</td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Link href={route('challan.show', ref.id)}>
                                                            <Button variant="outline-info" size="sm" title="View Details">
                                                                <Eye size={16} />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline-warning"
                                                            size="sm"
                                                            title="Edit"
                                                            onClick={() => handleEdit(ref)}
                                                        >
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            title="Delete"
                                                            onClick={() => confirmDelete(ref.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No challans created yet for this purchase</p>
                            <Link href={route('challan.create', { purchase_list_id: product_list.id })}>
                                <Button variant="primary">
                                    <Plus size={16} className="me-1" /> Create First Challan
                                </Button>
                            </Link>
                        </div>
                    )}
                </Card.Body>
            </Card>
            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="bg-warning-subtle">
                    <Modal.Title>Edit Challan</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdate}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Challan Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.challan_number}
                                onChange={e => setFormData({ ...formData, challan_number: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Charge (%)</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                value={formData.service_charge}
                                onChange={e => setFormData({ ...formData, service_charge: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger-subtle">
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this challan? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default ViewChallans;