import React from 'react';
import { Link } from '@inertiajs/react';
import { Badge, Button, InputGroup, Form, Table } from 'react-bootstrap';
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
    Edit,
    Trash2
} from 'lucide-react';
import DatePicker from 'react-datepicker';

const PurchaseItemsTab = ({
    filteredItems,
    purchaseItems,
    setPurchaseItems,
    editingItemId,
    setEditingItemId,
    editedItems,
    setEditedItems,
    newItem,
    setNewItem,
    challanState,
    setChallanState,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    startDate,
    endDate,
    handleItemChange,
    handleNewItemChange,
    saveItem,
    deleteItem,
    createItem,
    toggleProductSelection,
    openChallanForm,
    resetDateFilter,
    formatCurrency,
    CustomTooltip,
    isCreating,
    expandedItems,
    client,
    purchase_items,
}) => {


    return (
        <>
            <div className="">
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

                <Table hover responsive size='sm' className="mb-0" >
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
                                    Description
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
                                    Price
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
                            {/* <th style={{ width: '140px' }}>Actions</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {/* New Item Row */}
                        {newItem.show && (
                            <tr className="table-warning bounce-in" key="new-item">
                                <td></td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Item description"
                                        value={newItem.description}
                                        onChange={e => handleNewItemChange('description', e.target.value)}
                                    />
                                    <br />
                                    <Form.Control
                                        size='sm'
                                        type='date'
                                        value={newItem.created_at}
                                        onChange={e => handleNewItemChange('created_at', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Unit type"
                                        value={newItem.unit_type}
                                        onChange={e => handleNewItemChange('unit_type', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        min="1"
                                        placeholder="Quantity"
                                        value={newItem.qty}
                                        onChange={e => handleNewItemChange('qty', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        min="0"
                                        placeholder="Price"
                                        value={newItem.price}
                                        onChange={e => handleNewItemChange('price', e.target.value)}
                                    />
                                </td>
                                <td>
                                    {newItem.qty > 0 ?
                                        formatCurrency((parseFloat(newItem.price) || 0) * (parseInt(newItem.qty) || 1)) :
                                        formatCurrency(newItem.price || 0)}
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        as="textarea"
                                        placeholder="Enter narration"
                                        value={newItem.narration}
                                        onChange={e => handleNewItemChange('narration', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <CustomTooltip text="Save item">
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={createItem}
                                                disabled={!newItem.description || !newItem.unit_type || !newItem.qty || !newItem.price}
                                                className="bounce-in"
                                            >
                                                <Save size={12} />
                                            </Button>
                                        </CustomTooltip>
                                        <CustomTooltip text="Cancel">
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => setNewItem(prev => ({
                                                    client_id: client?.id,
                                                    unit_type: '',
                                                    description: '',
                                                    qty: '',
                                                    price: '',
                                                    narration: '',
                                                    show: false
                                                }))}
                                            >
                                                <XCircle size={12} />
                                            </Button>
                                        </CustomTooltip>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {filteredItems.map((item, index) => {
                            const isExpanded = expandedItems?.includes(item.id);
                            const isEditing = editingItemId === item.id;
                            const totalValue = item.qty > 1 ? (parseFloat(item.price) || 1) * (parseInt(item.qty) || 1) : item.price;

                            return (
                                <React.Fragment key={item.id}>
                                    <tr className="align-middle">
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
                                                <Form.Control
                                                    size="sm"
                                                    type="text"
                                                    value={editedItems[item.id]?.description || item.description}
                                                    onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                                                />
                                            ) : (
                                                <div>
                                                    <span className="fw-bold">{item.description ?? 'NA'}</span>
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
                                            {isEditing ? (
                                                <Form.Control
                                                    size="sm"
                                                    type="text"
                                                    value={editedItems[item.id]?.unit_type || item.unit_type}
                                                    onChange={e => handleItemChange(item.id, 'unit_type', e.target.value)}
                                                />
                                            ) : (
                                                <span className="fw-medium">{item.unit_type ?? 'NA'}</span>
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <Form.Control
                                                    size="sm"
                                                    type="number"
                                                    min="0"
                                                    value={editedItems[item.id]?.qty ?? ''}
                                                    onChange={e => handleItemChange(
                                                        item.id,
                                                        'qty',
                                                        e.target.value === '' ? '' : parseInt(e.target.value) || 0
                                                    )}
                                                    onFocus={e => e.target.select()}
                                                    placeholder="Enter quantity"
                                                />
                                            ) : (
                                                <span className="fw-bold">{item.qty > 1 ? item.qty : 'NA'}</span>
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <Form.Control
                                                    size="sm"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={editedItems[item.id]?.price ?? ''}
                                                    onChange={e => handleItemChange(
                                                        item.id,
                                                        'price',
                                                        e.target.value === '' ? '' : parseFloat(e.target.value) || 0
                                                    )}
                                                    onFocus={e => e.target.select()}
                                                    placeholder="Enter price"
                                                />
                                            ) : (
                                                <span className="fw-bold text-primary">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="fw-bold text-success">
                                                {formatCurrency(totalValue)}
                                            </span>
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    className="fade-in"
                                                    value={editedItems[item.id]?.narration || item.narration || ''}
                                                    onChange={e => handleItemChange(item.id, 'narration', e.target.value)}
                                                    placeholder="Enter item narration..."
                                                    style={{
                                                        minWidth: '200px',
                                                        transition: 'all 0.3s ease',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                />

                                            ) : (
                                                <span>
                                                    {item.narration }
                                                </span>
                                            )

                                            }
                                        </td>
                                        {/* <td>
                                            {isEditing ? (
                                                <div className="d-flex gap-1">
                                                    <CustomTooltip text="Save changes">
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            onClick={() => saveItem(item)}
                                                            className="bounce-in"
                                                        >
                                                            <Save size={12} />
                                                        </Button>
                                                    </CustomTooltip>
                                                    <CustomTooltip text="Cancel editing">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-secondary"
                                                            onClick={() => {
                                                                setEditingItemId(null);
                                                                setEditedItems(prev => {
                                                                    const newState = { ...prev };
                                                                    delete newState[item.id];
                                                                    return newState;
                                                                });
                                                            }}
                                                        >
                                                            <XCircle size={12} />
                                                        </Button>
                                                    </CustomTooltip>
                                                </div>
                                            ) : (
                                                <div className="d-flex gap-1">
                                                        <Button
                                                            variant="link"
                                                            className="p-1 text-primary"
                                                            onClick={() => {
                                                                setEditingItemId(item.id);
                                                                setEditedItems(prev => ({
                                                                    ...prev,
                                                                    [item.id]: {
                                                                        id: item.id,
                                                                        unit_type: item.unit_type,
                                                                        description: item.description,
                                                                        qty: item.qty,
                                                                        price: item.price,
                                                                        narration: item.narration
                                                                    }
                                                                }));
                                                            }}
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                
                                                </div>
                                            )}
                                        </td> */}
                                    </tr>
                                </React.Fragment>
                            );
                        })}

                        {/* Empty State for Purchase Items */}
                        {filteredItems.length === 0 && !newItem.show && (
                            <tr>
                                <td colSpan={8} className="text-center py-5">
                                    <div className="text-muted">
                                        <Package size={20} className="mb-3 opacity-50" />
                                        <h5 className="mb-2">No Items Found</h5>
                                        {searchTerm || (startDate || endDate) ? (
                                            <p>No items match your search criteria</p>
                                        ) : (
                                            <p>No items available for this client</p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {/* Pagination */}
                {purchase_items && purchase_items.links && (
                    <div className="d-flex justify-content-between align-items-center mt-3 text-black">
                        <div className="text-muted">
                            Showing {purchase_items.from} to {purchase_items.to} of {purchase_items.total} entries
                        </div>
                        <ul className="pagination mb-0">
                            {purchase_items.links.map((link, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            className="page-link"
                                            preserveScroll
                                        >
                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                        </Link>
                                    ) : (
                                        <span className="page-link" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default PurchaseItemsTab;