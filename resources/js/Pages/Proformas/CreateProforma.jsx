import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

export default function CreateProforma({ client, modules, inventories }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: client.id,
        client_name: client.client_name,
        client_address: client.client_address,
        tax: client.tax,
        service_charge: client.service_charge,
        items: [
            {
                source: "custom",
                source_id: null,
                name: "",
                description: "",
                price: '',
                quantity: '',
                item_dimensions: [],
            },
        ],
    });

    // Client-side validation state
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Client validation
        if (!data.client_id) {
            newErrors.client_id = "Client ID is required";
        }
        if (!data.client_name) {
            newErrors.client_name = "Client name is required";
        }
        if (!data.client_address) {
            newErrors.client_address = "Client address is required";
        }
        if (!data.tax && data.tax !== 0) {
            newErrors.tax = "Tax is required";
        } else if (isNaN(data.tax)) {
            newErrors.tax = "Tax must be a number";
        }
        if (!data.service_charge && data.service_charge !== 0) {
            newErrors.service_charge = "Service charge is required";
        } else if (isNaN(data.service_charge)) {
            newErrors.service_charge = "Service charge must be a number";
        }

        // Items validation
        if (!data.items || data.items.length === 0) {
            newErrors.items = "At least one item is required";
        } else {
            data.items.forEach((item, index) => {
                // Source validation
                if (!item.source || !['custom', 'module', 'inventory'].includes(item.source)) {
                    newErrors[`items.${index}.source`] = "Valid source is required";
                }

                // Name validation
                if (!item.name) {
                    newErrors[`items.${index}.name`] = "Item name is required";
                }

                // Description validation
                if (!item.description) {
                    newErrors[`items.${index}.description`] = "Description is required";
                }

                // Price validation
                if (item.price === '' || item.price === null) {
                    newErrors[`items.${index}.price`] = "Price is required";
                } else if (isNaN(item.price) || parseFloat(item.price) < 0) {
                    newErrors[`items.${index}.price`] = "Price must be a non-negative number";
                }

                // Quantity validation
                if (item.quantity === '' || item.quantity === null) {
                    newErrors[`items.${index}.quantity`] = "Quantity is required";
                } else if (isNaN(item.quantity) || parseInt(item.quantity) < 1) {
                    newErrors[`items.${index}.quantity`] = "Quantity must be at least 1";
                }

                // Item dimensions validation
                if (!item.item_dimensions || item.item_dimensions.length === 0) {
                    newErrors[`items.${index}.item_dimensions`] = "At least one dimension is required";
                } else {
                    item.item_dimensions.forEach((dim, dimIndex) => {
                        // Type validation
                        if (!dim.type) {
                            newErrors[`items.${index}.item_dimensions.${dimIndex}.type`] = "Type is required";
                        }

                        // Value validation
                        if (dim.value === '' || dim.value === null) {
                            newErrors[`items.${index}.item_dimensions.${dimIndex}.value`] = "Value is required";
                        } else if (isNaN(dim.value)) {
                            newErrors[`items.${index}.item_dimensions.${dimIndex}.value`] = "Value must be a number";
                        }

                        // SI unit validation
                        if (!dim.si) {
                            newErrors[`items.${index}.item_dimensions.${dimIndex}.si`] = "SI unit is required";
                        }
                    });
                }
            });
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addItem = () => {
        setData("items", [
            ...data.items,
            {
                source: "custom",
                source_id: null,
                name: "",
                description: "",
                price: '',
                quantity: '',
                item_dimensions: [],
            },
        ]);
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData("items", newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData("items", newItems);
        
        // Clear specific validation error when field is updated
        if (validationErrors[`items.${index}.${field}`]) {
            const newValidationErrors = { ...validationErrors };
            delete newValidationErrors[`items.${index}.${field}`];
            setValidationErrors(newValidationErrors);
        }
    };

    const handleSourceChange = (index, source) => {
        const newItems = [...data.items];
        newItems[index] = {
            source,
            source_id: null,
            name: "",
            description: "",
            price: '',
            quantity: '',
            item_dimensions: [],
        };
        setData("items", newItems);
        
        // Clear item-related validation errors
        const newValidationErrors = { ...validationErrors };
        Object.keys(newValidationErrors).forEach(key => {
            if (key.startsWith(`items.${index}.`)) {
                delete newValidationErrors[key];
            }
        });
        setValidationErrors(newValidationErrors);
    };

    const handleItemSelect = (index, sourceId) => {
        const newItems = [...data.items];
        const parsedId = parseInt(sourceId);

        if (newItems[index].source === "inventory") {
            const selected = inventories.find((i) => i.id === parsedId);
            if (selected) {
                newItems[index] = {
                    ...newItems[index],
                    source_id: selected.id,
                    name: selected.item_name,
                    description: selected.description || "",
                    price: selected.selling_price || 0,
                    quantity: selected.count || 0,
                    item_dimensions: (selected.item_dimensions || []).map((dim) => {
                        const [type, value, si] = dim.split(",");
                        return { type, value, si };
                    }),
                };
            }
        } else if (newItems[index].source === "module") {
            const selected = modules.find((m) => m.id === parsedId);
            if (selected) {
                newItems[index] = {
                    ...newItems[index],
                    source_id: selected.id,
                    name: selected.module_name,
                    description: selected.description || "",
                    price: selected.selling_price || 0,
                    quantity: selected.count || 0,
                    item_dimensions: (selected.fields || []).map((dim) => {
                        const [type, value, si] = dim.split(",");
                        return { type, value, si };
                    }),
                };
            }
        }

        setData("items", newItems);
        
        // Clear item-related validation errors
        const newValidationErrors = { ...validationErrors };
        Object.keys(newValidationErrors).forEach(key => {
            if (key.startsWith(`items.${index}.`)) {
                delete newValidationErrors[key];
            }
        });
        setValidationErrors(newValidationErrors);
    };

    const handleDimensionChange = (itemIndex, dimIndex, field, value) => {
        const newItems = [...data.items];
        newItems[itemIndex].item_dimensions[dimIndex][field] = value;
        setData("items", newItems);
        
        // Clear specific dimension validation error
        if (validationErrors[`items.${itemIndex}.item_dimensions.${dimIndex}.${field}`]) {
            const newValidationErrors = { ...validationErrors };
            delete newValidationErrors[`items.${itemIndex}.item_dimensions.${dimIndex}.${field}`];
            setValidationErrors(newValidationErrors);
        }
    };

    const addDimension = (itemIndex) => {
        const newItems = [...data.items];
        newItems[itemIndex].item_dimensions.push({ type: "", value: "", si: "" });
        setData("items", newItems);
        
        // Clear item dimensions array validation error if it exists
        if (validationErrors[`items.${itemIndex}.item_dimensions`]) {
            const newValidationErrors = { ...validationErrors };
            delete newValidationErrors[`items.${itemIndex}.item_dimensions`];
            setValidationErrors(newValidationErrors);
        }
    };

    const removeDimension = (itemIndex, dimIndex) => {
        const newItems = [...data.items];
        newItems[itemIndex].item_dimensions.splice(dimIndex, 1);
        setData("items", newItems);
    };

    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxAmount = (subtotal * data.tax) / 100;
    const serviceChargeAmount = (subtotal * data.service_charge) / 100;
    const total = subtotal + taxAmount + serviceChargeAmount;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Stop submission if validation fails
            return;
        }

        // Flatten item_dimensions before sending
        const payload = {
            ...data,
            items: data.items.map(item => ({
                ...item,
                item_dimensions: item.item_dimensions.map(dim =>
                    `${dim.type},${dim.value},${dim.si}`
                ),
            })),
        };

        post(route("proforma.store"), { data: payload, preserveScroll: true });
    };
    
    // Helper function to get combined error message (server + client)
    const getErrorMessage = (field) => {
        return errors[field] || validationErrors[field];
    };

    return (
        <Container className="py-5">
            <Link href={route("clients.show", [client.id])} className="btn btn-outline-secondary mb-3">
                ← Back
            </Link>

            <Card className="p-4 shadow">
                <h2 className="text-center text-primary mb-4">Create Proforma</h2>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-4">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Client Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data.client_name}
                                    onChange={(e) => {
                                        setData("client_name", e.target.value);
                                        if (validationErrors.client_name) {
                                            const newValidationErrors = { ...validationErrors };
                                            delete newValidationErrors.client_name;
                                            setValidationErrors(newValidationErrors);
                                        }
                                    }}
                                    isInvalid={!!getErrorMessage("client_name")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {getErrorMessage("client_name")}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Tax (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={data.tax}
                                    onChange={(e) => {
                                        setData("tax", parseFloat(e.target.value));
                                        if (validationErrors.tax) {
                                            const newValidationErrors = { ...validationErrors };
                                            delete newValidationErrors.tax;
                                            setValidationErrors(newValidationErrors);
                                        }
                                    }}
                                    isInvalid={!!getErrorMessage("tax")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {getErrorMessage("tax")}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Service Charge (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={data.service_charge}
                                    onChange={(e) => {
                                        setData("service_charge", parseFloat(e.target.value));
                                        if (validationErrors.service_charge) {
                                            const newValidationErrors = { ...validationErrors };
                                            delete newValidationErrors.service_charge;
                                            setValidationErrors(newValidationErrors);
                                        }
                                    }}
                                    isInvalid={!!getErrorMessage("service_charge")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {getErrorMessage("service_charge")}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label>Client Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={data.client_address}
                            onChange={(e) => {
                                setData("client_address", e.target.value);
                                if (validationErrors.client_address) {
                                    const newValidationErrors = { ...validationErrors };
                                    delete newValidationErrors.client_address;
                                    setValidationErrors(newValidationErrors);
                                }
                            }}
                            isInvalid={!!getErrorMessage("client_address")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getErrorMessage("client_address")}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {validationErrors.items && (
                        <div className="alert alert-danger mb-3">
                            {validationErrors.items}
                        </div>
                    )}

                    {data.items.map((item, index) => (
                        <Card key={index} className="mb-3 p-3 shadow-sm">
                            <Row className="align-items-end">
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Source</Form.Label>
                                        <Form.Select
                                            value={item.source}
                                            onChange={(e) => handleSourceChange(index, e.target.value)}
                                            isInvalid={!!getErrorMessage(`items.${index}.source`)}
                                        >
                                            <option value="custom">Custom</option>
                                            <option value="inventory">Inventory</option>
                                            <option value="module">Module</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {getErrorMessage(`items.${index}.source`)}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {(item.source === "inventory" || item.source === "module") && (
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Select Item</Form.Label>
                                            <Form.Select
                                                value={item.source_id || ""}
                                                onChange={(e) => handleItemSelect(index, e.target.value)}
                                                isInvalid={!!getErrorMessage(`items.${index}.source_id`)}
                                            >
                                                <option value="">Select</option>
                                                {(item.source === "inventory" ? inventories : modules).map((el) => (
                                                    <option key={el.id} value={el.id}>
                                                        {item.source === "inventory" ? el.item_name : el.module_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {getErrorMessage(`items.${index}.source_id`)}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                )}

                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Item Name</Form.Label>
                                        <Form.Control
                                            value={item.name}
                                            onChange={(e) => updateItem(index, "name", e.target.value)}
                                            disabled={item.source !== "custom"}
                                            isInvalid={!!getErrorMessage(`items.${index}.name`)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {getErrorMessage(`items.${index}.name`)}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || '')}
                                            disabled={item.source !== "custom"}
                                            isInvalid={!!getErrorMessage(`items.${index}.quantity`)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {getErrorMessage(`items.${index}.quantity`)}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                                            disabled={item.source !== "custom"}
                                            isInvalid={!!getErrorMessage(`items.${index}.price`)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {getErrorMessage(`items.${index}.price`)}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Amount</Form.Label>
                                        <div className="form-control bg-light">
                                            ₹{(item.quantity * item.price).toFixed(2)}
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col md={6} className="mt-3">
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={item.description}
                                            onChange={(e) => updateItem(index, "description", e.target.value)}
                                            disabled={item.source !== "custom"}
                                            isInvalid={!!getErrorMessage(`items.${index}.description`)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {getErrorMessage(`items.${index}.description`)}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6} className="mt-3">
                                    <Form.Label>Item Dimensions</Form.Label>
                                    {validationErrors[`items.${index}.item_dimensions`] && (
                                        <div className="text-danger mb-2 small">
                                            {validationErrors[`items.${index}.item_dimensions`]}
                                        </div>
                                    )}
                                    {item.item_dimensions.map((dim, dimIndex) => (
                                        <Row key={dimIndex} className="mb-2">
                                            <Col md={3}>
                                                <Form.Control
                                                    placeholder="Type"
                                                    value={dim.type}
                                                    onChange={(e) => handleDimensionChange(index, dimIndex, "type", e.target.value)}
                                                    disabled={item.source !== "custom"}
                                                    isInvalid={!!getErrorMessage(`items.${index}.item_dimensions.${dimIndex}.type`)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {getErrorMessage(`items.${index}.item_dimensions.${dimIndex}.type`)}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Control
                                                    placeholder="Value"
                                                    type="number"
                                                    value={dim.value}
                                                    onChange={(e) => handleDimensionChange(index, dimIndex, "value", e.target.value)}
                                                    disabled={item.source !== "custom"}
                                                    isInvalid={!!getErrorMessage(`items.${index}.item_dimensions.${dimIndex}.value`)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {getErrorMessage(`items.${index}.item_dimensions.${dimIndex}.value`)}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Control
                                                    placeholder="SI Unit"
                                                    value={dim.si}
                                                    onChange={(e) => handleDimensionChange(index, dimIndex, "si", e.target.value)}
                                                    disabled={item.source !== "custom"}
                                                    isInvalid={!!getErrorMessage(`items.${index}.item_dimensions.${dimIndex}.si`)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {getErrorMessage(`items.${index}.item_dimensions.${dimIndex}.si`)}
                                                </Form.Control.Feedback>
                                            </Col>
                                            {item.source === "custom" && (
                                                <Col md={3}>
                                                    <Button variant="outline-danger" size="sm" onClick={() => removeDimension(index, dimIndex)}>
                                                        Remove
                                                    </Button>
                                                </Col>
                                            )}
                                        </Row>
                                    ))}
                                    {item.source === "custom" && (
                                        <Button variant="outline-primary" size="sm" onClick={() => addDimension(index)}>
                                            + Add Dimension
                                        </Button>
                                    )}
                                </Col>

                                <Col md={12} className="text-end mt-3">
                                    <Button variant="danger" onClick={() => removeItem(index)} size="sm">
                                        Remove Item
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}

                    <Button variant="success" onClick={addItem} className="mb-4">
                        + Add Item
                    </Button>

                    <Card className="p-3 shadow-sm mb-4">
                        <Row>
                            <Col md={8}><h5>Invoice Summary</h5></Col>
                            <Col md={4} className="text-end"><h5>Amount (₹)</h5></Col>
                        </Row>
                        <hr />
                        <Row className="mb-2">
                            <Col md={8}>Subtotal</Col>
                            <Col md={4} className="text-end">₹{subtotal}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={8}>Tax ({data.tax}%)</Col>
                            <Col md={4} className="text-end">₹{taxAmount}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={8}>Service Charge ({data.service_charge}%)</Col>
                            <Col md={4} className="text-end">₹{serviceChargeAmount}</Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md={8}><h5>Total</h5></Col>
                            <Col md={4} className="text-end"><h5>₹{total}</h5></Col>
                        </Row>
                    </Card>

                    <div className="text-end">
                        <Button type="submit" variant="primary" disabled={processing}>
                            Create Invoice
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}