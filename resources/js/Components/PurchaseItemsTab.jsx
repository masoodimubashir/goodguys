import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Badge, Button, InputGroup, Form, Table, Pagination } from 'react-bootstrap';
import {
    Plus,
    ShoppingCart,
    Search,
    XCircle,
    Check,
    FileText,
    Package,
    Activity,
    IndianRupee,
    Text,
    Save,
    Minus
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import { ShowMessage } from './ShowMessage';

const PurchaseItemsTab = ({
    filteredItems,
    purchaseItems,
    editingItemId,
    editedItems,
    newItem,
    setNewItem,
    challanState,
    setChallanState,
    searchTerm,
    setSearchTerm,
    setDateRange,
    startDate,
    endDate,
    handleItemChange,
    handleNewItemChange,
    toggleProductSelection,
    openChallanForm,
    resetDateFilter,
    formatCurrency,
    client,
    client_vendors,
    setPurchaseItems,
    setFilteredItems,
}) => {


    const [isCreating, setIsCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Vendor search state
    const [vendorSearchTerm, setVendorSearchTerm] = useState('');
    const [showVendorSuggestions, setShowVendorSuggestions] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const isVendorSelected = !!selectedVendor;

    // Filter vendors based on search term
    const filteredVendors = client_vendors.filter(vendor =>
        vendor.vendor_name.toLowerCase().includes(vendorSearchTerm.toLowerCase())
    );

    // Handle vendor selection
    const handleVendorSelect = (vendor) => {
        setSelectedVendor(vendor);
        setVendorSearchTerm(vendor.vendor_name);
        setShowVendorSuggestions(false);
    };

    // Handle vendor input change
    const handleVendorInputChange = (e) => {
        setVendorSearchTerm(e.target.value);
        setShowVendorSuggestions(true);
        setSelectedVendor(null);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const savePayment = async () => {
        setIsCreating(true);

        try {
            // Validation
            if (!vendorSearchTerm.trim()) {
                ShowMessage('error', 'Please enter a Party name');
                return;
            }

            // Prepare data
            const payload = {
                client_id: client.id,
                narration: newItem.narration,
                created_at: newItem.created_at,
                unit_type: newItem.unit_type,
                price: Number(newItem.price),
                ...(selectedVendor ? {
                    vendor_id: selectedVendor.id,
                    description: selectedVendor.vendor_name,
                    amount: Number(newItem.price),
                    transaction_date: newItem.created_at,
                } : {
                    description: vendorSearchTerm,
                    vendor_name: vendorSearchTerm,
                    qty: Number(newItem.qty),
                    multiplier: Number(newItem.multiplier) || 1,
                })
            };

            // Make the request
            const routeName = selectedVendor
                ? 'purchase-list-payments.store'
                : 'purchased-item.store';

            const response = await router.post(route(routeName), payload, {
                preserveScroll: true,
                onSuccess: (page) => {
                    if (page.props.purchase_items) {
                        setPurchaseItems(page.props.purchase_items);
                        setFilteredItems(page.props.purchase_items);
                    }
                    ShowMessage('success', 'Record created successfully');
                    resetForm();
                },
                onError: (errors) => {
                    const errorMsg = Object.values(errors).join('\n');
                    ShowMessage('error', errorMsg || 'Failed to create record');
                }
            });

        } finally {
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setNewItem({
            client_id: client?.id,
            unit_type: '',
            description: '',
            price: '',
            narration: '',
            show: false,
            created_at: new Date().toISOString().split('T')[0],
        });
        setVendorSearchTerm('');
        setSelectedVendor(null);
       
    };



    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                    <Badge bg="primary" pill>
                        {filteredItems.length} items
                    </Badge>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setNewItem(prev => ({ ...prev, show: true }))}
                    >
                        <Plus size={16} /> Add Entry
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={openChallanForm}
                        disabled={!Object.values(challanState.selectedProducts).some(selected => selected)}
                    >
                        <ShoppingCart size={16} /> Create Challan
                    </Button>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="d-flex gap-3">
                <div className="flex-grow-1">
                    <InputGroup>
                        <InputGroup.Text>
                            <Search size={14} />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <div className="d-flex gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            isClearable={true}
                            placeholderText="Filter by date range"
                            className="form-control form-control-sm"
                        />
                        {(startDate || endDate) && (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={resetDateFilter}
                                title="Clear date filter"
                            >
                                <XCircle size={14} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Table hover responsive size='sm' className="mb-0">
                <thead className="table-light">
                    <tr>
                        <th>
                            <Button
                                variant="link"
                                className="p-0"
                                onClick={() => {
                                    const allSelected = purchaseItems.every(item => challanState.selectedProducts[item.id]);
                                    const newSelection = {};
                                    purchaseItems.forEach(item => {
                                        newSelection[item.id] = !allSelected;
                                    });
                                    setChallanState(prev => ({
                                        ...prev,
                                        selectedProducts: newSelection
                                    }));
                                }}
                                title="Select all for challan"
                            >
                                <Check
                                    size={18}
                                    className={purchaseItems.length > 0 && purchaseItems.every(item => challanState.selectedProducts[item.id])
                                        ? "text-danger"
                                        : "text-muted"}
                                />
                            </Button>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <FileText size={14} />
                                Party/Description
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <Package size={14} />
                                Unit Type
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <Activity size={14} />
                                Quantity
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <IndianRupee size={14} />
                                Pay
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <IndianRupee size={14} />
                                Multiplier
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <IndianRupee size={14} />
                                Total
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <Text size={14} />
                                Narration
                            </div>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {newItem.show && (
                        <tr className="table-warning bounce-in" key="new-item">
                            <td></td>

                            <td>
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="Search or enter party name"
                                        value={vendorSearchTerm}
                                        onChange={handleVendorInputChange}
                                        onFocus={() => setShowVendorSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowVendorSuggestions(false), 200)}
                                    />
                                    {showVendorSuggestions && (
                                        <div className="position-absolute bg-white border mt-1 w-100 shadow-sm z-3"
                                            style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredVendors.length > 0 ? (
                                                filteredVendors.map(vendor => (
                                                    <div key={vendor.id}
                                                        className="px-3 py-2 cursor-pointer hover-bg-light text-black"
                                                        onClick={() => handleVendorSelect(vendor)}>
                                                        {vendor.vendor_name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-muted">
                                                    {vendorSearchTerm ?
                                                        "Press Enter to use as description" :
                                                        "Start typing to search vendors"}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Removed the separate description field */}
                                <Form.Control
                                    size='sm'
                                    type='date'
                                    className="mt-2"
                                    value={newItem.created_at}
                                    onChange={(e) => handleNewItemChange('created_at', e.target.value)}
                                    required
                                />
                            </td>


                            {/* Unit Type: Always enabled in both cases */}
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Unit type"
                                    value={newItem.unit_type}
                                    onChange={(e) => handleNewItemChange('unit_type', e.target.value)}
                                    required
                                />
                            </td>

                            {/* Quantity: ENABLED ONLY when vendor IS selected */}
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="number"
                                    min="1"
                                    placeholder="Quantity"
                                    value={newItem.qty}
                                    onChange={(e) => handleNewItemChange('qty', e.target.value)}
                                    disabled={isVendorSelected}
                                />
                            </td>

                            {/* Price: ENABLED ONLY when vendor IS selected */}
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="number"
                                    min="0"
                                    placeholder="Price"
                                    value={newItem.price}
                                    onChange={(e) => handleNewItemChange('price', e.target.value)}
                                    required
                                />
                            </td>

                            {/* Multiplier: ENABLED ONLY when vendor IS selected */}
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Multiplier"
                                    value={newItem.multiplier || 1}
                                    onChange={(e) => handleNewItemChange('multiplier', e.target.value)}
                                    disabled={isVendorSelected}
                                />
                            </td>

                            {/* Total: Calculated, always visible */}
                            <td>
                                {newItem.qty > 0
                                    ? formatCurrency((parseFloat(newItem.price) || 0) * (parseInt(newItem.qty) || 1) * (parseInt(newItem.multiplier) || 1))
                                    : formatCurrency(newItem.price || 0)}
                            </td>

                            {/* Narration: ENABLED ONLY when vendor IS selected */}
                            <td>
                                <Form.Control
                                    size="sm"
                                    as="textarea"
                                    placeholder="Enter narration"
                                    value={newItem.narration}
                                    onChange={(e) => handleNewItemChange('narration', e.target.value)}
                                    required
                                />
                            </td>

                            {/* Action Buttons */}
                            <td>
                                <div className="d-flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={savePayment}
                                        disabled={isCreating}
                                    >
                                        {isCreating ? 'Saving...' : <Save size={14} />}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        onClick={() => {
                                            setNewItem(prev => ({
                                                ...prev,
                                                show: false
                                            }));
                                            setVendorSearchTerm('');
                                            setSelectedVendor(null);
                                        }}
                                    >
                                        <XCircle size={14} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                    {paginatedItems.map((item) => {
                        const isEditing = editingItemId === item.id;
                        // const [localVendorSearch, setLocalVendorSearch] = useState(item.vendor_name || '');
                        // const [localShowSuggestions, setLocalShowSuggestions] = useState(false);

                        return (
                            <tr key={item.id} className="align-middle">
                                <td>
                                    <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={() => toggleProductSelection(item.id)}
                                        title="Select for challan"
                                    >
                                        <Check
                                            size={18}
                                            className={challanState.selectedProducts[item.id] ? "text-danger" : "text-muted"}
                                        />
                                    </Button>
                                </td>
                                <td>
                                    {isEditing ? (
                                        <div className="position-relative">
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                placeholder="Search or enter vendor name"
                                                value={localVendorSearch}
                                                onChange={(e) => {
                                                    setLocalVendorSearch(e.target.value);
                                                    handleItemChange(item.id, 'vendor_name', e.target.value);
                                                    setLocalShowSuggestions(true);
                                                }}
                                                onFocus={() => setLocalShowSuggestions(true)}
                                            />
                                            {localShowSuggestions && (
                                                <div className="position-absolute bg-white border rounded mt-1 w-100 shadow-sm z-3"
                                                    style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {client_vendors
                                                        .filter(v => v.vendor_name.toLowerCase().includes(localVendorSearch.toLowerCase()))
                                                        .map(vendor => (
                                                            <div key={vendor.id}
                                                                className="px-3 py-2 cursor-pointer hover-bg-light"
                                                                onClick={() => {
                                                                    setLocalVendorSearch(vendor.vendor_name);
                                                                    handleItemChange(item.id, 'vendor_name', vendor.vendor_name);
                                                                    setLocalShowSuggestions(false);
                                                                }}>
                                                                {vendor.vendor_name}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )}
                                            <Form.Control
                                                size="sm"
                                                type="text"
                                                className="mt-2"
                                                placeholder="Description"
                                                value={editedItems[item.id]?.description || item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <span className="fw-medium">{item.description || 'No description'}</span>
                                            <br />
                                            <small className="text-muted">
                                                {new Date(item.created_at).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </small>
                                        </div>
                                    )}
                                </td>
                                <td>

                                    <span className="fw-medium">{item.unit_type || 'NA'}</span>
                                </td>
                                <td>
                                    <span className="fw-bold">{item.qty > 1 ? item.qty : 'NA'}</span>
                                </td>
                                <td>
                                    <span className="fw-bold text-primary">
                                        {formatCurrency(item.price)} {item.payment_flow === 1 ? <Plus size={13} /> : <Minus size={13} />}
                                    </span>
                                </td>
                                <td>
                                    <span className="fw-bold text-success">
                                        {item.multiplier > 1 ? item.multiplier : 'NA'}
                                    </span>
                                </td>
                                <td>
                                    <span className="fw-bold text-success">
                                        {formatCurrency(item.total)}  {item.payment_flow === 1 ? <Plus size={13} /> : <Minus size={13} />}
                                    </span>
                                </td>
                                <td>
                                    <span>{item.narration}</span>
                                </td>
                                <td>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
                </div>
                <Pagination>
                    <Pagination.Prev
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>
        </>
    );
};

export default PurchaseItemsTab;