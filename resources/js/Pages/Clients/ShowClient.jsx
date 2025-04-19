import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ClientDetails from '@/Components/ClientDetails';
import AccountTab from '@/Components/AccountTab';
import LedgerTab from '@/Components/LedgerTab';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import PdfTable from '@/Components/PdfTable';



export default function ShowClient({ client, modules = [], inventoryOptions = [] }) {


    const client_type = client?.service_charge ? 'Site Name' : 'Product Name';

    const [showAccountModal, setShowAccountModal] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);
    const [currentAccountId, setCurrentAccountId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const tableRef = useRef(null);
    const accountRef = useRef(null);
    const pdfRef = useRef(null);

    const { props } = usePage();
    const { flash } = props;

    const { delete: destroy } = useInertiaForm();

    const {
        data: accountForm,
        setData: setAccountForm,
        post: postAccount,
        put: putAccount,
        processing: processingAccount,
        errors: accountErrors,
        reset: resetAccountForm,
    } = useInertiaForm({
        client_id: client.id || '',
        inventory_id: '',
        item_name: '',
        selling_price: '',
        buying_price: '',
        count: '',
        service_charge: '',
        description: '',
    });

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    useEffect(() => {
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
        }

        $(tableRef.current).DataTable({
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],

        });

        if ($.fn.DataTable.isDataTable(accountRef.current)) {
            $(accountRef.current).DataTable().destroy();
        }
        $(accountRef.current).DataTable({
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],

        });

        if ($.fn.DataTable.isDataTable(pdfRef.current)) {
            $(pdfRef.current).DataTable().destroy();
        }
        $(pdfRef.current).DataTable({
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],

        });

    }, [client.invoices, client.proformas]);


    const openAccountModal = () => {
        resetAccountForm();
        setIsEditingAccount(false);
        setCurrentAccountId(null);
        setShowAccountModal(true);
    };

    const handleEditAccount = (account) => {
        setIsEditingAccount(true);
        setCurrentAccountId(account.id);
        setAccountForm({
            client_id: client.id,
            inventory_id: account.inventory_id,
            item_name: account.item_name,
            selling_price: account.selling_price,
            buying_price: account.buying_price,
            count: account.count,
            service_charge: account.service_charge,
            description: account.description,
        });
        setShowAccountModal(true);
    };



    const handleAccountSubmit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                resetAccountForm();
                setIsEditingAccount(false);
                setCurrentAccountId(null);
                setShowAccountModal(false);
                ShowMessage('success', `Account ${isEditingAccount ? 'updated' : 'created'} successfully`);
            },
        };

        if (isEditingAccount && currentAccountId) {
            putAccount(route('accounts.update', currentAccountId), options);
        } else {
            postAccount(route('accounts.store'), options);
        }
    };

    const handleDeleteItem = (itemId, type) => {

        let routeName = ''

        if (type === 'Invoice') {
            routeName = 'invoice.destroy';
        } else if (type === 'Proforma') {
            routeName = 'proforma.destroy';
        } else {
            routeName = 'accounts.destroy';
        }

        destroy(route(routeName, { id: itemId }), {
            preserveScroll: true,
            onSuccess: () => {

                if ($.fn.DataTable.isDataTable(tableRef.current)) {
                    $(tableRef.current).DataTable().destroy();
                }
                if ($.fn.DataTable.isDataTable(accountRef.current)) {
                    $(accountRef.current).DataTable().destroy();
                }

                ShowMessage('success', `${flash.message}`);
            },
            onError: () => {
                ShowMessage('error', `${flash.error}`);
            },
        });
    };



    const handleInventoryChange = async (e) => {
        setIsLoading(true);
        const selectedInventory = inventoryOptions.find(inv => inv.id === parseInt(e.target.value));
        if (selectedInventory) {
            setTimeout(() => {
                setAccountForm({
                    ...accountForm,
                    inventory_id: selectedInventory.id,
                    item_name: selectedInventory.item_name,
                    selling_price: selectedInventory.selling_price,
                    buying_price: selectedInventory.buying_price,
                    count: selectedInventory.count,
                    service_charge: 0,
                    description: selectedInventory.item_dimensions,
                });
                setIsLoading(false);
            }, 500);
        } else {
            setIsLoading(false);
        }
    };

    const handleModuleChange = async (e) => {
        setIsLoading(true);
        const selectedModule = modules.find(mod => mod.id === parseInt(e.target.value));
        if (selectedModule) {
            setTimeout(() => {
                setAccountForm({
                    ...accountForm,
                    module_id: selectedModule.id,
                    item_name: selectedModule.module_name,
                    selling_price: selectedModule.selling_price,
                    buying_price: selectedModule.buying_price,
                    count: selectedModule.count,
                    service_charge: 0,
                    description: selectedModule.fields,
                });
                setIsLoading(false);
            }, 500);
        } else {
            setIsLoading(false);
        }
    };


    return (

        <AuthenticatedLayout>

            <Head title={`Client`} />

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div className="d-flex gap-2">

                    <div className="dropdown">

                        <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Create
                        </button>

                        <ul className="dropdown-menu">

                            <li>
                                <Link href={route('invoice.create', { client_id: client?.id })} className="dropdown-item">
                                    <i className="ti ti-file-invoice me-2"></i> Invoice
                                </Link>
                            </li>

                            <li>
                                <Link href={route('proforma.create', { client_id: client?.id })} className="dropdown-item">
                                    <i className="ti ti-file-description me-2"></i> Proforma
                                </Link>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>

                                <button className="dropdown-item" onClick={openAccountModal}>
                                    <i className="ti ti-building-bank me-2"></i> Account
                                </button>

                            </li>

                        </ul>

                    </div>

                </div>

            </div>

            {/* Client Information and Summary */}
            <div className="row g-4">

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
                                        <h5 className="mb-0">{client?.client_name}</h5>
                                        <p className="text-muted mb-0">{client_type}: {client?.site_name ?? 'NA'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <h6 className="text-uppercase text-muted fs-12 mb-2">Contact Details</h6>
                                <div className="d-flex mb-2">
                                    <i className="ti ti-mail text-muted me-2 mt-1"></i>
                                    <div>
                                        <p className="mb-0">{client?.client_email}</p>
                                    </div>
                                </div>
                                <div className="d-flex mb-2">
                                    <i className="ti ti-phone text-muted me-2 mt-1"></i>
                                    <div>
                                        <p className="mb-0">{client?.client_phone}</p>
                                    </div>
                                </div>
                                <div className="d-flex mb-2">
                                    <i className="ti ti-map-pin text-muted me-2 mt-1"></i>
                                    <div>
                                        <p className="mb-0">{client?.client_address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <h6 className="text-uppercase text-muted fs-12 mb-2">Billing Info</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tax Rate:</span>
                                    <span>{client?.tax}%</span>
                                </div>
                                {client?.service_charge?.service_charge !== undefined && (
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Service Charge:</span>
                                        <span>{client?.service_charge.service_charge}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex flex-column">
                                <Link href={route('clients.edit', client?.id)} className="btn btn-outline-primary mb-2">
                                    <i className="ti ti-edit me-1"></i> Edit Client
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-2 ">Financial Summary</h5>
                        </div>
                        <div className="card-body">
                            <div ref={pdfRef}>
                                {/* PdfTable component would be rendered here */}
                                <div>
                                    <PdfTable
                                        client={client}
                                        pdfRef={pdfRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card equal-card">
                <div className="card-body">
                    <ul className="nav nav-tabs app-tabs-primary" id="Basic" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="html-tab" data-bs-toggle="tab"
                                data-bs-target="#html-tab-pane" type="button" role="tab" aria-controls="html-tab-pane"
                                aria-selected="true">Accounts</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="css-tab" data-bs-toggle="tab" data-bs-target="#css-tab-pane"
                                type="button" role="tab" aria-controls="css-tab-pane" aria-selected="false">Ledger</button>
                        </li>
                    </ul>

                    <div className="tab-content" id="BasicContent">
                        <AccountTab
                            client={client}
                            accountRef={accountRef}
                            handleEditAccount={handleEditAccount}
                            handleDeleteItem={handleDeleteItem}
                        />
                        <LedgerTab
                            client={client}
                            tableRef={tableRef}
                            handleEditAccount={handleEditAccount}
                            handleDeleteItem={handleDeleteItem}
                        />
                    </div>
                </div>
            </div>


            <Modal show={showAccountModal} onHide={() => setShowAccountModal(false)} backdrop="static" keyboard={false}>

                <Modal.Header closeButton>
                    <Modal.Title>{isEditingAccount ? 'Edit' : 'Create'} Account</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleAccountSubmit} className="p-3">

                    <Form.Group className="pb-2 mt-2">
                        <Form.Label>Type</Form.Label>
                        <div>
                            <Form.Check inline label="Inventory" type="radio" id="inventory" name="type" value="inventory" checked={accountForm.type === 'inventory'} onChange={(e) => setAccountForm('type', e.target.value)} />
                            <Form.Check inline label="Module" type="radio" id="module" name="type" value="module" checked={accountForm.type === 'module'} onChange={(e) => setAccountForm('type', e.target.value)} />
                        </div>
                    </Form.Group>


                    {accountForm.type === 'inventory' && (
                        <Form.Group className="pb-2 mt-2">
                            <Form.Label>Select Inventory</Form.Label>
                            <Form.Select value={accountForm.inventory_id} onChange={handleInventoryChange} disabled={isLoading}>
                                <option value="">Select Inventory</option>
                                {inventoryOptions.map((item) => (
                                    <option key={item.id} value={item.id}>{item.item_name}</option>
                                ))}
                            </Form.Select>
                            {isLoading && <div className="text-muted">Loading...</div>}
                        </Form.Group>
                    )}

                    {accountForm.type === 'module' && (
                        <Form.Group className="pb-2">
                            <Form.Label>Select Module</Form.Label>
                            <Form.Select value={accountForm.module_id} onChange={handleModuleChange} disabled={isLoading}>
                                <option value="">Select Module</option>
                                {modules.map((mod) => (
                                    <option key={mod.id} value={mod.id}>{mod.module_name}</option>
                                ))}
                            </Form.Select>
                            {isLoading && <div className="text-muted">Loading...</div>}
                        </Form.Group>
                    )}

                    <Form.Group className="pb-2">
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={accountForm.item_name}
                            onChange={(e) => setAccountForm('item_name', e.target.value)}
                            isInvalid={!!accountErrors.item_name}
                        />
                        <Form.Control.Feedback type="invalid">{accountErrors.item_name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="pb-2">
                        <Form.Label>Selling Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={accountForm.selling_price}
                            onChange={(e) => setAccountForm('selling_price', e.target.value)}
                            isInvalid={!!accountErrors.selling_price}
                        />
                        <Form.Control.Feedback type="invalid">{accountErrors.selling_price}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label>Buying Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={accountForm.buying_price}
                            onChange={(e) => setAccountForm('buying_price', e.target.value)}
                            isInvalid={!!accountErrors.buying_price}
                        />
                        <Form.Control.Feedback type="invalid">{accountErrors.buying_price}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label>Count</Form.Label>
                        <Form.Control
                            type="number"
                            value={accountForm.count}
                            onChange={(e) => setAccountForm('count', e.target.value)}
                            isInvalid={!!accountErrors.count}
                        />
                        <Form.Control.Feedback type="invalid">{accountErrors.count}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label>Service Charge(%)</Form.Label>
                        <Form.Control
                            type="number"
                            value={accountForm.service_charge}
                            onChange={(e) => setAccountForm('service_charge', e.target.value)}
                            isInvalid={!!accountErrors.service_charge}
                        />
                        <Form.Control.Feedback type="invalid">{accountErrors.service_charge}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={accountForm.description}
                            onChange={(e) => setAccountForm('description', e.target.value)}
                            isInvalid={!!accountErrors.description}
                        />
                        <Form.Control.Feedback type="invalid">{accountErrors.description}</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" disabled={processingAccount} className="mt-3">
                        {isEditingAccount ? 'Update' : 'Create'} Account
                    </Button>
                </Form>
            </Modal>

        </AuthenticatedLayout >


    );
}
