import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ClientAccountModal = ({ show, onHide, form, errors, isEditing, handleSubmit }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        form.setData(name, value);

    };


    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className="text-primary">
                            {isEditing ? 'Edit' : 'Create'}  Payment
                        </h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Payment Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="payment_type"
                            value={form.data.payment_type}
                            onChange={handleChange}
                            isInvalid={!!errors.payment_type}
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.payment_type}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name='created_at'
                            value={form.data.created_at}
                            onChange={handleChange}
                            isInvalid={!!errors.created_at}
                        />
                        <Form.Control.Feedback type="invalid">{errors.created_at}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Payment Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="payment_flow"
                            value={form.data.payment_flow}
                            onChange={handleChange}
                            isInvalid={!!errors.payment_flow}
                        >
                            <option value="">Select flow</option>
                            <option value="in">In</option>
                            <option value="out">Out</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.payment_flow}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            value={form.data.amount}
                            onChange={handleChange}
                            isInvalid={!!errors.amount}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.amount}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Narration</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="narration"
                            value={form.data.narration}
                            onChange={handleChange}
                            isInvalid={!!errors.narration}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.narration}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ClientAccountModal;
