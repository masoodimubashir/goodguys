import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProformaPdf } from '../PDF/ProformaPdf';
import { InvoicePdf } from '../PDF/InvoicePdf';
import ClientDetails from '@/Components/ClientDetails';

export default function ShowClient({ client, modules = [], inventoryOptions = [] }) {

    const [showProformaModal, setShowProformaModal] = useState(false);
    const [isEditingProforma, setIsEditingProforma] = useState(false);
    const [currentProformaId, setCurrentProformaId] = useState(null);

    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [isEditingInvoice, setIsEditingInvoice] = useState(false);
    const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

    const [showAccountModal, setShowAccountModal] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);
    const [currentAccountId, setCurrentAccountId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);


    const tableHead = ['Created At', 'Item Name', 'Selling Price', 'Total Price', 'Due', 'Actions'];

    const tableRef = useRef(null);
    const accountRef = useRef(null);
    const { props } = usePage();
    const { flash } = props;

    const { delete: destroy } = useInertiaForm();

    const {
        data: proformaForm,
        setData: setProformaForm,
        post: postProforma,
        put: putProforma,
        processing: processingProforma,
        errors: proformaErrors,
        reset: resetProformaForm,
    } = useInertiaForm({
        client_id: client.id,
        module_id: '',
        item_name: '',
        description: '',
        count: '',
        price: '',
        tax: '',
        service_charge: '',
    });

    const {
        data: invoiceForm,
        setData: setInvoiceForm,
        post: postInvoice,
        put: putInvoice,
        processing: processingInvoice,
        errors: invoiceErrors,
        reset: resetInvoiceForm,
    } = useInertiaForm({
        client_id: client.id || '',
        module_id: '',
        item_name: '',
        description: '',
        count: '',
        price: '',
        tax: '',
        service_charge: '',
        invoice_number: '',
        issue_date: '',
    });

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
    }, [client.invoices, client.proformas]);


    const openProformaModal = () => {
        resetProformaForm();
        setIsEditingProforma(false);
        setCurrentProformaId(null);
        setShowProformaModal(true);
    };
    const openAccountModal = () => {
        resetAccountForm();
        setIsEditingAccount(false);
        setCurrentAccountId(null);
        setShowAccountModal(true);
    };
    const openInvoiceModal = () => {
        resetInvoiceForm();
        setIsEditingInvoice(false);
        setCurrentInvoiceId(null);
        setShowInvoiceModal(true);
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
        });
        setShowAccountModal(true);
    };

    const handleEditProforma = (proforma) => {
        setIsEditingProforma(true);
        setCurrentProformaId(proforma.id);
        setProformaForm({
            client_id: client.id,
            module_id: proforma.module_id,
            item_name: proforma.item_name,
            description: proforma.description,
            count: proforma.count,
            price: proforma.price,
            tax: proforma.tax,
            service_charge: proforma.service_charge,
        });
        setShowProformaModal(true);
    };

    const handleEditInvoice = (invoice) => {
        setIsEditingInvoice(true);
        setCurrentInvoiceId(invoice.id);
        setInvoiceForm({
            client_id: client.id,
            module_id: invoice.module_id,
            item_name: invoice.item_name,
            description: invoice.description,
            count: invoice.count,
            price: invoice.price,
            tax: invoice.tax,
            service_charge: invoice.service_charge,
            invoice_number: invoice.invoice_number || '',
            issue_date: invoice.issue_date || '',
        });
        setShowInvoiceModal(true);
    };

    const handleProformaSubmit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                resetProformaForm();
                setIsEditingProforma(false);
                setCurrentProformaId(null);
                setShowProformaModal(false);
                ShowMessage('success', `Proforma ${isEditingProforma ? 'updated' : 'created'} successfully`);
            },
        };

        if (isEditingProforma && currentProformaId) {
            putProforma(route('proforma.update', currentProformaId), options);
        } else {
            postProforma(route('proforma.store'), options);
        }
    };

    const handleInvoiceSubmit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                resetInvoiceForm();
                setIsEditingInvoice(false);
                setCurrentInvoiceId(null);
                setShowInvoiceModal(false);
                ShowMessage('success', `Invoice ${isEditingInvoice ? 'updated' : 'created'} successfully`);
            },
        };

        if (isEditingInvoice && currentInvoiceId) {
            putInvoice(route('invoice.update', currentInvoiceId), options);
        } else {
            postInvoice(route('invoice.store'), options);
        }
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

    const renderFormFields = (formData, setFormData, errors) => (
        <>
            <Form.Group>
                <Form.Label>Module</Form.Label>
                <Form.Select
                    value={formData.module_id}
                    onChange={(e) => setFormData('module_id', e.target.value)}
                    isInvalid={!!errors.module_id}
                >
                    <option value="">Select Module</option>
                    {modules.map((mod) => (
                        <option key={mod.id} value={mod.id}>{mod.module_name}</option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.module_id}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.item_name}
                    onChange={(e) => setFormData('item_name', e.target.value)}
                    isInvalid={!!errors.item_name}
                />
                <Form.Control.Feedback type="invalid">{errors.item_name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData('description', e.target.value)}
                    isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Count</Form.Label>
                <Form.Control
                    type="number"
                    value={formData.count}
                    onChange={(e) => setFormData('count', e.target.value)}
                    isInvalid={!!errors.count}
                />
                <Form.Control.Feedback type="invalid">{errors.count}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData('price', e.target.value)}
                    isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Tax</Form.Label>
                <Form.Control
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData('tax', e.target.value)}
                    isInvalid={!!errors.tax}
                />
                <Form.Control.Feedback type="invalid">{errors.tax}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Service Charge</Form.Label>
                <Form.Control
                    type="number"
                    value={formData.service_charge}
                    onChange={(e) => setFormData('service_charge', e.target.value)}
                    isInvalid={!!errors.service_charge}
                />
                <Form.Control.Feedback type="invalid">{errors.service_charge}</Form.Control.Feedback>
            </Form.Group>
            {'invoice_number' in formData && (
                <>
                    <Form.Group>
                        <Form.Label>Issue Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.issue_date}
                            onChange={(e) => setFormData('issue_date', e.target.value)}
                            isInvalid={!!errors.issue_date}
                        />
                        <Form.Control.Feedback type="invalid">{errors.issue_date}</Form.Control.Feedback>
                    </Form.Group>
                </>
            )}
        </>
    );


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

            <div className="d-flex justify-content-end align-items-center mb-4 mt-4 gap-2">
                <Button variant="primary btn-sm" onClick={openProformaModal}>Add Proforma</Button>
                <Button variant="success btn-sm" onClick={openInvoiceModal}>Add Invoice</Button>
                <Button variant="success btn-sm" onClick={openAccountModal}>Create Account</Button>
            </div>

            <ClientDetails client={client} />


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
                        <div className="tab-pane fade show active" id="html-tab-pane" role="tabpanel"
                            aria-labelledby="html-tab" tabIndex="0">

                            <div className="app-scroll table-responsive">

                                <table ref={accountRef} className="table table-striped">

                                    <thead>
                                        <tr>
                                            {tableHead.map((head, index) => (
                                                <th key={index}>{head}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {[
                                            ...client.invoices.map(inv => ({ ...inv, type: 'Invoice' })),
                                            ...client.proformas.map(pf => ({ ...pf, type: 'Proforma' })),
                                            ...client.accounts.map(acc => ({ ...acc, type: 'Account' })),
                                        ].map((entry) => (

                                            <tr key={`${entry.type}-${entry.id}`}>

                                                <td>
                                                    {entry.created_at
                                                        ? new Date(entry.created_at).toLocaleString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour12: true,
                                                        })
                                                        : "N/A"}
                                                </td>

                                                <td>
                                                    {entry.item_name}
                                                </td>

                                                <td>
                                                    {entry.selling_price}
                                                </td>

                                                <td>
                                                    {entry.selling_price} * {entry.count} = {entry.selling_price * entry.count}
                                                </td>

                                                <td>
                                                    {(entry.selling_price + entry.service_charge_amount) * entry.count}
                                                </td>

                                                <td>
                                                    <div className="btn-group dropdown-icon-none">
                                                        <button
                                                            className="btn border-0 icon-btn dropdown-toggle"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="true"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="ti ti-dots-vertical"></i>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() =>
                                                                        handleEditAccount(entry)
                                                                    }
                                                                >
                                                                    <i className="ti ti-edit"></i> Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() =>

                                                                        handleDeleteItem(entry.id, entry.type)
                                                                    }
                                                                >
                                                                    <i className="ti ti-trash"></i> Delete
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <PDFDownloadLink
                                                                    document={
                                                                        entry.type === 'Invoice'
                                                                            ? <InvoicePdf client={client} />
                                                                            : <ProformaPdf client={client} />
                                                                    }
                                                                    fileName={`${entry.type.toLowerCase()}-${entry.id}.pdf`}
                                                                    className="dropdown-item"
                                                                >
                                                                    {({ loading }) => (
                                                                        <>
                                                                            <i className="ti ti-download"></i>{' '}
                                                                            {loading ? 'Loading...' : `Download ${entry.type}`}
                                                                        </>
                                                                    )}
                                                                </PDFDownloadLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="tab-pane fade" id="css-tab-pane" role="tabpanel" aria-labelledby="css-tab"
                            tabIndex="0">

                            <div className="app-scroll table-responsive">

                                <table ref={tableRef} className="table table-striped">

                                    <thead>

                                        <tr>
                                            <th>Created At</th>
                                            <th>Item Name</th>
                                            <th>Selling Price</th>
                                            <th>Buying Price</th>
                                            <th>Selling Price + Service Charge</th>
                                            <th>Count</th>
                                            <th>Total Price</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {[
                                            ...client.accounts.map(acc => ({ ...acc, type: 'Account' })),
                                        ].map((entry) => (
                                            <tr key={`${entry.type}-${entry.id}`}>

                                                <td>
                                                    {entry.created_at
                                                        ? new Date(entry.created_at).toLocaleString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour12: true,
                                                        })
                                                        : "N/A"}
                                                </td>

                                                <td>
                                                    {entry.item_name}
                                                </td>

                                                <td>
                                                    {entry.selling_price}
                                                </td>

                                                <td>
                                                    {entry.buying_price}
                                                </td>

                                                <td>
                                                    {entry.buying_price} + {entry.service_charge_amount} = {entry.selling_price + entry.service_charge_amount}
                                                </td>

                                                <td>
                                                    {entry.count}
                                                </td>

                                                <td>
                                                    {(entry.selling_price + entry.service_charge_amount) * entry.count}
                                                </td>

                                                <td>
                                                    <div className="btn-group dropdown-icon-none">
                                                        <button
                                                            className="btn border-0 icon-btn dropdown-toggle"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="true"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="ti ti-dots-vertical"></i>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() =>
                                                                        handleEditAccount(entry)
                                                                    }
                                                                >
                                                                    <i className="ti ti-edit"></i> Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() =>

                                                                        handleDeleteItem(entry.id, entry.type)
                                                                    }
                                                                >
                                                                    <i className="ti ti-trash"></i> Delete
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <PDFDownloadLink
                                                                    document={
                                                                        entry.type === 'Invoice'
                                                                            ? <InvoicePdf client={client} />
                                                                            : <ProformaPdf client={client} />
                                                                    }
                                                                    fileName={`${entry.type.toLowerCase()}-${entry.id}.pdf`}
                                                                    className="dropdown-item"
                                                                >
                                                                    {({ loading }) => (
                                                                        <>
                                                                            <i className="ti ti-download"></i>{' '}
                                                                            {loading ? 'Loading...' : `Download ${entry.type}`}
                                                                        </>
                                                                    )}
                                                                </PDFDownloadLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Modal show={showProformaModal} onHide={() => setShowProformaModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingProforma ? 'Edit' : 'Add'} Proforma</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleProformaSubmit} className="p-3">
                    {renderFormFields(proformaForm, setProformaForm, proformaErrors)}
                    <Button type="submit" disabled={processingProforma} className="mt-3">
                        {isEditingProforma ? 'Update' : 'Create'} Proforma
                    </Button>
                </Form>
            </Modal>

            <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingInvoice ? 'Edit' : 'Add'} Invoice</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleInvoiceSubmit} className="p-3">
                    {renderFormFields(invoiceForm, setInvoiceForm, invoiceErrors)}
                    <Button type="submit" disabled={processingInvoice} className="mt-3">
                        {isEditingInvoice ? 'Update' : 'Create'} Invoice
                    </Button>
                </Form>
            </Modal>

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
