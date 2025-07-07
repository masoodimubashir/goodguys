import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { ShowMessage } from './ShowMessage';
import { Trash2, Eye, Plus } from 'lucide-react';
import Tooltip from './Tooltip';

export const PurchaseListModal = ({
    show,
    onHide,
    vendors,
    isEditing,
    setPurchaseItems,
    setFilteredItems,
    client
}) => {
    const [vendorSearchTerm, setVendorSearchTerm] = useState('');
    const [showVendorSuggestions, setShowVendorSuggestions] = useState(false);
    const [filteredVendors, setFilteredVendors] = useState(vendors);
    const [isNewDescription, setIsNewDescription] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [items, setItems] = useState([]);
    const vendorInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_id: '',
        vendor_name: '',
        client_id: client?.id || '',
        list_name: '',
        purchase_date: new Date().toISOString().split('T')[0],
        bill: null,
        bill_total: '',
        bill_description: '',
        description: '',
        qty: '1',
        multiplier: '1',
        unit_type: '',
        price: '',
        total: '',
        narration: '',
        attachment: null,
        item_description: '',
        item_quantity: 1,
        item_price: '',
        created_at: new Date().toISOString().split('T')[0],
        items: []
    });

    // Filter vendors based on search term
    useEffect(() => {
        if (vendorSearchTerm) {
            setFilteredVendors(
                vendors.filter(vendor =>
                    vendor.vendor_name.toLowerCase().includes(vendorSearchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredVendors(vendors);
        }
    }, [vendorSearchTerm, vendors]);

    // Reset form when modal shows/hides
    useEffect(() => {
        if (show) {
            const hasErrors = Object.keys(errors).length > 0;
            setFormSubmitted(false);
            setItems([]);

            // Only reset the form and search if there are no validation errors
            if (!hasErrors) {
                reset();
                setVendorSearchTerm('');
                setIsNewDescription(false);
            } else {
                // On error, keep previously typed vendor name
                setVendorSearchTerm(data.vendor_name || '');
            }

            setShowVendorSuggestions(false);
            setPreviewUrl(null);
            setFilteredVendors(vendors);
            setData('client_id', client?.id || '');
        }
    }, [show, client, errors]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('bill', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleVendorInputChange = (e) => {
        const value = e.target.value;
        setVendorSearchTerm(value);
        setData('vendor_name', value);
    };

    const handleVendorSelect = (vendor) => {
        setVendorSearchTerm(vendor.vendor_name);
        setData({
            ...data,
            vendor_id: vendor.id,
            vendor_name: vendor.vendor_name,
            description: vendor.vendor_name
        });
        setIsNewDescription(false);
        setShowVendorSuggestions(false);
    };

    const handleVendorKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (filteredVendors.length > 0) {
                handleVendorSelect(filteredVendors[0]);
            } else if (vendorSearchTerm) {
                setIsNewDescription(true);
                setData('description', vendorSearchTerm);
                setShowVendorSuggestions(false);
            }
            e.preventDefault();
        } else if (e.key === 'Escape') {
            setShowVendorSuggestions(false);
        }
    };

    const addItem = () => {
        if (!data.item_description || !data.item_price) return;
        
        const newItem = {
            description: data.item_description,
            quantity: parseInt(data.item_quantity) || 1,
            price: parseFloat(data.item_price) || 0,
            total: (parseInt(data.item_quantity) || 1) * (parseFloat(data.item_price) || 0)
        };
        
        setItems([...items, newItem]);
        setData('items', [...items, newItem]);
        
        // Reset item fields
        setData({
            ...data,
            item_description: '',
            item_quantity: 1,
            item_price: '',
            items: [...items, newItem]
        });
    };

    const removeItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
        setData('items', updatedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        // Client-side validation
        if (!isNewDescription && !data.vendor_id) {
            return;
        }

        if (isNewDescription && !vendorSearchTerm.trim()) {
            return;
        }

        // Ensure description is synced with vendorSearchTerm when using custom entry
        if (isNewDescription) {
            const trimmedDescription = vendorSearchTerm.trim();
            setData('description', trimmedDescription);
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (key === 'items') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        const url = isNewDescription ? '/activity' : '/purchase-list';

        post(url, {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (page) => {
                if (page.props.purchase_items) {
                    setPurchaseItems(page.props.purchase_items);
                    setFilteredItems(page.props.purchase_items);
                }
                onHide();
                reset();
                ShowMessage('success', page.props.message);
                
            },
        });
    };

    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setData({
            ...data,
            price: value,
            total: (value * (data.qty) * (data.multiplier))
        });
    };

    const getFileIcon = () => {
        if (!previewUrl && !data.bill_url) return null;
        const fileName = previewUrl ? fileInputRef.current?.files[0]?.name : data.bill_url;
        return <Eye size={18} title="View" />;
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg" centered>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Modal.Body className="p-4">
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Party/Description</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        ref={vendorInputRef}
                                        type="text"
                                        placeholder="Select parties or enter description"
                                        value={vendorSearchTerm}
                                        onChange={handleVendorInputChange}
                                        onKeyDown={handleVendorKeyDown}
                                        onClick={() => setShowVendorSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowVendorSuggestions(false), 200)}
                                        isInvalid={(formSubmitted && !isNewDescription && !data.vendor_id) ||
                                            (formSubmitted && isNewDescription && !vendorSearchTerm.trim()) ||
                                            !!errors.vendor_id ||
                                            !!errors.description}
                                    />
                                    {showVendorSuggestions && (
                                        <div className="position-absolute bg-white border mt-1 w-100 shadow-sm z-3"
                                            style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredVendors.length > 0 ? (
                                                filteredVendors.map(vendor => (
                                                    <div key={vendor.id}
                                                        className="px-3 py-2 cursor-pointer hover-bg-light text-black"
                                                        onClick={() => handleVendorSelect(vendor)}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        {vendor.vendor_name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-muted">
                                                    {vendorSearchTerm ?
                                                        "Press Enter to use as description" :
                                                        "Start typing to search parties"}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <Form.Control.Feedback type="invalid">
                                        {(formSubmitted && !isNewDescription && !data.vendor_id) ? "party name is required" :
                                            (formSubmitted && isNewDescription && !vendorSearchTerm.trim()) ? "this field is required" :
                                                errors.vendor_id || errors.description}
                                    </Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </div>

                        {isNewDescription && (
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Unit Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.unit_type}
                                        onChange={(e) => setData('unit_type', e.target.value)}
                                        isInvalid={!!errors.unit_type}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.unit_type}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        )}

                        {!isNewDescription ? (
                            <>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Reference Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.list_name}
                                            onChange={(e) => setData('list_name', e.target.value)}
                                            isInvalid={!!errors.list_name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.list_name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <Row className="mb-3">
                                    <Col md={5}>
                                        <Form.Group>
                                            <Form.Label>Item Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={data.item_description}
                                                onChange={(e) => setData('item_description', e.target.value)}
                                                isInvalid={!!errors.item_description}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Qty</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={data.item_quantity}
                                                onChange={(e) => setData('item_quantity', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.item_price}
                                                onChange={(e) => setData('item_price', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-end">
                                        <Button 
                                            variant="primary" 
                                            onClick={addItem}
                                            className="mb-3"
                                            disabled={!data.item_description || !data.item_price}
                                        >
                                            <Plus size={16} />
                                        </Button>
                                    </Col>
                                </Row>

                                {items.length > 0 && (
                                    <div className="col-12 mb-3">
                                        <Table striped bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Description</th>
                                                    <th>Qty</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.description}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.price.toFixed(2)}</td>
                                                        <td>{item.total.toFixed(2)}</td>
                                                        <td>
                                                            <Button 
                                                                variant="danger" 
                                                                size="sm"
                                                                onClick={() => removeItem(index)}
                                                            >
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Purchase Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={data.purchase_date}
                                            onChange={(e) => setData('purchase_date', e.target.value)}
                                            isInvalid={!!errors.purchase_date}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.purchase_date}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bill Total</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            value={data.bill_total}
                                            onChange={(e) => setData('bill_total', parseFloat(e.target.value) || 0)}
                                            isInvalid={!!errors.bill_total}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.bill_total}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-12">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bill (Image or PDF)</Form.Label>
                                        <Form.Control
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleFileChange}
                                            isInvalid={!!errors.bill}
                                            accept="image/*,.pdf"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.bill}
                                        </Form.Control.Feedback>

                                        {(previewUrl || data.bill_url) && (
                                            <div className="mt-2 d-flex align-items-center gap-2">
                                                <Tooltip text={'View'}>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="d-flex align-items-center gap-1"
                                                        onClick={() => {
                                                            if (previewUrl) {
                                                                window.open(previewUrl, '_blank');
                                                            } else {
                                                                window.open(`/storage/${data.bill_url}`, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        {getFileIcon()}
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip text="Delete">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setData('bill', null);
                                                            setPreviewUrl(null);
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = '';
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </Form.Group>
                                </div>

                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>Bill Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.bill_description}
                                            onChange={(e) => setData('bill_description', e.target.value)}
                                            isInvalid={!!errors.bill_description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.bill_description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={data.qty}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value) || 1;
                                                setData({
                                                    ...data,
                                                    qty: value,
                                                    total: (data.price * value * data.multiplier).toFixed(2)
                                                });
                                            }}
                                            isInvalid={!!errors.qty}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.qty}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Multiplier</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={data.multiplier}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value) || 1;
                                                setData({
                                                    ...data,
                                                    multiplier: value,
                                                    total: (data.price * data.qty * value).toFixed(2)
                                                });
                                            }}
                                            isInvalid={!!errors.multiplier}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.multiplier}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            value={data.price}
                                            onChange={handlePriceChange}
                                            isInvalid={!!errors.price}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.price}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Total</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={data.total}
                                            readOnly
                                            isInvalid={!!errors.total}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.total}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={data.created_at}
                                            onChange={(e) => setData('created_at', e.target.value)}
                                            isInvalid={!!errors.created_at}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.created_at}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>Narration</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.narration}
                                            onChange={(e) => setData('narration', e.target.value)}
                                            isInvalid={!!errors.narration}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.narration}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={onHide} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        ) : isEditing ? 'Update' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};