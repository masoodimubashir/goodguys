import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PurchaseListTab from '@/Components/PurchaseListTab';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';

export default function ShowClient({ client, modules = [], inventoryOptions = [], vendors = [], company_profile = null }) {


    const { delete: destroy } = useForm();
    const flash = usePage().props.flash;

    // State management
    const [state, setState] = useState({
        showPurchaseListModal: false,
        isEditingPurchaseList: false,
        currentAccountId: null,
        currentPurchaseListId: null,
        isLoading: false
    });

    // Refs
    const refs = {
        tableRef: useRef(null),
        purchaseListRef: useRef(null),
    };

    const purchaseListForm = useInertiaForm({
        client_id: client.id || '',
        vendor_name: client.client_name,
        purchase_date: new Date().toISOString().split('T')[0],
        bill: null,
        bill_total: '',
        bill_description: '',
    });



    useEffect(() => {
        const initializeDataTables = () => {
            // Only initialize DataTables on table elements
            const tables = [
                refs.tableRef.current?.querySelector('table'),
                refs.purchaseListRef.current?.querySelector('table'),
            ].filter(Boolean); // Remove null/undefined

            tables.forEach(table => {
                if ($.fn.DataTable.isDataTable(table)) {
                    $(table).DataTable().destroy();
                }
                $(table).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]]
                });
            });
        };

        initializeDataTables();

        // Cleanup function to destroy DataTables when component unmounts
        return () => {
            $('.dataTable').DataTable().destroy().clear();
        };
    }, [client.invoices, client.proformas, client.purchase_lists]);

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    // Modal handlers
    const openModal = (type, item = null) => {
        switch (type) {

            case 'purchase-list':
                setState(prev => ({
                    ...prev,
                    showPurchaseListModal: true,
                    isEditingPurchaseList: !!item,
                    currentPurchaseListId: item?.id || null
                }));
                purchaseListForm.reset();
                if (item) purchaseListForm.setData(item);
                break;

            default:
                break;
        }
    };

    // Form submission handlers
    const handleSubmit = async (type, e) => {

        e.preventDefault();

        let form, isEditing, currentId;

        switch (type) {

            case 'purchase-list':
                form = purchaseListForm;
                isEditing = state.isEditingPurchaseList;
                currentId = state.currentPurchaseListId;
                break;

            default:
                return;
        }

        const formData = new FormData();
        for (const key in form.data) {
            if (form.data[key] !== null) {
                formData.append(key, form.data[key]);
            }
        }

        const pascalType = type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setState(prev => ({
                    ...prev,
                    [`show${pascalType}Modal`]: false,
                    [`isEditing${pascalType}`]: false,
                    [`current${pascalType}Id`]: null
                }));
                ShowMessage('success', `${type.replace('-', ' ')} ${isEditing ? 'updated' : 'created'} successfully`);
            }
        };



        if (isEditing && currentId) {
            formData.append('_method', 'PUT');
            router.post(route(`${type}.update`, currentId), formData, options);
        } else {
            form.post(route(`${type}.store`), formData, options);
        }
    };

    // Delete handler
    const handleDelete = (itemId, type) => {
        const url = type + '.' + 'destroy';
        destroy(route(url, itemId), {
            preserveScroll: true,
            onSuccess: () => {
                Object.values(refs).forEach(ref => {
                    if (ref.current && $.fn.DataTable.isDataTable(ref.current)) {
                        $(ref.current).DataTable().ajax.reload();
                    }
                });
            }
        });
    };



    return (
        <AuthenticatedLayout>
            <Head title={`Client - ${client.client_name}`} />

            {/* Main Content */}
            <div className="container-fluid py-4">
                {/* Action Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Client Details</h2>
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Create
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link href={route('invoice.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-file-invoice me-2"></i> Invoice
                                </Link>
                            </li>
                          
                            <li>
                                <Link href={route('bank-account.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-building-bank me-2"></i> Bank Account
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <button className="dropdown-item" onClick={() => openModal('purchase-list')}>
                                    <i className="ti ti-shopping-cart me-2"></i> Purchase List
                                </button>
                            </li>




                        </ul>
                    </div>
                </div>

                {/* Client Information and Summary */}
                <div className="row g-4 mb-4">

                    <ClientInfoCard client={client} />

                    {client.bank_account && <BankAccountCard BankProfile={client.bank_account} />}

                </div>

                {/* Tabs Section */}

                        <PurchaseListTab
                            client={client}
                            tableRef={refs.purchaseListRef}
                            handleEditAccount={(purchase_list) => openModal('purchase-list', purchase_list)}
                            handleDeleteItem={handleDelete}
                        />

            </div>



            <PurchaseListModal
                show={state.showPurchaseListModal}
                onHide={() => setState(prev => ({ ...prev, showPurchaseListModal: false }))}
                form={purchaseListForm}
                errors={purchaseListForm.errors}
                isEditing={state.isEditingPurchaseList}
                handleSubmit={(e) => handleSubmit('purchase-list', e)}
                vendors={vendors}
            />




        </AuthenticatedLayout>
    );
}

const BankAccountCard = ({ BankProfile }) => {

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this Bank Account?')) {
            router.delete(route('bank-account.destroy', BankProfile.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="col-md-8">
            <div className="card shadow-sm h-100">
                <div className="card-header  d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Bank Account</h5>
                    <div className="d-flex gap-2">
                        <Link href={route('bank-account.edit', BankProfile.id)} className="btn btn-sm btn-outline-primary">
                            <i className="ti ti-edit me-1"></i> Edit
                        </Link>
                        <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
                            <i className="ti ti-trash me-1"></i> Delete
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-sm bg-primary-subtle text-primary rounded-circle me-3 d-flex align-items-center justify-content-center">
                            <i className="ti ti-building-bank fs-4"></i>
                        </div>
                        <div>
                            <h5 className="mb-1">{BankProfile.holder_name}</h5>
                            <p className="text-muted mb-0">{BankProfile.bank_name}</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6 className="text-uppercase text-muted fs-12 mb-2">Account Details</h6>
                                <p className="mb-1"><span className="text-muted">Account No:</span> {BankProfile.account_number || 'NA'}</p>
                                <p className="mb-1"><span className="text-muted">Branch Code:</span> {BankProfile.branch_code}</p>
                                <p className="mb-1"><span className="text-muted">IFSC Code:</span> {BankProfile.ifsc_code}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6 className="text-uppercase text-muted fs-12 mb-2">Other Details</h6>
                                <p className="mb-1"><span className="text-muted">Swift Code:</span> {BankProfile.swift_code}</p>
                                <p className="mb-1"><span className="text-muted">UPI Address:</span> {BankProfile.upi_address}</p>
                                <p className="mb-1"><span className="text-muted">Tax Number:</span> {BankProfile.tax_number}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientInfoCard = ({ client }) => {


    const client_type = client?.service_charge ? 'Site Name' : 'Product Name';

    return (
        <div className="col-md-4">
            <div className="card shadow-sm h-100">
                <div className="card-header  d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Client Information</h5>
                    <Link href={route('clients.edit', client.id)} className="btn btn-sm btn-outline-primary">
                        <i className="ti ti-edit me-1"></i> Edit
                    </Link>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-sm bg-primary-subtle text-primary rounded-circle me-3 d-flex align-items-center justify-content-center">
                            <i className="ti ti-user-circle fs-4"></i>
                        </div>
                        <div>
                            <h5 className="mb-1">{client.client_name}</h5>
                            <p className="text-muted mb-0">{client_type}: {client.site_name || 'NA'}</p>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h6 className="text-uppercase text-muted fs-12 mb-2">Contact Details</h6>
                        <div className="d-flex align-items-center mb-2">
                            <i className="ti ti-mail text-muted me-2"></i>
                            <span>{client.client_email || 'N/A'}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <i className="ti ti-phone text-muted me-2"></i>
                            <span>{client.client_phone || 'N/A'}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="ti ti-map-pin text-muted me-2"></i>
                            <span>{client.client_address || 'N/A'}</span>
                        </div>
                    </div>

                    {client.service_charge?.service_charge !== undefined && (
                        <div className="alert alert-info py-2">
                            <div className="d-flex justify-content-between">
                                <span>Service Charge:</span>
                                <strong>{client.service_charge.service_charge}%</strong>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const PurchaseListModal = ({
    show,
    onHide,
    form,
    errors,
    isEditing,
    handleSubmit,
    vendors
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('bill', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title>{isEditing ? 'Edit' : 'Create'} Purchase List</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                <Modal.Body className="pt-0">
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Vendor Name</Form.Label>
                                <Form.Control
                                    value={form.data.vendor_name}
                                    onChange={(e) => form.setData('vendor_name', e.target.value)}
                                    isInvalid={!!errors.vendor_name}
                                />
                                <Form.Control.Feedback type="invalid">{errors.vendor_name}</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Purchase Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={form.data.purchase_date}
                                    onChange={(e) => form.setData('purchase_date', e.target.value)}
                                    isInvalid={!!errors.purchase_date}
                                />
                                <Form.Control.Feedback type="invalid">{errors.purchase_date}</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Bill Total</Form.Label>
                                <Form.Control
                                    type="integer"
                                    value={form.data.bill_total}
                                    onChange={(e) => form.setData('bill_total', e.target.value)}
                                    isInvalid={!!errors.bill_total}
                                />
                                <Form.Control.Feedback type="invalid">{errors.bill_total}</Form.Control.Feedback>
                            </Form.Group>
                        </div>


                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Bill</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                    isInvalid={!!errors.bill}
                                    accept="image/*,application/pdf"
                                />
                                <Form.Control.Feedback type="invalid">{errors.bill}</Form.Control.Feedback>

                                {(previewUrl || form.data.bill_url) && (
                                    <div className="mt-2">
                                        <a
                                            href={previewUrl || form.data.bill_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <i className="ti ti-file me-1"></i>
                                            {previewUrl ? 'Preview File' : 'View Current File'}
                                        </a>
                                    </div>
                                )}
                            </Form.Group>
                        </div>

                        <div className="col-md-12">
                            <Form.Group className="mb-3">
                                <Form.Label>Bill Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    value={form.data.bill_description}
                                    onChange={(e) => form.setData('bill_description', e.target.value)}
                                    isInvalid={!!errors.bill_description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.bill_description}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>

                    </div>


                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={onHide}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={form.processing}>
                        {form.processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                Processing...
                            </>
                        ) : isEditing ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};



