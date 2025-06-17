import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const ClientAccountModal = ({
    show,
    onHide,
    isEditing,
    balance,
    client,
    setPurchaseItems,
    setFilteredItems
}) => {
    // Initialize form with default values
    const { data, setData, post, put, processing, errors, reset } = useForm({
        client_id: client?.id,
        payment_type: '',
        amount: '',
        narration: '',
        payment_flow: true,
        created_at: new Date().toISOString().split('T')[0],
    });

    const [isReturnPayment, setIsReturnPayment] = useState(false);
    const [returnAmount, setReturnAmount] = useState(0);

    // Initialize form with initialData when provided (for editing)
    useEffect(() => {
        reset();
        setIsReturnPayment(false);
        setReturnAmount();
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsReturnPayment(checked);
        setData('payment_flow', !checked);

        if (checked) {
            setReturnAmount(balance);
            setData('amount', balance);
        } else {
            setReturnAmount();
            setData('amount', '');
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setReturnAmount(value);
        setData('amount', value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing && initialData?.id
            ? `/client-account/${initialData.id}`
            : '/client-account';

        const method = isEditing ? put : post;

        method(url, {
            preserveScroll: true,
            onSuccess: (page) => {
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
                            value={data.payment_type}
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
                            name="created_at"
                            value={data.created_at}
                            onChange={handleChange}
                            isInvalid={!!errors.created_at}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.created_at}
                        </Form.Control.Feedback>
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
                            value={data.narration}
                            onChange={handleChange}
                            isInvalid={!!errors.narration}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.narration}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </>
                        ) : (
                            isEditing ? 'Update' : 'Create'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ClientAccountModal;