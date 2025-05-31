import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage, useForm as useInertiaForm, router, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import AccountTab from '@/Components/AccountTab';
import LedgerTab from '@/Components/LedgerTab';
import PdfTable from '@/Components/PdfTable';
import CostIncurredTab from '@/Components/CostIncurredTab';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { ClientInfoCard } from '@/Components/ClientInfoCard';
import { BankAccountCard } from '@/Components/BankAccountCard';
import { Plus, FileText, PieChart, DollarSign, CreditCard, Activity, Building, Download } from 'lucide-react';

export default function ShowClient({ client, modules = [], inventoryOptions = [], vendors = [], company_profile = null }) {
    const { delete: destroy } = useForm();
    const flash = usePage().props.flash;

    // State management
    const [editingRow, setEditingRow] = useState({
        type: null,
        id: null,
        data: null
    });

    // Refs
    const refs = {
        tableRef: useRef(null),
        accountRef: useRef(null),
        costIncurredRef: useRef(null)
    };

    // Calculate analytics
    const analytics = {
        totalInvoices: client.invoice_refrences?.length || 0,
        totalProformas: client.proforma_refrences?.length || 0,
        totalAccounts: client.accounts?.length || 0,
        totalCosts: client.cost_incurreds?.length || 0,
        outstandingBalance: client.outstanding_balance || 0,
        totalRevenue: client.total_revenue || 0
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

    const costIncurredForm = useInertiaForm({
        client_id: client.id,
        entry_name: '',
        count: '',
        selling_price: '',
        buying_price: '',
    });

    useEffect(() => {
        const initializeDataTables = () => {
            const tables = [
                refs.accountRef.current?.querySelector('table'),
                refs.tableRef.current?.querySelector('table'),
                refs.costIncurredRef.current?.querySelector('table')
            ].filter(Boolean);

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

        return () => {
            $('.dataTable').DataTable().destroy().clear();
        };
    }, [client.invoices, client.proformas, client.accounts, client.cost_incurred]);

    // Flash messages
    useEffect(() => {
        if (flash.message) ShowMessage('success', flash.message);
        if (flash.error) ShowMessage('error', flash.error);
    }, [flash]);

    // Handle editing a row
    const handleEditRow = (type, item) => {
        setEditingRow({
            type,
            id: item.id,
            data: item
        });

        if (type === 'account') {
            accountForm.setData(item);
        } else if (type === 'cost-incurred') {
            costIncurredForm.setData(item);
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingRow({
            type: null,
            id: null,
            data: null
        });
    };

    // Form submission handlers
    const handleSubmit = async (type, e) => {
        e.preventDefault();

        let form = type === 'account' ? accountForm : costIncurredForm;
        const isEditing = editingRow.id !== null;

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
                setEditingRow({
                    type: null,
                    id: null,
                    data: null
                });
                ShowMessage('success', `${type.replace('-', ' ')} ${isEditing ? 'updated' : 'created'} successfully`);
            }
        };

        if (isEditing) {
            formData.append('_method', 'PUT');
            router.post(route(`${type}s.update`, editingRow.id), formData, options);
        } else {
            form.post(route(`${type}s.store`), formData, options);
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
    };

   


    return (
        <AuthenticatedLayout>
            <Head title={`Client - ${client.client_name}`} />

            <div className="d-flex justify-content-between align-items-center">
                <BreadCrumbHeader breadcrumbs={[
                    { href: '/clients', label: 'Clients', active: false },
                    { href: `/clients/${client.id}`, label: client.client_name, active: true }
                ]} />
            </div>

            {/* Main Content */}
            <div className="container-fluid py-4">
                {/* Action Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Client Details</h4>
                    <div className="btn-group">
                        <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            <Plus size={18} />
                            <span>Create New</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow">

                            <li>
                                <Link
                                    href={route('bank-account.create', { client_id: client.id })}
                                    className="dropdown-item d-flex align-items-center gap-2"
                                >
                                    <Building size={16} />
                                    Bank Account
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Analytics Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                                        <Download size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1">Invoices</h6>
                                        <h3 className="mb-0">{analytics.totalInvoices}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                                        <FileText size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1">Proformas</h6>
                                        <h3 className="mb-0">{analytics.totalProformas}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Client Information */}
                <div className="row g-4 mb-4">
                    <ClientInfoCard client={client} />
                    {client.bank_account && <BankAccountCard BankProfile={client.bank_account} />}
                </div>

                {/* Tabs Section */}
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <ul className="nav nav-tabs tab-light-secondary px-3 pt-2" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active d-flex align-items-center gap-1" data-bs-toggle="tab" data-bs-target="#accounts-tab" type="button" role="tab">
                                    <PieChart size={16} />
                                    Accounts
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link d-flex align-items-center gap-1" data-bs-toggle="tab" data-bs-target="#ledger-tab" type="button" role="tab">
                                    <Activity size={16} />
                                    Ledger
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link d-flex align-items-center gap-1" data-bs-toggle="tab" data-bs-target="#cost-incurred-tab" type="button" role="tab">
                                    <DollarSign size={16} />
                                    Cost Incurred
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link d-flex align-items-center gap-1" data-bs-toggle="tab" data-bs-target="#pdf-tab" type="button" role="tab">
                                    <FileText size={16} />
                                    Documents
                                </button>
                            </li>
                        </ul>

                        <div className="tab-content p-3">
                            <div className="tab-pane fade show active" id="accounts-tab" role="tabpanel">
                                <AccountTab
                                    client={client}
                                    accountRef={refs.accountRef}
                                    handleEditRow={handleEditRow}
                                    handleDeleteItem={handleDelete}
                                    editingRow={editingRow}
                                    form={accountForm}
                                    handleSubmit={handleSubmit}
                                    cancelEdit={cancelEdit}
                                    handleSourceChange={handleSourceChange}
                                    inventoryOptions={inventoryOptions}
                                    modules={modules}
                                />
                            </div>

                            <div className="tab-pane fade" id="ledger-tab" role="tabpanel">
                                <LedgerTab
                                    client={client}
                                    tableRef={refs.tableRef}
                                    handleEditRow={handleEditRow}
                                    handleDeleteItem={handleDelete}
                                    editingRow={editingRow}
                                    form={accountForm}
                                    handleSubmit={handleSubmit}
                                    cancelEdit={cancelEdit}
                                    handleSourceChange={handleSourceChange}
                                    inventoryOptions={inventoryOptions}
                                    modules={modules}
                                />
                            </div>

                            <div className="tab-pane fade" id="cost-incurred-tab" role="tabpanel">
                                <CostIncurredTab
                                    client={client}
                                    tableRef={refs.costIncurredRef}
                                    handleEditRow={handleEditRow}
                                    handleDeleteItem={handleDelete}
                                    editingRow={editingRow}
                                    form={costIncurredForm}
                                    handleSubmit={handleSubmit}
                                    cancelEdit={cancelEdit}
                                />
                            </div>

                            <div className="tab-pane fade" id="pdf-tab" role="tabpanel">
                                <PdfTable client={client} CompanyProfile={company_profile || {}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}