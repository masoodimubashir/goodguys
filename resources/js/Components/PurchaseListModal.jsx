import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ShowMessage } from './ShowMessage';
import { Trash2 } from 'lucide-react';

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
    const vendorInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_id: '',
        vendor_name: '',
        client_id: client?.id,
        list_name: '',
        purchase_date: new Date().toISOString().split('T')[0],
        bill: null,
        bill_total: '',
        bill_description: '',
        // Fields for description mode
        description: '',
        qty: '1',
        multiplier: '1',
        unit_type: '',
        price: '',
        total: '',
        narration: '',
        attachment: null,
        created_at: new Date().toISOString().split('T')[0]
    });

    const [previewUrl, setPreviewUrl] = useState(null);

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
            reset();
            setVendorSearchTerm('');
            setShowVendorSuggestions(false);
            setIsNewDescription(false);
            setPreviewUrl(null);
            setFilteredVendors(vendors);
            setData({
                ...data,
                qty: '1',
                multiplier: '1'
            });
        }
    }, [show]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(isNewDescription && 'bill', file);
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
            description: vendor.vendor_name // Set description to vendor name
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') formData.append(key, value);
        });

        const url = isNewDescription ? '/activity' : '/purchase-list';
        const method = post;

        method(url, {
            preserveScroll: true,
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
        const value = e.target.value;
        setData({
            ...data,
            price: value,
            total: value * data.qty * data.multiplier
        });
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
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
                                        isInvalid={!!errors.vendor_id}
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
                                                        "Press Enter" :
                                                        "Start typing to search parties"}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <Form.Control.Feedback type="invalid">
                                        {errors.vendor_id || errors.description}
                                    </Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </div>

                        {
                            isNewDescription && (
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Unit Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.unit_type}
                                            onChange={(e) => setData('unit_type', e.target.value)}
                                            isInvalid={!!errors.unit_type}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.unit_type}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            )
                        }



                        {!isNewDescription ? (
                            // Vendor purchase mode fields


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
                                        <Form.Control.Feedback type="invalid">{errors.list_name}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Purchase Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={data.purchase_date}
                                            onChange={(e) => setData('purchase_date', e.target.value)}
                                            isInvalid={!!errors.purchase_date}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.purchase_date}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bill Total</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={data.bill_total}
                                            onChange={(e) => setData('bill_total', e.target.value)}
                                            isInvalid={!!errors.bill_total}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.bill_total}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-12">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bill</Form.Label>
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
                                            <div className="mt-2">
                                                <a
                                                    href={previewUrl || data.bill_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                >
                                                    <i className="ti ti-file me-1"></i>
                                                    {previewUrl ? 'Preview File' : 'View Current File'}
                                                </a>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setData('bill', null);
                                                        setPreviewUrl(null);
                                                        fileInputRef.current.value = '';
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        )}
                                    </Form.Group>
                                </div>
                            </>
                        ) : (
                            // Description mode fields
                            <>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={data.qty}
                                            onChange={(e) => setData('qty', e.target.value)}
                                            isInvalid={!!errors.qty}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.qty}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Multiplier</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={data.multiplier}
                                            onChange={(e) => setData('multiplier', e.target.value)}
                                            isInvalid={!!errors.multiplier}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.multiplier}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={data.price}
                                            onChange={handlePriceChange}
                                            isInvalid={!!errors.price}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
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
                                        <Form.Control.Feedback type="invalid">{errors.total}</Form.Control.Feedback>
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
                                        <Form.Control.Feedback type="invalid">{errors.created_at}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>Narration</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={data.narration}
                                            onChange={(e) => setData('narration', e.target.value)}
                                            isInvalid={!!errors.narration}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.narration}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </>
                        )}

                        {!isNewDescription && (
                            <div className="col-12">
                                <Form.Group>
                                    <Form.Label>Bill Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={data.bill_description}
                                        onChange={(e) => setData('bill_description', e.target.value)}
                                        isInvalid={!!errors.bill_description}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.bill_description}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
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
                        ) : 'Save'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};