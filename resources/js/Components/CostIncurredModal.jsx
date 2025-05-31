import { Button, Form, Modal } from "react-bootstrap";

export const CostIncurredModal = ({
    show,
    onHide,
    form,
    errors,
    isLoading,
    isEditing,
    handleSubmit
}) => (
    <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title>{isEditing ? 'Edit' : 'Create'} Cost Incurred</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
            <Modal.Body className="pt-0">
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Entry Name</Form.Label>
                            <Form.Control
                                name="entry_name"
                                value={form.data.entry_name}
                                onChange={(e) => form.setData('entry_name', e.target.value)}
                                isInvalid={!!errors.entry_name}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.entry_name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Count</Form.Label>
                            <Form.Control
                                type="number"
                                name="count"
                                value={form.data.count}
                                onChange={(e) => form.setData('count', e.target.value)}
                                isInvalid={!!errors.count}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.count}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Selling Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="selling_price"
                                value={form.data.selling_price}
                                onChange={(e) => form.setData('selling_price', e.target.value)}
                                isInvalid={!!errors.selling_price}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.selling_price}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Buying Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="buying_price"
                                value={form.data.buying_price}
                                onChange={(e) => form.setData('buying_price', e.target.value)}
                                isInvalid={!!errors.buying_price}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.buying_price}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <input type="hidden" name="client_id" value={form.data.client_id} />
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onHide} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading || form.processing}>
                    {isLoading || form.processing ? (
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