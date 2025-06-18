import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ShowMessage } from './ShowMessage';

export const PurchaseListModal = ({
    show,
    onHide,
    vendors,
    isEditing,
    setPurchaseItems,
    setFilteredItems,
    client
}) => {


    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_id: '',
        vendor_name: '',
        client_id: client?.id,
        list_name: '',
        purchase_date: new Date().toISOString().split('T')[0],
        bill: null,
        bill_total: '',
        bill_description: '',
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    // Reset form when modal shows/hides
    useEffect(() => {
        if (show) {

            reset();
            setPreviewUrl(null);
        }
    }, [show]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('bill', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    const handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });

        post('/purchase-list', formData, {
            preserveScroll: true,
            onSuccess: (page) => {


                if (page.props.purchase_items) {
                    setPurchaseItems(page.props.purchase_items);
                    setFilteredItems(page.props.purchase_items);
                }

                if (page.props.message) {
                    ShowMessage('success', page.props.message);
                }
            },
            onError: (errors) => {
                ShowMessage('error', errors?.message || 'Operation failed');
            }
        });

        reset();
        setPreviewUrl(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Modal.Body className="p-4">
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Party Name</Form.Label>
                                <Form.Select
                                    value={data.vendor_id}
                                    onChange={e => {
                                        const selectedVendor = vendors.find(v => v.id === parseInt(e.target.value));
                                        setData('vendor_id', e.target.value);
                                        setData('vendor_name', selectedVendor ? selectedVendor.vendor_name : '');
                                    }}
                                    isInvalid={!!errors.vendor_id}
                                >
                                    <option value="">Select Party</option>
                                    {vendors.map(vendor => (
                                        <option key={vendor.id} value={vendor.id}>
                                            {vendor.vendor_name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.vendor_id}</Form.Control.Feedback>
                            </Form.Group>
                        </div>

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
                                    type="file"
                                    onChange={handleFileChange}
                                    isInvalid={!!errors.bill}
                                    accept="image/*,application/pdf"
                                />
                                <Form.Control.Feedback type="invalid">{errors.bill}</Form.Control.Feedback>

                                {(previewUrl || data.bill_url) && (
                                    <div className="mt-2">
                                        <a
                                            href={previewUrl || data.bill_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <i className="ti ti-file me-1"></i>
                                            {previewUrl ? 'Preview File' : 'View Current File'}
                                        </a>
                                    </div>
                                )}
                            </Form.Group>
                        </div>

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
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                     <Button variant="light" onClick={onHide} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        ) : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
