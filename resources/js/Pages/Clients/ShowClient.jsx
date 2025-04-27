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

export default function ShowClient({ client, modules = [], inventoryOptions = [], vendors = [] }) {
    console.log(client);
    

    const { delete: destroy } = useForm();

    const flash = usePage().props.flash;

    // State management
    const [state, setState] = useState({
        showAccountModal: false,
        showPurchaseListModal: false,
        isEditingAccount: false,
        isEditingPurchaseList: false,
        currentAccountId: null,
        currentPurchaseListId: null,
        isLoading: false
    });

    // Refs
    const refs = {
        tableRef: useRef(null),
        accountRef: useRef(null),
        pdfRef: useRef(null),
        purchaseListRef: useRef(null),
        CostIncurredRef : useRef(null)
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
        bill: null, // Change from empty string to null for file inputs
    });

    // Initialize DataTables
    useEffect(() => {
        const initializeDataTables = () => {
            Object.values(refs).forEach(ref => {
                if ($.fn.DataTable.isDataTable(ref.current)) {
                    $(ref.current).DataTable().destroy();
                }
                $(ref.current).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]]
                });
            });
        };

        initializeDataTables();
    }, [client.invoices, client.proformas]);

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    // Modal handlers
    const openModal = (type, item = null) => {

        if (type === 'account') {
            setState(prev => ({
                ...prev,
                showAccountModal: true,
                isEditingAccount: !!item,
                currentAccountId: item?.id || null
            }));
            accountForm.reset();
            if (item) accountForm.setData(item);
        } else {
            setState(prev => ({
                ...prev,
                showPurchaseListModal: true,
                isEditingPurchaseList: !!item,
                currentPurchaseListId: item?.id || null
            }));
            purchaseListForm.reset();
            if (item) purchaseListForm.setData(item);
        }
    };

    // Form submission handlers
    const handleSubmit = async (type, e) => {
        e.preventDefault();
        const form = type === 'accounts' ? accountForm : purchaseListForm;
        const isEditing = type === 'accounts' ? state.isEditingAccount : state.isEditingPurchaseList;
        const id = type === 'accounts' ? state.currentAccountId : state.currentPurchaseListId;

        // Create FormData for file uploads
        const formData = new FormData();
        for (const key in form.data) {
            if (form.data[key] !== null) {
                formData.append(key, form.data[key]);
            }
        }

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setState(prev => ({
                    ...prev,
                    [`show${type.charAt(0).toUpperCase() + type.slice(1)}Modal`]: false,
                    [`isEditing${type.charAt(0).toUpperCase() + type.slice(1)}`]: false,
                    [`current${type.charAt(0).toUpperCase() + type.slice(1)}Id`]: null
                }));
                ShowMessage('success', `${type.replace('-', ' ')} ${isEditing ? 'updated' : 'created'} successfully`);
            }
        };

        if (isEditing && id) {
            // For updates, use POST with _method=PUT
            formData.append('_method', 'PUT');
            router.post(route(`${type}.update`, id), formData, options);
        } else {
            form.post(route(`${type}.store`), formData, options);
        }
    };

    // Delete handler
    const handleDelete = (itemId, type) => {
        const routeMap = {
            'Invoice': 'invoice.destroy',
            'Proforma': 'proforma.destroy',
            'Account': 'accounts.destroy',
            'PurchaseList': 'purchase-list.destroy'
        };

        destroy(route(routeMap[type], { id: itemId }), {
            preserveScroll: true,
            onSuccess: () => {
                // Check if refs exists before attempting to use it
                if (refs && typeof refs === 'object') {
                    Object.values(refs).forEach(ref => {
                        if (ref && ref.current && $.fn.DataTable.isDataTable(ref.current)) {
                            $(ref.current).DataTable().destroy();
                        }
                    });
                }
                ShowMessage('success', flash.message);
            },
            onError: () => {
                ShowMessage('error', flash.error);
            }
        });
    };
    // Inventory/module change handlers
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

    return (
        <AuthenticatedLayout>
            <Head title={`Client - ${client.client_name}`} />

            {/* Action Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2">
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Create
                        </button>
                        <ul className="dropdown-menu">
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
                                <Button href={route('cost-incurred.create', { client_id: client.id })} className="dropdown-item">
                                    <i className="ti ti-file-description me-2"></i> Cost Incurred
                                </Button>
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
                        </ul>
                    </div>
                </div>
            </div>

            {/* Client Information and Summary */}
            <div className="row g-4">
                <ClientInfoCard client={client} />

                <div className="col-12">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-2">Financial Summary</h5>
                        </div>
                        <div className="card-body">
                            <div ref={refs.pdfRef}>
                                <PdfTable client={client} pdfRef={refs.pdfRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <ul className="nav nav-tabs tab-light-secondary justify-content-around" id="justify-Light"
                            role="tablist">
                            <li className="nav-item flex-fill" role="presentation">
                                <button className="nav-link active w-100" id="justify-home-tab" data-bs-toggle="tab"
                                    data-bs-target="#justify-home-tab-pane" type="button" role="tab"
                                    aria-controls="justify-home-tab-pane" aria-selected="true"> <i
                                        className="ti ti-lifebuoy pe-1 ps-1"></i> Accounts</button>
                            </li>
                            <li className="nav-item flex-fill" role="presentation">
                                <button className="nav-link w-100" id="justify-profile-tab" data-bs-toggle="tab"
                                    data-bs-target="#justify-profile-tab-pane" type="button" role="tab"
                                    aria-controls="justify-profile-tab-pane" aria-selected="false"> <i
                                        className="ti ti-keyboard-show pe-1 ps-1"></i> Ledger </button>
                            </li>
                            <li className="nav-item flex-fill" role="presentation">
                                <button className="nav-link w-100" id="justify-contact-tab" data-bs-toggle="tab"
                                    data-bs-target="#justify-contact-tab-pane" type="button" role="tab"
                                    aria-controls="justify-contact-tab-pane" aria-selected="false"><i
                                        className="ti ti-file-dislike pe-1 ps-1"></i>Purchase List</button>
                            </li>
                            <li className="nav-item flex-fill" role="presentation">
                                <button className="nav-link w-100" id="justify-about-tab" data-bs-toggle="tab"
                                    data-bs-target="#justify-about-tab-pane" type="button" role="tab"
                                    aria-controls="justify-about-tab-pane" aria-selected="false"><i
                                        className="ti ti-ball-basketball pe-1 ps-1"></i>Cost Incurred</button>
                            </li>

                        </ul>
                        <div className="tab-content" id="justify-LightContent">
                            <div className="tab-pane fade show active" id="justify-home-tab-pane" role="tabpanel"
                                aria-labelledby="justify-home-tab" tabIndex="0">
                                <AccountTab
                                    client={client}
                                    accountRef={refs.accountRef}
                                    handleEditAccount={(account) => openModal('account', account)}
                                    handleDeleteItem={handleDelete}
                                />
                            </div>

                            <div className="tab-pane fade" id="justify-profile-tab-pane" role="tabpanel"
                                aria-labelledby="justify-profile-tab" tabIndex="0">
                                <LedgerTab
                                    client={client}
                                    tableRef={refs.tableRef}
                                    handleEditAccount={(account) => openModal('account', account)}
                                    handleDeleteItem={handleDelete}
                                />
                            </div>

                            <div className="tab-pane fade" id="justify-contact-tab-pane" role="tabpanel"
                                aria-labelledby="justify-contact-tab" tabIndex="0">
                                <PurchaseListTab
                                    client={client}
                                    tableRef={refs.purchaseListRef}
                                    handleEditAccount={(purchase_list) => openModal('purchase-list', purchase_list)}
                                    handleDeleteItem={handleDelete}
                                />
                            </div>

                            <div className="tab-pane fade" id="justify-about-tab-pane" role="tabpanel"
                                aria-labelledby="justify-about-tab" tabIndex="0">
                                <CostIncurredTab
                                    client={client}
                                    tableRef={refs.CostIncurredRef}
                                    handleEditAccount={(purchase_list) => openModal('purchase-list', purchase_list)}
                                    handleDeleteItem={handleDelete}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>



            {/* Account Modal */}
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

            {/* Purchase List Modal */}
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

// Extracted ClientInfoCard component
const ClientInfoCard = ({ client }) => {
    const client_type = client?.service_charge ? 'Site Name' : 'Product Name';

    return (
        <div className="col-md-4">
            <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                    <h5 className="card-title mb-2">Client Information</h5>
                </div>
                <div className="card-body">
                    <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex align-items-center mb-3">
                            <div className="avatar-sm bg-primary-subtle text-primary rounded-circle me-3 d-flex align-items-center justify-content-center">
                                <i className="ti ti-building-skyscraper fs-4"></i>
                            </div>
                            <div>
                                <h5 className="mb-0">{client.client_name}</h5>
                                <p className="text-muted mb-0">{client_type}: {client.site_name || 'NA'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h6 className="text-uppercase text-muted fs-12 mb-2">Contact Details</h6>
                        <ContactDetail icon="ti ti-mail" text={client.client_email} />
                        <ContactDetail icon="ti ti-phone" text={client.client_phone} />
                        <ContactDetail icon="ti ti-map-pin" text={client.client_address} />
                    </div>

                    <div className="mb-3">
                        <h6 className="text-uppercase text-muted fs-12 mb-2">Billing Info</h6>
                        {client.service_charge?.service_charge !== undefined && (
                            <InfoRow label="Service Charge:" value={`${client.service_charge.service_charge}%`} />
                        )}
                    </div>

                    <Link href={route('clients.edit', client.id)} className="btn btn-outline-primary">
                        <i className="ti ti-edit me-1"></i> Edit Client
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Extracted AccountModal component
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
    <Modal show={show} onHide={onHide} backdrop="static" size="lg">
        <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Edit' : 'Create'} Account</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Inventory"
                                    type="radio"
                                    checked={form.data.type === 'inventory'}
                                    onChange={() => form.setData('type', 'inventory')}
                                />
                                <Form.Check
                                    inline
                                    label="Module"
                                    type="radio"
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
                            <Form.Label>Service Charge(%)</Form.Label>
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
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Processing...' : (isEditing ? 'Update' : 'Create')}
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
);

// Extracted PurchaseListModal component
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
        <Modal show={show} onHide={onHide} backdrop="static" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit' : 'Create'} Purchase List</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                <Modal.Body>
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
                                    className="text-primary"
                                >
                                    {previewUrl ? 'Preview File' : 'View Current File'}
                                </a>
                            </div>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Processing...' : (isEditing ? 'Update' : 'Create')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

// Helper components
const ContactDetail = ({ icon, text }) => (
    <div className="d-flex mb-2">
        <i className={`${icon} text-muted me-2 mt-1`}></i>
        <div><p className="mb-0">{text || 'N/A'}</p></div>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">{label}</span>
        <span>{value}</span>
    </div>
);