import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";


export const PurchaseListModal = ({
    show,
    onHide,
    form,
    errors,
    isEditing,
    handleSubmit,
    vendors
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('bill', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title>{isEditing ? 'Edit' : 'Create'} Purchase List</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                <Modal.Body className="pt-0">
                    <div className="row">



                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Vendor Name</Form.Label>
                                <Form.Select
                                    value={form.data.vendor_id}
                                    onChange={e => {
                                        const selectedVendor = vendors.find(v => v.id === parseInt(e.target.value));
                                        form.setData('vendor_id', e.target.value);
                                        form.setData('vendor_name', selectedVendor ? selectedVendor.vendor_name : '');
                                    }}
                                    isInvalid={!!errors.vendor_id}
                                >
                                    <option value="">Select Vendor</option>
                                    {vendors.map(vendor => (
                                        <option key={vendor.id} value={vendor.id}>{vendor.vendor_name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.vendor_id}</Form.Control.Feedback>
                            </Form.Group>
                        </div>


                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>List Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={form.data.list_name}
                                    onChange={(e) => form.setData('list_name', e.target.value)}
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
                                    value={form.data.purchase_date}
                                    onChange={(e) => form.setData('purchase_date', e.target.value)}
                                    isInvalid={!!errors.purchase_date}
                                />
                                <Form.Control.Feedback type="invalid">{errors.purchase_date}</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Bill Total</Form.Label>
                                <Form.Control
                                    type="integer"
                                    value={form.data.bill_total}
                                    onChange={(e) => form.setData('bill_total', e.target.value)}
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

                                {(previewUrl || form.data.bill_url) && (
                                    <div className="mt-2">
                                        <a
                                            href={previewUrl || form.data.bill_url}
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

                        <div className="col-md-12">
                            <Form.Group className="mb-3">
                                <Form.Label>Bill Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    value={form.data.bill_description}
                                    onChange={(e) => form.setData('bill_description', e.target.value)}
                                    isInvalid={!!errors.bill_description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.bill_description}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>

                    </div>


                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={onHide}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={form.processing}>
                        {form.processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                Processing...
                            </>
                        ) : isEditing ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};