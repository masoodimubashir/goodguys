
import React, { useState } from 'react';
import {
  Card, Table, Button, Badge, ProgressBar, Row, Col, Form
} from 'react-bootstrap';
import {
  ShoppingCart, Plus, Edit, Trash2, Save, XCircle, ChevronDown, ChevronRight,
  FileText, Calendar, IndianRupee, Activity, Package, RotateCcw, Eye, EyeOff,
  Download, RefreshCw, HandCoins, Undo2, BarChart3, Zap, Building2, User2,
  Phone, Mail, MapPin, Percent, TrendingUp, Banknote, Wallet, Receipt,
  Text
} from 'lucide-react';


import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';
import { ShowMessage } from '@/Components/ShowMessage';

const PurchaseItems = ({ client }) => {


    const [purchaseItems, setPurchaseItems] = useState(client.purchase_items || []);
  const [expandedItems, setExpandedItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItems, setEditedItems] = useState({});
  const [newItem, setNewItem] = useState({
    client_id: client.id,
    unit_type: '',
    description: '',
    qty: '',
    price: '',
    narration: '',
    show: false
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [animatingCards, setAnimatingCards] = useState(new Set());
  const [isCreating, setIsCreating] = useState(false);

  // Animation classes
  const animationClasses = {
    slideInUp: 'animate_animated animate_slideInUp',
    fadeIn: 'animate_animated animate_fadeIn',
    slideIn: 'animate_animated animate_slideInLeft'
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    const totalValue = purchaseItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);
    const averagePrice = purchaseItems.length > 0 ?
      purchaseItems.reduce((sum, item) => sum + parseFloat(item.price), 0) / purchaseItems.length : 0;

    return {
      totalValue,
      averagePrice,
      totalItems: purchaseItems.length,
      totalQuantity: purchaseItems.reduce((sum, item) => sum + parseInt(item.qty), 0)
    };
  };

  const analytics = calculateAnalytics();

  // Toggle item expansion
  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle field changes for editing
  const handleItemChange = (itemId, field, value) => {
    setEditedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  // Handle new item field changes
  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save edited item
  const saveItem = (item) => {
    if (!item?.id) {
      console.error('Cannot save item - missing ID:', item);
      ShowMessage('Error', 'Cannot save item - missing ID');
      return;
    }

    const payload = {
      _method: 'PUT',
      client_id: client.id,
      ...editedItems[item.id],
      qty: editedItems[item.id]?.qty !== undefined ?
        Number(editedItems[item.id].qty) : item.qty,
      price: editedItems[item.id]?.price !== undefined ?
        Number(editedItems[item.id].price) : item.price
    };

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    router.post(`/purchased-item/${item.id}`, cleanPayload, {
      onSuccess: (response) => {
        const updatedItem = response.props?.item || response.item;
        
        if (updatedItem) {
          setPurchaseItems(prev => prev.map(i =>
            i.id === item.id ? updatedItem : i
          ));
        } else {
          // Fallback: merge the changes
          setPurchaseItems(prev => prev.map(i =>
            i.id === item.id ? { ...i, ...cleanPayload } : i
          ));
        }

        setEditingItemId(null);
        setEditedItems(prev => {
          const newState = { ...prev };
          delete newState[item.id];
          return newState;
        });

        ShowMessage('Success', 'Item updated successfully');
      },
      onError: (errors) => {
        console.error('Error saving item:', errors);
        ShowMessage('Error', 'Failed to update item');
      }
    });
  };

  // Delete item
  const deleteItem = (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      router.delete(`/purchased-item/${itemId}`, {
        onSuccess: () => {
          setPurchaseItems(prev => prev.filter(i => i.id !== itemId));
          ShowMessage('Success', 'Item deleted successfully');
        },
        onError: (errors) => {
          console.error('Error deleting item:', errors);
          ShowMessage('Error', 'Failed to delete item');
        }
      });
    }
  };

  // Create new item - FIXED VERSION
  const createItem = () => {
    setIsCreating(true);
    const itemData = {
      client_id: client.id,
      unit_type: newItem.unit_type,
      description: newItem.description,
      qty: Number(newItem.qty),
      price: Number(newItem.price),
      narration: newItem.narration
    };

    router.post('/purchased-item', itemData, {
      onSuccess: (response) => {
        // Try multiple ways to get the created item from response
        const createdItem = response.props?.item || 
                          response.props?.purchase_item || 
                          response.props?.data?.item ||
                          response.item || 
                          response.data?.item;

        if (createdItem) {
          setPurchaseItems(prev => [...prev, createdItem]);
          ShowMessage('Success', 'Item created successfully');
        } else {
          // If we can't find the item in response, refresh the data
          router.reload({
            only: ['client'],
            onSuccess: (updated) => {
              setPurchaseItems(updated.props.client.purchase_items || []);
              ShowMessage('Success', 'Item created - data refreshed');
            }
          });
        }

        // Reset the form
        setNewItem({
          client_id: client.id,
          unit_type: '',
          description: '',
          qty: '',
          price: '',
          narration: '',
          show: false
        });
      },
      onError: (errors) => {
        console.error('Error creating item:', errors);
        ShowMessage('Error', 'Failed to create item');
      },
      onFinish: () => {
        setIsCreating(false);
      }
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ text, children }) => (
    <div className="position-relative d-inline-block">
      {children}
      <div className="tooltip-custom">
        <span className="tooltiptext">{text}</span>
      </div>
    </div>
  );

  const breadcrumbs = [
    { href: `/clients/${client.id}`, label: 'Back', active: true }
  ];


return (
  <AuthenticatedLayout>

    <Head title={`Client - ${client.client_name}`} />

    <div className="d-flex justify-content-between align-items-center">

      <BreadCrumbHeader
        breadcrumbs={breadcrumbs}
      />


    </div>

    <div className="container-fluid py-3">
      {/* Enhanced Header with Analytics Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0 fw-bold">
            <ShoppingCart size={20} className="me-2 text-primary" />
            Purchased Items
          </h6>
          <Badge bg="primary">
            <Activity size={12} className="me-1" />
            {purchaseItems.length} Items
          </Badge>
        </div>
        <div className="d-flex gap-2">
          <CustomTooltip>
            <Button
              variant={showAnalytics ? "primary" : "outline-primary"}
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="d-flex align-items-center gap-2 btn-sm"
            >
              {showAnalytics ? <EyeOff size={10} /> : <Eye size={10} />}
              Analytics
            </Button>
          </CustomTooltip>
          <CustomTooltip>
            <Button variant="success" className="d-flex align-items-center gap-2 btn-sm">
              <Download size={16} />
              Export
            </Button>
          </CustomTooltip>
        </div>
      </div>

      {/* Client Information Card */}
      <Row className="g-3 mb-4">
        <Col md={12}>
          <Card className={`shadow-sm border-0 rounded-4 card-hover ${animationClasses.slideInUp}`}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <User2 size={24} className="text-white" />
                </div>
                <div>
                  <h6 className="mb-1 fw-bold">{client.client_name}</h6>
                  <small className="text-muted">Client Information</small>
                </div>
              </div>
              <div className="space-y-2">
                <p className="mb-2 d-flex align-items-center gap-2">
                  <Building2 size={16} className="text-muted" />
                  <span className="fw-medium">{client.site_name}</span>
                </p>
                <p className="mb-0 d-flex align-items-center gap-2">
                  <MapPin size={16} className="text-muted" />
                  <span className="fw-medium">{client.client_address}</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Analytics Cards */}
      {showAnalytics && (
        <div className={`mb-4 ${animationClasses.fadeIn}`}>
          {/* Primary Metrics */}
          <Row className="g-3 mb-3">
            <Col md={3}>
              <Card className={`border-0 shadow-sm h-100 card-hover gradient-bg ${animatingCards.has('total-value') ? 'pulse-animation' : ''}`}>
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1">Total Inventory Value</h6>
                      <h6 className="mb-0 fw-bold ">{formatCurrency(analytics.totalValue)}</h6>
                      <small className="">
                        <TrendingUp size={12} className="me-1" />
                        Avg: {formatCurrency(analytics.averagePrice)} per unit
                      </small>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                      <Receipt size={28} className="" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className={`border-0 shadow-sm h-100 card-hover gradient-success ${animatingCards.has('total-items') ? 'pulse-animation' : ''}`}>
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1">Total Items</h6>
                      <h6 className="mb-0 fw-bold">{analytics.totalItems}</h6>
                      <small>
                        <Percent size={12} className="me-1" />
                        {analytics.totalQuantity} Total Quantity
                      </small>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-circle text-black">
                      <Package size={28} className="" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <BarChart3 size={18} className="text-primary" />
                    Quick Stats
                  </h6>
                  <div className="d-flex justify-content-between">
                    <div className="text-center">
                      <h6 className="mb-1 fw-bold">{analytics.totalItems}</h6>
                      <small className="text-muted">Total Items</small>
                    </div>
                    <div className="text-center">
                      <h6 className="mb-1 fw-bold">{analytics.totalQuantity}</h6>
                      <small className="text-muted">Total Quantity</small>
                    </div>
                    <div className="text-center">
                      <h6 className="mb-1 fw-bold">{formatCurrency(analytics.averagePrice)}</h6>
                      <small className="text-muted">Avg. Price</small>
                    </div>
                    <div className="text-center">
                      <h6 className="mb-1 fw-bold">{formatCurrency(analytics.totalValue)}</h6>
                      <small className="text-muted">Total Value</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Enhanced Footer with Additional Actions */}
      <div className="mt-4 d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <small className="text-muted">
            Last updated: {new Date().toLocaleString()}
          </small>
          <Badge bg="light" text="dark" className="d-flex align-items-center gap-1">
            <Activity size={12} />
            Live Data
          </Badge>
        </div>
        <div className="d-flex gap-2">
          <CustomTooltip>
            <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw size={12} />
            </Button>
          </CustomTooltip>
          <CustomTooltip>
            <Button variant="outline-secondary" size="sm" onClick={() => window.print()}>
              <Download size={12} />
            </Button>
          </CustomTooltip>
          <CustomTooltip>
            <Button variant="outline-success" size="sm">
              <FileText size={12} />
            </Button>
          </CustomTooltip>
        </div>
      </div>

      {/* Enhanced Purchase Items Table */}
      <Card className={`shadow-sm border-0 ${animationClasses.slideInUp}`}>
        <Card.Header className="bg-white border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <Package size={20} className="text-primary" />
                Purchase Items List
              </h5>
              <Badge>
                {purchaseItems.length} Items
              </Badge>
            </div>
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2 bounce- btn-sm"
              onClick={() => setNewItem(prev => ({
                ...prev,
                show: true
              }))}
            >
              <Plus size={14} />
              Add
            </Button>
          </div>
        </Card.Header>

        <Table hover bordered responsive size='sm' className="mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: '40px' }}></th>
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
              <th style={{ width: '140px' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* New Item Row */}
            {newItem.show && (
              <tr className="table-warning bounce-in" key={newItem.id}>
                <td></td>
                <td>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Item description"
                    value={newItem.description}
                    onChange={e => handleNewItemChange('description', e.target.value)}
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
                  {formatCurrency((parseFloat(newItem.price) || 0) * (parseInt(newItem.qty) || 1))}
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    as={'textArea'}
                    min="0"
                    placeholder="enter narration"
                    value={newItem.narration}
                    onChange={e => handleNewItemChange('narration', e.target.value)}
                  />
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <CustomTooltip>
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
                    <CustomTooltip>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => setNewItem(prev => ({
                          client_id: client.id,
                          unit_type: '',
                          description: '',
                          qty: '',
                          price: '',
                          narration: ''
                        }))}
                      >
                        <XCircle size={12} />
                      </Button>
                    </CustomTooltip>
                  </div>
                </td>
              </tr>
            )}

            {purchaseItems.map((item, index) => {
              const isExpanded = expandedItems.includes(item.id);
              const isEditing = editingItemId === item.id;
              const totalValue = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 1);

              return (
                <React.Fragment key={item.id}>
                  <tr className={`align-middle`}>
                    <td>
                      <Button
                        variant="link"
                        className="p-0 text-primary"
                        onClick={() => toggleItemExpansion(item.id)}
                      >
                        {isExpanded
                          ? <ChevronDown size={16} className="" />
                          : <ChevronRight size={16} />
                        }
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
                          <span className="fw-bold">{item.description}</span>
                          <br />
                          <small className="text-muted">
                            ID: #{item.id}
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
                        <span className="fw-medium">{item.unit_type}</span>
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
                        <span className="fw-bold">{item.qty}</span>
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
                        <div
                          className={`text-truncate ${!item.narration ? 'text-muted' : ''}`}
                          style={{
                            maxWidth: '250px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => {
                            if (!isEditing) {
                              setEditingItemId(item.id);
                              setEditedItems(prev => ({
                                ...prev,
                                [item.id]: {
                                  ...prev[item.id],
                                  narration: item.narration
                                }
                              }));
                            }
                          }}
                        >
                          {item.narration || (
                            <small className="d-flex align-items-center gap-1 text-muted">
                              <FileText size={12} />
                              Click to add narration
                            </small>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="d-flex gap-1">
                          <CustomTooltip>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => saveItem(item)}
                              className="bounce-in"
                            >
                              <Save size={12} />
                            </Button>
                          </CustomTooltip>
                          <CustomTooltip>
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
                          <CustomTooltip>
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
                          </CustomTooltip>
                          <CustomTooltip>
                            <Button
                              variant="link"
                              className="p-1 text-danger"
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </CustomTooltip>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <tr className="fade-in">
                      <td colSpan={7} className="p-0">
                        <div className="p-4">
                          <Row>
                            <Col md={6}>
                              <Card className="border-0 shadow-sm">
                                <Card.Body className="p-3">
                                  <h6 className="mb-3 fw-bold d-flex align-items-center gap-2">
                                    <FileText size={16} />
                                    Additional Information
                                  </h6>
                                  {isEditing ? (
                                    <Form.Control
                                      as="textarea"
                                      rows={3}
                                      placeholder="Enter narration..."
                                      value={editedItems[item.id]?.narration || item.narration}
                                      onChange={e => handleItemChange(item.id, 'narration', e.target.value)}
                                    />
                                  ) : (
                                    <div>
                                      {item.narration ? (
                                        <p className="mb-0">{item.narration}</p>
                                      ) : (
                                        <p className="text-muted mb-0">No additional information provided</p>
                                      )}
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={6}>
                              <Card className="border-0 shadow-sm">
                                <Card.Body className="p-3">
                                  <h6 className="mb-3 fw-bold d-flex align-items-center gap-2">
                                    <Activity size={16} />
                                    Item Statistics
                                  </h6>
                                  <div className="space-y-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span className="text-muted">Unit Price:</span>
                                      <span className="fw-bold">{formatCurrency(item.price)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span className="text-muted">Quantity:</span>
                                      <span className="fw-bold">{item.qty} {item.unit_type}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span className="text-muted">Total Value:</span>
                                      <span className="fw-bold text-success">{formatCurrency(totalValue)}</span>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {/* Empty State for Purchase Items */}
            {purchaseItems.length === 0 && !newItem.show && (
              <tr>
                <td colSpan={8} className="text-center py-5">
                  <div className="text-muted">
                    <Package size={20} className="mb-3 opacity-50" />
                    <h5 className="mb-2">No Purchase Items Found</h5>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>


    </div>
  </AuthenticatedLayout>
);
};

export default PurchaseItems;

<style jsx>{`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
    
    .card-hover {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    .card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    
    .pulse-animation {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .slide-in {
        animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .bounce-in {
        animation: bounceIn 0.6s ease-out;
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .gradient-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .gradient-success {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    
    .gradient-warning {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .gradient-info {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
 
    
    @keyframes iconBounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    .table-row-hover {
        transition: all 0.2s ease;
    }
    
    .table-row-hover:hover {
        background-color: rgba(0,123,255,0.1);
        transform: scale(1.01);
    }
    
    .progress-animated {
        background-size: 40px 40px;
        background-image: linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent);
        animation: progress-bar-stripes 1s linear infinite;
    }
    
    @keyframes progress-bar-stripes {
        0% { background-position: 40px 0; }
        100% { background-position: 0 0; }
    }

    .tooltip-custom {
        position: relative;
        display: inline-block;
    }

    .tooltip-custom .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 12px;
    }

    .tooltip-custom:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }
`}</style>