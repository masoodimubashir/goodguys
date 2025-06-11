import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button, Card, Table, Badge, Form, Modal, Row, Col, ProgressBar } from 'react-bootstrap';
import { Trash2, FileText, Edit,Calendar, CreditCard } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ChallanPdf from '../PDF/ChallanPdf';
import ChallanToInvoice from '../PDF/ChallanToInvoice';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import Swal from 'sweetalert2';
import { ClientInfoCard } from '@/Components/ClientInfoCard';

const ViewChallans = ({ client, company_profile, bankAccount }) => {

    const [selectedChallans, setSelectedChallans] = useState([]);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    // Calculate client statistics
    const clientStats = {

        totalChallans: client.challan_refrences.length,
        totalInvoices: client.invoices?.length || 0,

        balance: client.challan_refrences.reduce((sum, ref) => {
            const items = ref.challans || [];
            // Filter out credited items
            const filteredItems = items.filter(item => item.is_credited === 0);

            let inTotal = 0, outTotal = 0;

            filteredItems.forEach(item => {
                const qty = parseFloat(item.qty) || 0;
                const price = parseFloat(item.price) || 0;
                const unitType = item.unit_type;

                const value = qty > 1 ? price * qty : price;

                if (unitType === 'in') {
                    inTotal += value;
                } else if (unitType !== 'in') {
                    outTotal += value;
                }
            });

            // Calculate service charge on outTotal only
            const serviceCharge = parseFloat(ref.service_charge) || 0;
            const serviceChargeAmount = outTotal * serviceCharge / 100;
            const outWithServiceCharge = outTotal + serviceChargeAmount;

            // Final balance: inTotal - outWithServiceCharge
            const balance = inTotal - outWithServiceCharge;

            return sum + balance;
        }, 0),

        spends: client.challan_refrences.reduce((sum, ref) => {
            const items = ref.challans || [];
            // Filter out credited items
            const filteredItems = items.filter(item => item.is_credited === 0);

            let inTotal = 0, outTotal;

            filteredItems.forEach(item => {
                const qty = parseFloat(item.qty) || 0;
                const price = parseFloat(item.price) || 0;
                const unitType = item.unit_type;

                const value = qty > 1 ? price * qty : price;

                if (unitType === 'in') {
                    inTotal += value;
                }

            });

            // Calculate service charge on outTotal only
            const serviceCharge = parseFloat(ref.service_charge) || 0;
            const serviceChargeAmount = outTotal * serviceCharge / 100;
            const outWithServiceCharge = outTotal + serviceChargeAmount;

            // Final balance: inTotal - outWithServiceCharge
            const balance = inTotal - outWithServiceCharge;

            return sum + balance;
        }, 0),


    };


    // Handle checkbox selection
    const handleCheckboxChange = (challanId) => {
        setSelectedChallans(prev =>
            prev.includes(challanId)
                ? prev.filter(id => id !== challanId)
                : [...prev, challanId]
        );
    };

    // Select all/deselect all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedChallans(client.challan_refrences.map(ref => ref.id));
        } else {
            setSelectedChallans([]);
        }
    };

    // Calculate totals for selected challans
    const calculateSelectedTotals = () => {
        return client.challan_refrences
            .filter(ref => selectedChallans.includes(ref.id))
            .reduce((acc, ref) => {
                const items = ref.challans || [];
                const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                const serviceCharge = subtotal * (ref.service_charge || 0) / 100;
                const total = subtotal + serviceCharge;

                return {
                    subtotal: acc.subtotal + subtotal,
                    serviceCharge: acc.serviceCharge + serviceCharge,
                    total: acc.total + total,
                    items: [...acc.items, ...items.map(item => ({
                        ...item,
                        challan_number: ref.challan_number,
                        service_charge: ref.service_charge
                    }))]
                };
            }, { subtotal: 0, serviceCharge: 0, total: 0, items: [] });
    };

    // Prepare invoice data
    const prepareInvoiceData = () => {
        const selectedRefs = client.challan_refrences.filter(ref => selectedChallans.includes(ref.id));
        return {
            client_id: client.id,
            invoice_number: invoiceData.invoice_number,
            invoice_date: invoiceData.invoice_date,
            due_date: invoiceData.due_date,
            service_charge: client?.service_charge?.service_charge,
            items: selectedRefs.flatMap(ref =>
                ref.challans.map(item => ({
                    id: item.id,
                    description: item.description,
                    qty: item.qty,
                    price: item.price,
                    challan_reference: ref.challan_number,
                    is_price_visible: item.is_price_visible,
                    challan_refrence_id: ref.id,
                    unit_type: item.unit_type,
                    created_by: client.created_by,
                    updated_by: client.updated_by,
                    total: item.price * item.qty,
                    narration: item.narration,
                    is_credited: item.is_credited,
                }))
            ),
            subtotal: calculateSelectedTotals().subtotal,
            tax: calculateSelectedTotals().serviceCharge,
            total: calculateSelectedTotals().total
        };
    };

    const data = prepareInvoiceData();
    

    // Create invoice
    const createInvoice = () => {
        router.post(route('invoices.store'), prepareInvoiceData(), {
            onSuccess: () => {
                setShowInvoiceModal(false);
                setSelectedChallans([]);
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('challan.destroy', id));
            }
        })

    };


    const breadcrumbs = [
        { href: `/clients/${client.id}`, label: 'Back', active: false },
        { href: ``, label: `${client.client_name}`, active: true }
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`${client.client_name} - Challans`} />
            <div className="container-fluid py-4">

                <BreadCrumbHeader
                    breadcrumbs={breadcrumbs}
                />
                {/* Client Information Card */}
                <Card className="mb-4">
                    <Card.Body>
                        <ClientInfoCard client={client} />
                    </Card.Body>
                </Card>

                {/* Client Analytics */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted mb-2">Total Challans</h6>
                                        <h3 className="mb-0">{clientStats.totalChallans}</h3>
                                    </div>
                                    <div className="bg-primary bg-opacity-10 p-3 rounded">
                                        <FileText size={20} className="text-white" />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted mb-2">Total Invoices</h6>
                                        <h3 className="mb-0">{clientStats.totalInvoices}</h3>
                                    </div>
                                    <div className="bg-success bg-opacity-10 p-3 rounded">
                                        <CreditCard size={20} className="text-white" />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted mb-2">Total Billed</h6>
                                        <h3 className="mb-0">₹{clientStats.balance.toLocaleString('en-IN')}</h3>
                                    </div>
                                    <div className="bg-info bg-opacity-10 p-3 rounded">
                                        <Calendar size={20} className="text-white" />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>

                {/* Challans Table */}
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6>Challan Selected
                            ({selectedChallans.length})
                        </h6>
                        <div className="d-flex gap-2 mb-2">
                            {selectedChallans.length > 0 && (
                                <>

                                    <PDFDownloadLink
                                        document={
                                            <ChallanToInvoice
                                                company_profile={company_profile}
                                                data={data}
                                                client={client}
                                                bankAccount={bankAccount}
                                            />
                                        }
                                        fileName={`${client.client_name}.pdf`}
                                    >
                                        {({ loading }) => (
                                            <Button variant="secondary" disabled={loading} size='sm'>
                                                <FileText size={16} className="me-2" />
                                                {loading ? 'Generating...' : 'Download Invoice'}
                                            </Button>
                                        )}
                                    </PDFDownloadLink>
                                </>
                            )}

                        </div>
                    </div>

                    <Table hover responsive size='sm' bordered >
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={
                                            selectedChallans.length > 0 &&
                                            selectedChallans.length === client.challan_refrences.length
                                        }
                                    />
                                </th>
                                <th>Challan No.</th>
                                <th>Date</th>
                                <th className="text-end">Items</th>
                                <th className="text-end">Billed Amount  </th>
                                <th className="text-end">Service Charge</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {client.challan_refrences.map((ref) => {
                                const items = ref.challans || [];
                                // Filter out credited items
                                const filteredItems = items.filter(item => item.is_credited === 0);

                                let inTotal = 0, outTotal = 0;

                                filteredItems.forEach(item => {
                                    const qty = parseFloat(item.qty) || 0;
                                    const price = parseFloat(item.price) || 0;
                                    const unitType = item.unit_type;

                                    const value = qty > 1 ? price * qty : price;

                                    if (unitType === 'in') {
                                        inTotal += value;
                                    } else if (unitType !== 'in') {
                                        outTotal += value;
                                    }
                                });

                                // Calculate service charge on outTotal only (not on subtotal)
                                const serviceRate = Number(ref.service_charge) || 0;
                                const serviceCharge = outTotal * serviceRate / 100;
                                const outWithServiceCharge = outTotal + serviceCharge;
                                const balance = inTotal - outWithServiceCharge;

                                // Calculate visible subtotal (only items with is_price_visible)
                                const visibleSubtotal = filteredItems.reduce((sum, item) => {
                                    if (item.is_price_visible) {
                                        const qty = parseFloat(item.qty) || 0;
                                        const price = parseFloat(item.price) || 0;
                                        return sum + (qty > 1 ? price * qty : price);
                                    }
                                    return sum;
                                }, 0);

                                const isInvoiced = ref.invoice_id !== null;


                                return (
                                    <tr key={ref.id}>
                                        <td>
                                            {!isInvoiced && (
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedChallans.includes(ref.id)}
                                                    onChange={() => handleCheckboxChange(ref.id)}
                                                    disabled={isInvoiced}
                                                />
                                            )}
                                        </td>
                                        <td>
                                            {ref.challan_number}

                                        </td>
                                        <td>{new Date(ref.created_at).toLocaleDateString()}</td>

                                        <td className="text-end">{items.length}</td>
                                        <td className="text-end">₹{outWithServiceCharge.toLocaleString('en-IN')}</td>
                                        <td className="text-end">
                                            <Badge bg="warning" text="dark">
                                                ₹{serviceCharge.toLocaleString('en-IN')} ({ref.service_charge}%)
                                            </Badge>
                                        </td>

                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">

                                                <Link href={route('challan.edit', ref.id)}>
                                                    <Edit size={20} />
                                                </Link>

                                                <Trash2 size={20} className="text-danger" title="Delete"
                                                    onClick={() => {
                                                        handleDelete(ref.id);
                                                    }}
                                                />

                                                <PDFDownloadLink
                                                    document={
                                                        <ChallanPdf
                                                            company_profile={company_profile}
                                                            challan={ref}
                                                            client={client}
                                                            bankAccount={bankAccount}
                                                        />
                                                    }
                                                    fileName={`${client.client_name}.pdf`}
                                                >
                                                    {({ loading }) => (
                                                        <FileText size={20} className="me-2" />
                                                    )}
                                                </PDFDownloadLink>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>


            </div>
        </AuthenticatedLayout>
    );
};

export default ViewChallans;