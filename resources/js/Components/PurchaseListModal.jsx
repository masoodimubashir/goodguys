import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ShowMessage } from './ShowMessage';
import { Trash2, ChevronDown, ChevronRight, FileText, Image, Download } from 'lucide-react';

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
        created_at: new Date().toISOString().split('T')[0]
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
            reset();
            setVendorSearchTerm('');
            setShowVendorSuggestions(false);
            setIsNewDescription(false);
            setPreviewUrl(null);
            setFilteredVendors(vendors);
            setData('client_id', client?.id || '');
        }
    }, [show, client]);

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

    const handleSubmit = (e) => {
        
        e.preventDefault();

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
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
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                ShowMessage('error', 'Please fix the errors in the form');
            }
        });
    };

    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setData({
            ...data,
            price: value,
            total: (value * parseFloat(data.qty) * parseFloat(data.multiplier)).toFixed(2)
        });
    };

    const getFileIcon = () => {
        if (!previewUrl && !data.bill_url) return null;
        const fileName = previewUrl ? fileInputRef.current?.files[0]?.name : data.bill_url;
        return fileName?.endsWith('.pdf') ? <FileText size={14} /> : <Image size={14} />;
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
                                        required
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
                                        {errors.vendor_id || errors.description}
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
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.list_name}
                                        </Form.Control.Feedback>
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
                                            required
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
                                            step="0.01"
                                            min="0"
                                            value={data.bill_total}
                                            onChange={(e) => setData('bill_total', parseFloat(e.target.value) || 0)}
                                            isInvalid={!!errors.bill_total}
                                            required
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
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="d-flex align-items-center gap-1"
                                                    onClick={() => {
                                                        if (previewUrl) {
                                                            const link = document.createElement('a');
                                                            link.href = previewUrl;
                                                            link.download = fileInputRef.current.files[0].name;
                                                            link.click();
                                                        } else {
                                                            window.open(`/purchase-list/${data.id}/download`, '_blank');
                                                        }
                                                    }}
                                                >
                                                    <Download size={14} />
                                                    Download
                                                </Button>
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
                                                    <Trash2 size={14} />
                                                </Button>
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
                                            step="1"
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
                                            required
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
                                            step="0.1"
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
                                            required
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
                                            step="0.01"
                                            value={data.price}
                                            onChange={handlePriceChange}
                                            isInvalid={!!errors.price}
                                            required
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
                                            required
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