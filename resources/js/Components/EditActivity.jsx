import { router, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditActivity = ({
    show,
    onHide,
    activity,
    setPurchaseItems,
    setFilteredItems
}) => {


    const { data, setData, processing, errors } = useForm({
        description: '',
        unit_type: '',
        qty: 1,
        price: 0,
        narration: '',
        multiplier: 1,
        payment_flow: '',
        is_credited: false,
        amount: 0,
        payment_type: '',
        created_at: '',
        purchase_date: '',
        list_name: '',
        total: 0,
        bill_description: '',
        bill_url: null,
        bill: null
    });

    useEffect(() => {
        if (activity) {
            // Format dates for input fields (YYYY-MM-DD)
            const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            const baseData = {
                description: activity.description || '',
                unit_type: activity.unit_type || '',
                qty: activity.qty || 1,
                price: activity.price || 0,
                narration: activity.narration || '',
                multiplier: activity.multiplier || 1,
                payment_flow: activity.payment_flow ?? '',
                is_credited: activity.is_credited || false,
                amount: activity.amount || activity.price || 0,
                payment_type: activity.payment_type || '',
                created_at: formatDate(activity.created_at),
                purchase_date: formatDate(activity.purchase_date),
                list_name: activity.list_name || '',
                total: activity.total || 0,
                bill_description: activity.bill_description || '',
                bill_url: activity.bill_url || null,
                bill: null // Explicitly set bill to null initially
            };
            setData(baseData);
        }
    }, [activity]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === 'checkbox' ? checked : value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('bill', file);
        } else {
            setData('bill', null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let routeName;
        switch (activity?.model_type) {
            case 'App\\Models\\ClientAccount':
                routeName = 'client-account.update';
                break;
            case 'App\\Models\\PurchaseList':
                routeName = 'purchase-list.update';
                break;
            case 'App\\Models\\PurchaseListPayment':
                routeName = 'purchase-list-payments.update';
                break;
            case 'App\\Models\\PurchasedItem':
                routeName = 'purchased-item.update';
                break;
            case 'App\\Models\\ReturnList':
                routeName = 'return-list.update';
                break;
            default:
                routeName = 'activity.update';
        }

        try {
            const formData = new FormData();

            // Append all data fields
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (key === 'bill' && value instanceof File) {
                        formData.append('bill', value, value.name);
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            // Method spoofing for PUT request
            formData.append('_method', 'PUT');

            // Using router.post with method spoofing
            await router.post(route(routeName, activity.id), formData, {
                onSuccess: (page) => {
                    if (page.props.purchase_items) {
                        setPurchaseItems(page.props.purchase_items);
                        setFilteredItems(page.props.purchase_items);
                    }
                    onHide();
                },
                onError: (errors) => {
                }
            });

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    const renderError = (field) => {
        return errors[field] ? (
            <Form.Control.Feedback type="invalid">
                {errors[field]}
            </Form.Control.Feedback>
        ) : null;
    };

    useEffect(() => {
        const calculatedTotal = data.qty * data.multiplier * data.price;
        setData('total', isNaN(calculatedTotal) ? 0 : calculatedTotal);
    }, [data.qty, data.multiplier, data.price]);

    const renderModelSpecificFields = () => {
        switch (activity?.model_type) {
            case 'App\\Models\\ClientAccount':
                return (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Payment Description</Form.Label>
                            <Form.Control
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                isInvalid={!!errors.description}
                            />
                            {renderError('payment_type')}
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
                            {renderError('created_at')}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={data.amount}
                                onChange={handleChange}
                                isInvalid={!!errors.amount}
                            />
                            {renderError('amount')}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Narration</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="narration"
                                value={data.narration}
                                onChange={handleChange}
                                isInvalid={!!errors.narration}
                            />
                            {renderError('narration')}
                        </Form.Group>
                    </>
                );

            case 'App\\Models\\PurchaseList':
                return (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Party</Form.Label>
                                    <Form.Control
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        isInvalid={!!errors.description}
                                    />
                                    {renderError('description')}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Reference Name</Form.Label>
                                    <Form.Control
                                        name="unit_type"
                                        value={data.unit_type}
                                        onChange={handleChange}
                                        isInvalid={!!errors.unit_type}
                                    />
                                    {renderError('unit_type')}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Purchase Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="created_at"
                                        value={data.created_at}
                                        onChange={handleChange}
                                        isInvalid={!!errors.created_at}
                                    />
                                    {renderError('created_at')}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bill Total</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="total"
                                        value={data.total}
                                        onChange={handleChange}
                                        isInvalid={!!errors.total}
                                    />
                                    {renderError('total')}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Bill (Image or PDF)</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                                isInvalid={!!errors.bill}
                            />
                            {renderError('bill')}

                          
                        </Form.Group>



                        <Form.Group className="mb-3">
                            <Form.Label>Bill Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="narration"
                                value={data.narration}
                                onChange={handleChange}
                                isInvalid={!!errors.narration}
                            />
                            {renderError('narration"')}
                        </Form.Group>
                    </>
                );

            case 'App\\Models\\PurchaseListPayment':
                return (
                    <>
                        <Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Party</Form.Label>
                                <Form.Control
                                    name="description"
                                    value={data.description}
                                    onChange={handleChange}
                                    isInvalid={!!errors.description}
                                />
                                {renderError('description')}
                            </Form.Group>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="created_at"
                                        value={data.created_at}
                                        onChange={handleChange}
                                        isInvalid={!!errors.created_at}
                                    />
                                    {renderError('created_at')}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={data.amount}
                                        onChange={handleChange}
                                        isInvalid={!!errors.amount}
                                    />
                                    {renderError('amount')}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Narration</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="narration"
                                value={data.narration}
                                onChange={handleChange}
                                isInvalid={!!errors.narration}
                            />
                            {renderError('narration')}
                        </Form.Group>
                    </>
                );

            case 'App\\Models\\PurchaseItem':
                return (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unit Type</Form.Label>
                                    <Form.Control
                                        name="unit_type"
                                        value={data.unit_type}
                                        onChange={handleChange}
                                        isInvalid={!!errors.unit_type}
                                    />
                                    {renderError('unit_type')}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Payment Flow</Form.Label>
                                    <Form.Select
                                        name="payment_flow"
                                        value={data.payment_flow}
                                        onChange={handleChange}
                                        isInvalid={!!errors.payment_flow}
                                    >
                                        <option value="1">Credit (In)</option>
                                        <option value="0">Debit (Out)</option>
                                    </Form.Select>
                                    {renderError('payment_flow')}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                isInvalid={!!errors.description}
                            />
                            {renderError('description')}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={data.price}
                                onChange={handleChange}
                                isInvalid={!!errors.price}
                            />
                            {renderError('price')}
                        </Form.Group>
                    </>
                );

            case 'App\\Models\\ReturnList':
                return (
                    <>
                        <Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    name="description"
                                    value={data.description}
                                    onChange={handleChange}
                                    isInvalid={!!errors.description}
                                />
                                {renderError('description')}
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={data.price}
                                    onChange={handleChange}
                                    isInvalid={!!errors.price}
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="created_at"
                                    value={data.created_at}
                                    onChange={handleChange}
                                    isInvalid={!!errors.created_at}
                                />
                                {renderError('created_at')}
                            </Form.Group>
                        </Row>

                        <Form.Group>
                            <Form.Label>Narration</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="narration"
                                value={data.narration}
                                onChange={handleChange}
                                isInvalid={!!errors.narration}
                            />
                            {renderError('narration')}
                        </Form.Group>
                    </>
                );

            default:
                return (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        isInvalid={!!errors.description}
                                    />
                                    {renderError('description')}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unit Type</Form.Label>
                                    <Form.Control
                                        name="unit_type"
                                        value={data.unit_type}
                                        onChange={handleChange}
                                        isInvalid={!!errors.unit_type}
                                    />
                                    {renderError('unit_type')}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="qty"
                                        value={data.qty}
                                        onChange={handleChange}
                                        isInvalid={!!errors.qty}
                                    />
                                    {renderError('qty')}
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Multiplier</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="multiplier"
                                        value={data.multiplier}
                                        onChange={handleChange}
                                        isInvalid={!!errors.multiplier}
                                    />
                                    {renderError('multiplier')}
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="price"
                                        value={data.price}
                                        onChange={handleChange}
                                        isInvalid={!!errors.price}
                                    />
                                    {renderError('price')}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Total</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="total"
                                        value={data.total}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="created_at"
                                        value={data.created_at}
                                        onChange={handleChange}
                                        isInvalid={!!errors.created_at}
                                    />
                                    {renderError('created_at')}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>Narration</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="narration"
                                value={data.narration}
                                onChange={handleChange}
                                isInvalid={!!errors.narration}
                            />
                            {renderError('narration')}
                        </Form.Group>
                    </>
                );
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" encType="multipart/form-data">
            <Modal.Header closeButton>
                <Modal.Title>
                    <h5 className="text-primary">
                        Edit {activity?.model_type?.split('\\').pop() || 'Activity'}
                    </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {renderModelSpecificFields()}
                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditActivity;