import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const ClientAccountModal = ({ show, onHide, form, errors, isEditing, handleSubmit, balance }) => {
    const [isReturnPayment, setIsReturnPayment] = useState(false);
    const [returnAmount, setReturnAmount] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        form.setData(name, value);
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsReturnPayment(checked);
        form.setData('payment_flow', !checked); // false when checked (return payment)

        // If it's a return payment, set the amount to the balance value
        if (checked) {
            setReturnAmount(balance || 0);
            form.setData('amount', balance || 0);
        } else {
            setReturnAmount(0);
            form.setData('amount', '');
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setReturnAmount(value);
        form.setData('amount', value);
    };

    useEffect(() => {
        // Reset the form when modal is opened/closed
        if (!show) {
            setIsReturnPayment(false);
            setReturnAmount(0);
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className="text-primary">
                            {isEditing ? 'Edit' : 'Create'} Payment
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
                        />
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

                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Return Amount"
                            checked={isReturnPayment}
                            onChange={handleCheckboxChange}
                        />
                    </Form.Group>

                    {isReturnPayment && (
                        <Form.Group className="mb-3">
                            <Form.Label>Available balance</Form.Label>
                            <Form.Control
                                type="text"
                                value={balance || 0}
                                readOnly
                                plaintext
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>₹</InputGroup.Text>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={returnAmount}
                                onChange={handleAmountChange}
                                isInvalid={!!errors.amount}
                                min="0"
                                max={isReturnPayment ? balance : undefined}
                                step="0.01"
                            />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                            {errors.amount}
                        </Form.Control.Feedback>
                        {isReturnPayment && balance && (
                            <Form.Text className="text-muted">
                                Maximum return amount: ₹{balance}
                            </Form.Text>
                        )}
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