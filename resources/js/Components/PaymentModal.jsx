
import { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from '@inertiajs/react';
import InputError from './InputError';
import { ShowMessage } from './ShowMessage';

export const PaymentModal = ({
    show,
    onHide,
    client,
    client_vendors,
    setPurchaseItems,
    setFilteredItems
}) => {
    const [vendorSearchTerm, setVendorSearchTerm] = useState('');
    const [showVendorSuggestions, setShowVendorSuggestions] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showCustomFields, setShowCustomFields] = useState(false);
    const vendorInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: client?.id,
        vendor_id: '',
        vendor_name: '',
        description: '',
        amount: '',
        // Custom fields
        qty: 1,
        multiplier: 1,
        unit_type: '',
        narration: '',
        created_at: new Date().toISOString().split('T')[0]
    });

    // Filter vendors based on search term
    const filteredVendors = client_vendors.filter(vendor =>
        vendor.vendor_name.toLowerCase().includes(vendorSearchTerm.toLowerCase())
    );

    // Handle vendor selection
    const handleVendorSelect = (vendor) => {
        setSelectedVendor(vendor);
        setVendorSearchTerm(vendor.vendor_name);
        setShowVendorSuggestions(false);
        setShowCustomFields(false);
        setData({
            ...data,
            vendor_id: vendor.id,
            vendor_name: vendor.vendor_name,
            description: vendor.vendor_name
        });
    };

    // Handle vendor input change
    const handleVendorInputChange = (e) => {
        const value = e.target.value;
        setVendorSearchTerm(value);
        setShowVendorSuggestions(true);
        setData('vendor_name', value);
        setData('description', value);
    };

    // Handle key down for vendor input
    const handleVendorKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (filteredVendors.length > 0) {
                handleVendorSelect(filteredVendors[0]);
            } else if (vendorSearchTerm) {
                // Show custom fields when no vendor matches
                setShowCustomFields(true);
                setShowVendorSuggestions(false);
                setSelectedVendor(null);
            }
            e.preventDefault();
        } else if (e.key === 'Backspace' && selectedVendor && vendorSearchTerm === selectedVendor.vendor_name) {
            // Clear selected vendor when backspace is pressed on a selected vendor
            setSelectedVendor(null);
            setVendorSearchTerm('');
            setShowCustomFields(false);
            setData({
                ...data,
                vendor_id: '',
                vendor_name: '',
                description: ''
            });
            e.preventDefault();
        }
    };

    // Calculate total for custom entries
    const calculateTotal = () => {
        return (parseFloat(data.amount)) * (parseInt(data.qty) * (parseInt(data.multiplier)));
    };

    // Reset form when modal opens
    useEffect(() => {
        if (show) {
            reset();
            setVendorSearchTerm('');
            setSelectedVendor(null);
            setShowVendorSuggestions(false);
            setShowCustomFields(false);
            setData({
                ...data,
                qty: 1,
                multiplier: 1,
                created_at: new Date().toISOString().split('T')[0]
            });
        }
    }, [show]);

    const handleSubmit = (e) => {

        e.preventDefault();

        const url = showCustomFields
            ? '/purchased-item'
            : '/purchase-list-payments';

        const method = post;

        method(url, {
            preserveScroll: true,
            onSuccess: (page) => {
                ShowMessage('success', 'Record created successfully');
                onHide();
                reset();
                if (page.props.purchase_items) {
                    setPurchaseItems(page.props.purchase_items);
                    setFilteredItems(page.props.purchase_items);
                }
            },
        });
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    <div className="row">
                        {/* Party/Description Field - Always shown */}
                        <div className="col-md-12 mb-3">
                            <Form.Group>
                                <Form.Label>Party/Description</Form.Label>
                                <div className="position-relative">

                                    <>
                                        <Form.Control
                                            ref={vendorInputRef}
                                            type="text"
                                            placeholder="Click to search parties or enter description"
                                            value={vendorSearchTerm}
                                            onChange={handleVendorInputChange}
                                            onKeyDown={handleVendorKeyDown}
                                            onFocus={() => setShowVendorSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowVendorSuggestions(false), 200)}
                                            isInvalid={!!errors.description}
                                        />
                                        {showVendorSuggestions && (
                                            <div className="position-absolute bg-white border mt-1 w-100 shadow-sm z-3"
                                                style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {filteredVendors.length > 0 ? (
                                                    filteredVendors.map(vendor => (
                                                        <div key={vendor.id}
                                                            className="px-3 py-2 cursor-pointer hover-bg-light text-black"
                                                            onClick={() => handleVendorSelect(vendor)}
                                                            onMouseDown={(e) => e.preventDefault()}>
                                                            {vendor.vendor_name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-muted">
                                                        {vendorSearchTerm ?
                                                            "Press Enter to use as custom description" :
                                                            "No parties found"}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                </div>
                                <InputError message={errors.description} />
                            </Form.Group>
                        </div>
                        {/* Date Field - Always shown */}
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={data.created_at}
                                    onChange={(e) => setData('created_at', e.target.value)}
                                    isInvalid={!!errors.created_at}
                                />
                                <InputError message={errors.created_at} />
                            </Form.Group>
                        </div>

                        {/* Amount Field - Always shown */}
                        <div className={`${showCustomFields ? 'col-md-6' : 'col-md-6'} mb-3`}>
                            <Form.Group>
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    isInvalid={!!errors.amount}
                                />
                                <InputError message={errors.amount} />
                            </Form.Group>
                        </div>

                        {/* Additional fields - Only shown when entering custom description */}
                        {showCustomFields && (
                            <>
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={data.qty}
                                            onChange={(e) => setData('qty', e.target.value)}
                                            isInvalid={!!errors.qty}
                                        />
                                        <InputError message={errors.qty} />
                                    </Form.Group>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Multiplier</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={data.multiplier}
                                            onChange={(e) => setData('multiplier', e.target.value)}
                                            isInvalid={!!errors.multiplier}
                                        />
                                        <InputError message={errors.multiplier} />
                                    </Form.Group>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Unit Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.unit_type}
                                            onChange={(e) => setData('unit_type', e.target.value)}
                                            isInvalid={!!errors.unit_type}
                                        />
                                        <InputError message={errors.unit_type} />
                                    </Form.Group>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Total</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={calculateTotal().toFixed(2)}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </>
                        )}

                        {/* Narration Field - Always shown */}
                        <div className="col-md-12 mb-3">
                            <Form.Group>
                                <Form.Label>Narration</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={data.narration}
                                    onChange={(e) => setData('narration', e.target.value)}
                                    isInvalid={!!errors.narration}
                                />
                                <InputError message={errors.narration} />
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={onHide} disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                        ) : (
                            'Save'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};