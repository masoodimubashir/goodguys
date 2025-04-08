import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProformaPdf } from '../PDF/ProformaPdf';
import { InvoicePdf } from '../PDF/InvoicePdf';
import ClientDetails from '@/Components/ClientDetails';
import AccountTab from '@/Components/AccountTab';
import LedgerTab from '@/Components/LedgerTab';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import PdfTable from '@/Components/PdfTable';



export default function ShowClient({ client, modules = [], inventoryOptions = [] }) {



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

            <div className="d-flex justify-content-end align-items-center mb-4 mt-4 gap-2">
                {/* <Button variant="primary btn-sm" onClick={openProformaModal}>Add Proforma</Button> */}
                {/* <Button variant="success btn-sm" onClick={openInvoiceModal}>Add Invoice</Button> */}
                <Link
                    href={route('invoice.create', { client_id: client.id })}
                    className="btn btn-sm btn-primary"
                >
                    <i className="ti ti-plus me-1"></i> Create Invoice
                </Link>

                <Link
                    href={route('proforma.create', { client_id: client.id })}
                    className="btn btn-sm btn-primary"
                >
                    <i className="ti ti-plus me-1"></i> Create Proforma
                </Link>

                <Button variant="success btn-sm" onClick={openAccountModal}>Create Account</Button>

            </div>


            <div className="row">
                <div className="col-md-4">
                    <ClientDetails client={client} />
                </div>
                <div className="col-md-8">
                    <div className='card equal-card'>
                        <div className="card-body">
                            <PdfTable
                                client={client}
                                pdfRef={pdfRef}
                            />
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


            {/* <Modal show={showProformaModal} onHide={() => setShowProformaModal(false)}>
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
            </Modal> */}

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
