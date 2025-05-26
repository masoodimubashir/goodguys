import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button, Card, Table, Badge, Form } from 'react-bootstrap';
import { Trash2, Eye, FileText, Edit } from 'lucide-react';
import ChallanPdf from '../PDF/ChallanPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ChallanToPdf from '../PDF/ChallanToPdf';

const ViewChallans = ({ product_list }) => {


    const [deleteId, setDeleteId] = useState(null);
    const [selectedChallans, setSelectedChallans] = useState([]);

    const handleDelete = (id) => {
        router.delete(route('challan.destroy', id), {
            onSuccess: () => {
                setDeleteId(null);
                setSelectedChallans(selectedChallans.filter(challanId => challanId !== id));
            }
        });
    };

    const handleCheckboxChange = (challanId) => {
        setSelectedChallans(prev =>
            prev.includes(challanId)
                ? prev.filter(id => id !== challanId)
                : [...prev, challanId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedChallans(product_list.challan_refrences.map(ref => ref.id));
        } else {
            setSelectedChallans([]);
        }
    };

    console.log(selectedChallans);
    

    const getChallanTotals = (challanRef) => {
        const items = challanRef.challans || [];
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.unit_count), 0);
        const grandTotal = totalAmount + (totalAmount * (challanRef.service_charge || 0) / 100);
        return { totalAmount, grandTotal };
    };

    const getSelectedChallanData = () => {
        return product_list.challan_refrences
            .filter(ref => selectedChallans.includes(ref.id))
            .map(ref => ({
                ...ref,
                ...getChallanTotals(ref)
            }));
    };

    

    let totalAmount = 0;
    let totalServiceCharges = 0;
    let productsCount = 0;

    product_list.challan_refrences?.forEach(ref => {
        const items = ref.challans || [];
        const challanTotal = items.reduce((sum, item) => sum + (item.price * item.unit_count), 0);
        totalAmount += challanTotal;
        totalServiceCharges += (challanTotal * ref.service_charge) / 100;
        productsCount += items.reduce((sum, item) => sum + item.unit_count, 0);
    });

    return (
        <AuthenticatedLayout>
            <Head title="View Challans" />
            <div className="container-fluid py-4">


                {/* Challan Stats Cards */}
                <div className="row g-4 mb-4">
                    {/* Total Challans */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <div className="card border-0 shadow-sm card-hover h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="stats-icon bg-blue-light me-3">
                                        <FileText className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="small text-slate-600 mb-1">Total Challans</p>
                                        <h6 className="fw-bold text-slate-800 mb-0">
                                            {product_list.challan_refrences?.length || 0}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Card.Body className="p-0">

                    <Card.Header>
                        {/* Action Bar for Selected Challans */}
                        {selectedChallans.length > 0 && (
                            <div className="mb-3 rounded d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold">{selectedChallans.length}</span> challan(s) selected
                                </div>
                                <PDFDownloadLink
                                    document={
                                        <ChallanToPdf
                                            client={product_list.client}
                                            challans={getSelectedChallanData()}
                                        />
                                    }
                                    fileName={`combined-challans-${Date.now()}.pdf`}
                                >
                                    {({ loading }) => (
                                        <Button variant="primary" disabled={loading}>
                                            <FileText size={16} className="me-2" />
                                            {loading ? 'Generating PDF...' : 'Create Invoice'}
                                        </Button>
                                    )}
                                </PDFDownloadLink>
                            </div>
                        )}
                    </Card.Header>

                    <div className="table-responsive">
                        <Card.Body>
                            {product_list.challan_refrences?.length > 0 ? (
                                <div className="table-responsive">
                                    <Table hover bordered className="table-centered mb-0">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <Form.Check
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={
                                                            selectedChallans.length > 0 &&
                                                            selectedChallans.length === product_list.challan_refrences.length
                                                        }
                                                    />
                                                </th>
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
                                                        <td>
                                                            <Form.Check
                                                                type="checkbox"
                                                                checked={selectedChallans.includes(ref.id)}
                                                                onChange={() => handleCheckboxChange(ref.id)}
                                                            />
                                                        </td>
                                                        <td className="fw-semibold">{ref.challan_number}</td>
                                                        <td className="text-end">
                                                            <Badge bg="warning" text="dark">
                                                                {ref.service_charge}%
                                                            </Badge>
                                                        </td>
                                                        <td className="text-end">
                                                            ₹{totalAmount.toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="text-end text-success fw-bold">
                                                            ₹{grandTotal.toLocaleString('en-IN')}
                                                        </td>
                                                        <td>
                                                            {new Date(ref.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <Link href={route('challan.edit', ref.id)}>
                                                                    <Button variant="white" size="sm" title="View Details">
                                                                        <Edit size={16} className="text-primary" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    variant="white"
                                                                    size="sm"
                                                                    title="Delete"
                                                                    onClick={() => handleDelete(ref.id)}
                                                                >
                                                                    <Trash2 size={16} className="text-danger" />
                                                                </Button>

                                                                <PDFDownloadLink
                                                                    document={
                                                                        <ChallanPdf client={product_list.client} challan_refrence={ref} />
                                                                    }
                                                                    fileName={`${ref.id}.pdf`}
                                                                    className="dropdown-item d-flex align-items-center"
                                                                >
                                                                    <FileText size={16} className="text-primary" />
                                                                </PDFDownloadLink>
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
                                    <p className="text-muted">No challans found for this purchase.</p>
                                </div>
                            )}
                        </Card.Body>
                    </div>
                </Card.Body>
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewChallans;