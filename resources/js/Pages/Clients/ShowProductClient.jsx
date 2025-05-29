import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AccountTab from '@/Components/AccountTab';
import LedgerTab from '@/Components/LedgerTab';
import PdfTable from '@/Components/PdfTable';
import PurchaseListTab from '@/Components/PurchaseListTab';
import CostIncurredTab from '@/Components/CostIncurredTab';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';

export default function ShowClient({ client, modules = [], inventoryOptions = [], vendors = [], company_profile = null }) {


    const { delete: destroy } = useForm();
    const flash = usePage().props.flash;

    // State management
    const [state, setState] = useState({
        showAccountModal: false,
        showPurchaseListModal: false,
        showCostIncurredModal: false,
        isEditingAccount: false,
        isEditingPurchaseList: false,
        isEditingCostIncurred: false,
        currentAccountId: null,
        currentPurchaseListId: null,
        currentCostIncurredId: null,
        isLoading: false
    });

    // Refs
    const refs = {
        tableRef: useRef(null),
        accountRef: useRef(null),
        purchaseListRef: useRef(null),
        costIncurredRef: useRef(null)
    };

    // Form handlers
    const accountForm = useInertiaForm({
        client_id: client.id || '',
        type: 'inventory',
        inventory_id: '',
        module_id: '',
        item_name: '',
        selling_price: '',
        buying_price: '',
        count: '',
        service_charge: '',
        description: ''
    });

    const purchaseListForm = useInertiaForm({
        client_id: client.id || '',
        vendor_name: client.client_name,
        purchase_date: new Date().toISOString().split('T')[0],
        bill: null,
    });

    const costIncurredForm = useInertiaForm({
        client_id: client.id,
        entry_name: '',
        count: '',
        selling_price: '',
        buying_price: '',
    });

    useEffect(() => {
        const initializeDataTables = () => {
            // Only initialize DataTables on table elements
            const tables = [
                refs.accountRef.current?.querySelector('table'),
                refs.tableRef.current?.querySelector('table'),
                refs.purchaseListRef.current?.querySelector('table'),
                refs.costIncurredRef.current?.querySelector('table')
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
    }, [client.invoices, client.proformas, client.accounts, client.purchase_lists, client.cost_incurred]);

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    // Modal handlers
    const openModal = (type, item = null) => {
        switch (type) {
            case 'account':
                setState(prev => ({
                    ...prev,
                    showAccountModal: true,
                    isEditingAccount: !!item,
                    currentAccountId: item?.id || null
                }));
                accountForm.reset();
                if (item) accountForm.setData(item);
                break;

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

            case 'cost-incurred':
                setState(prev => ({
                    ...prev,
                    showCostIncurredModal: true,
                    isEditingCostIncurred: !!item,
                    currentCostIncurredId: item?.id || null
                }));
                costIncurredForm.reset();
                if (item) costIncurredForm.setData(item);
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
            case 'accounts':
                form = accountForm;
                isEditing = state.isEditingAccount;
                currentId = state.currentAccountId;
                break;
            case 'purchase-list':
                form = purchaseListForm;
                isEditing = state.isEditingPurchaseList;
                currentId = state.currentPurchaseListId;
                break;
            case 'cost-incurred':
                form = costIncurredForm;
                isEditing = state.isEditingCostIncurred;
                currentId = state.currentCostIncurredId;
                break;
            default:
                console.error(`Unknown form type: ${type}`);
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

    const handleSourceChange = (type, e) => {
        setState(prev => ({ ...prev, isLoading: true }));
        const source = type === 'inventory'
            ? inventoryOptions.find(item => item.id === parseInt(e.target.value))
            : modules.find(mod => mod.id === parseInt(e.target.value));

        if (source) {
            accountForm.setData({
                ...accountForm.data,
                [`${type}_id`]: source.id,
                item_name: type === 'inventory' ? source.item_name : source.module_name,
                selling_price: source.selling_price,
                buying_price: source.buying_price,
                count: source.count,
                description: type === 'inventory' ? source.item_dimensions : source.fields
            });
        }
        setState(prev => ({ ...prev, isLoading: false }));
    };

    const breadcrumbs = [
        { href: '/clients', label: 'Back', active: true }
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Client - ${client.client_name}`} />


            <div className="d-flex justify-content-between align-items-center">

                <BreadCrumbHeader
                    breadcrumbs={breadcrumbs}
                />


            </div>

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
                                <Link href={route('proforma.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-file-description me-2"></i> Proforma
                                </Link>
                            </li>
                            <li>
                                <Link href={route('bank-account.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-building-bank me-2"></i> Bank Account
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item" onClick={() => openModal('account')}>
                                    <i className="ti ti-building-bank me-2"></i> Account
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => openModal('purchase-list')}>
                                    <i className="ti ti-shopping-cart me-2"></i> Purchase List
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => openModal('cost-incurred')}>
                                    <i className="ti ti-cash-banknote me-2"></i> Cost Incurred
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Client Information and Summary */}
                <div className="row g-4 mb-4">

                    <ClientInfoCard client={client} />

                    {client.bank_account && <BankAccountCard BankProfile={client.bank_account} />}

                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <h5 className="card-title mb-0">PDF Report</h5>
                            </div>
                            <div className="card-body">
                                <div ref={refs.pdfRef}>
                                    <PdfTable client={client} pdfRef={refs.pdfRef} CompanyProfile={company_profile || {}} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Tabs Section */}
                <div className="card">
                    <div className="card-body p-2">
                        <ul className="nav nav-tabs tab-light-secondary" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#accounts-tab" type="button" role="tab">
                                    <i className="ti ti-lifebuoy me-1"></i> Accounts
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="tab" data-bs-target="#ledger-tab" type="button" role="tab">
                                    <i className="ti ti-keyboard-show me-1"></i> Ledger
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="tab" data-bs-target="#purchase-list-tab" type="button" role="tab">
                                    <i className="ti ti-shopping-cart me-1"></i> Purchase List
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="tab" data-bs-target="#cost-incurred-tab" type="button" role="tab">
                                    <i className="ti ti-cash-banknote me-1"></i> Cost Incurred
                                </button>
                            </li>
                        </ul>

                        <div className="tab-content p-3">
                            <div className="tab-pane fade show active" id="accounts-tab" role="tabpanel">
                                <AccountTab
                                    client={client}
                                    accountRef={refs.accountRef}
                                    handleEditAccount={(account) => openModal('account', account)}
                                    handleDeleteItem={handleDelete}
                                />

                            </div>

                            <div className="tab-pane fade" id="ledger-tab" role="tabpanel">
                                <LedgerTab
                                    client={client}
                                    tableRef={refs.tableRef}
                                    handleEditAccount={(account) => openModal('account', account)}
                                    handleDeleteItem={handleDelete}
                                />
                            </div>

                            <div className="tab-pane fade" id="purchase-list-tab" role="tabpanel">
                                <PurchaseListTab
                                    client={client}
                                    tableRef={refs.purchaseListRef}
                                    handleEditAccount={(purchase_list) => openModal('purchase-list', purchase_list)}
                                    handleDeleteItem={handleDelete}
                                />
                            </div>

                            <div className="tab-pane fade" id="cost-incurred-tab" role="tabpanel">
                                <CostIncurredTab
                                    client={client}
                                    tableRef={refs.costIncurredRef}
                                    handleEditAccount={(costIncurred) => openModal('cost-incurred', costIncurred)}
                                    handleDeleteItem={handleDelete}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AccountModal
                show={state.showAccountModal}
                onHide={() => setState(prev => ({ ...prev, showAccountModal: false }))}
                form={accountForm}
                errors={accountForm.errors}
                isLoading={state.isLoading}
                isEditing={state.isEditingAccount}
                inventoryOptions={inventoryOptions}
                modules={modules}
                handleSubmit={(e) => handleSubmit('accounts', e)}
                handleSourceChange={handleSourceChange}
            />

            <PurchaseListModal
                show={state.showPurchaseListModal}
                onHide={() => setState(prev => ({ ...prev, showPurchaseListModal: false }))}
                form={purchaseListForm}
                errors={purchaseListForm.errors}
                isEditing={state.isEditingPurchaseList}
                handleSubmit={(e) => handleSubmit('purchase-list', e)}
                vendors={vendors}
            />

            <CostIncurredModal
                show={state.showCostIncurredModal}
                onHide={() => setState(prev => ({ ...prev, showCostIncurredModal: false }))}
                form={costIncurredForm}
                errors={costIncurredForm.errors}
                isLoading={state.isLoading}
                isEditing={state.isEditingCostIncurred}
                handleSubmit={(e) => handleSubmit('cost-incurred', e)}
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
                            <i className="ti ti-edit"></i>
                        </Link>
                        <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
                            <i className="ti ti-trash"></i>
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
                        <i className="ti ti-edit"></i>
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

const AccountModal = ({
    show,
    onHide,
    form,
    errors,
    isLoading,
    isEditing,
    inventoryOptions,
    modules,
    handleSubmit,
    handleSourceChange
}) => (
    <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title>{isEditing ? 'Edit' : 'Create'} Account</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
            <Modal.Body className="pt-0">
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    id="inventory-type"
                                    label="Inventory"
                                    checked={form.data.type === 'inventory'}
                                    onChange={() => form.setData('type', 'inventory')}
                                />
                                <Form.Check
                                    type="radio"
                                    id="module-type"
                                    label="Module"
                                    checked={form.data.type === 'module'}
                                    onChange={() => form.setData('type', 'module')}
                                />
                            </div>
                        </Form.Group>

                        {form.data.type === 'inventory' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Select Inventory</Form.Label>
                                <Form.Select
                                    value={form.data.inventory_id}
                                    onChange={(e) => handleSourceChange('inventory', e)}
                                    disabled={isLoading}
                                    isInvalid={!!errors.inventory_id}
                                >
                                    <option value="">Select Inventory</option>
                                    {inventoryOptions.map(item => (
                                        <option key={item.id} value={item.id}>{item.item_name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.inventory_id}</Form.Control.Feedback>
                            </Form.Group>
                        )}

                        {form.data.type === 'module' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Select Module</Form.Label>
                                <Form.Select
                                    value={form.data.module_id}
                                    onChange={(e) => handleSourceChange('module', e)}
                                    disabled={isLoading}
                                    isInvalid={!!errors.module_id}
                                >
                                    <option value="">Select Module</option>
                                    {modules.map(mod => (
                                        <option key={mod.id} value={mod.id}>{mod.module_name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.module_id}</Form.Control.Feedback>
                            </Form.Group>
                        )}
                    </div>

                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                value={form.data.item_name}
                                onChange={(e) => form.setData('item_name', e.target.value)}
                                isInvalid={!!errors.item_name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.item_name}</Form.Control.Feedback>
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Selling Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={form.data.selling_price}
                                        onChange={(e) => form.setData('selling_price', e.target.value)}
                                        isInvalid={!!errors.selling_price}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.selling_price}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Buying Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={form.data.buying_price}
                                        onChange={(e) => form.setData('buying_price', e.target.value)}
                                        isInvalid={!!errors.buying_price}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.buying_price}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Count</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.data.count}
                                onChange={(e) => form.setData('count', e.target.value)}
                                isInvalid={!!errors.count}
                            />
                            <Form.Control.Feedback type="invalid">{errors.count}</Form.Control.Feedback>
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Service Charge (%)</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.data.service_charge}
                                onChange={(e) => form.setData('service_charge', e.target.value)}
                                isInvalid={!!errors.service_charge}
                            />
                            <Form.Control.Feedback type="invalid">{errors.service_charge}</Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>
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
                    </div>

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

const CostIncurredModal = ({
    show,
    onHide,
    form,
    errors,
    isLoading,
    isEditing,
    handleSubmit
}) => (
    <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title>{isEditing ? 'Edit' : 'Create'} Cost Incurred</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
            <Modal.Body className="pt-0">
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Entry Name</Form.Label>
                            <Form.Control
                                name="entry_name"
                                value={form.data.entry_name}
                                onChange={(e) => form.setData('entry_name', e.target.value)}
                                isInvalid={!!errors.entry_name}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.entry_name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Count</Form.Label>
                            <Form.Control
                                type="number"
                                name="count"
                                value={form.data.count}
                                onChange={(e) => form.setData('count', e.target.value)}
                                isInvalid={!!errors.count}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.count}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Selling Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="selling_price"
                                value={form.data.selling_price}
                                onChange={(e) => form.setData('selling_price', e.target.value)}
                                isInvalid={!!errors.selling_price}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.selling_price}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Buying Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="buying_price"
                                value={form.data.buying_price}
                                onChange={(e) => form.setData('buying_price', e.target.value)}
                                isInvalid={!!errors.buying_price}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.buying_price}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <input type="hidden" name="client_id" value={form.data.client_id} />
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onHide} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading || form.processing}>
                    {isLoading || form.processing ? (
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