import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

export default function CreateInvoice({ client, modules, inventories }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: client.id,
        client_name: client.client_name,
        client_address: client.client_address,
        service_charge: client?.service_charge?.service_charge ?? 0,
        tax: client.tax || 0,
        products: [
            {
                product_name: "",
                items: [
                    {
                        source: "custom",
                        source_id: null,
                        name: "",
                        description: "",
                        price: '',
                        quantity: '',
                        tax: client.tax || '',
                        item_dimensions: [],
                    },
                ],
            },
        ],
    });

    // Add new product
    const addProduct = () => {
        setData("products", [
            ...data.products,
            {
                product_name: "",
                items: [
                    {
                        source: "custom",
                        source_id: null,
                        name: "",
                        description: "",
                        price: '',
                        quantity: '',
                        tax: client.tax || '',
                        item_dimensions: [],
                    },
                ],
            },
        ]);
    };

    // Add item to specific product
    const addItem = (productIndex) => {
        const newProducts = [...data.products];
        newProducts[productIndex].items.push({
            source: "custom",
            source_id: null,
            name: "",
            description: "",
            price: '',
            quantity: '',
            tax: client.tax || '',
            item_dimensions: [],
        });
        setData("products", newProducts);
    };

    // Remove entire product
    const removeProduct = (productIndex) => {
        const newProducts = [...data.products];
        newProducts.splice(productIndex, 1);
        setData("products", newProducts);
    };

    // Remove item from product
    const removeItem = (productIndex, itemIndex) => {
        const newProducts = [...data.products];
        newProducts[productIndex].items.splice(itemIndex, 1);
        setData("products", newProducts);
    };

    // Update product field
    const updateProduct = (productIndex, field, value) => {
        const newProducts = [...data.products];
        newProducts[productIndex][field] = value;
        setData("products", newProducts);
    };

    // Update item field
    const updateItem = (productIndex, itemIndex, field, value) => {
        const newProducts = [...data.products];
        newProducts[productIndex].items[itemIndex][field] = value;
        setData("products", newProducts);
    };

    // Handle source change for item
    const handleSourceChange = (productIndex, itemIndex, source) => {
        const newProducts = [...data.products];
        newProducts[productIndex].items[itemIndex] = {
            source,
            source_id: null,
            name: "",
            description: "",
            price: '',
            quantity: '',
            tax: data.tax,
            item_dimensions: [],
        };
        setData("products", newProducts);
    };

    // Handle item selection from inventory/module
    const handleItemSelect = (productIndex, itemIndex, sourceId) => {
        const newProducts = [...data.products];
        const parsedId = parseInt(sourceId);
        const item = newProducts[productIndex].items[itemIndex];

        if (item.source === "inventory") {
            const selected = inventories.find((i) => i.id === parsedId);
            if (selected) {
                const price = selected.selling_price || 0;
                newProducts[productIndex].items[itemIndex] = {
                    ...item,
                    source_id: selected.id,
                    name: selected.item_name,
                    description: selected.description || "",
                    price: price,
                    quantity: selected.count || 0,
                    item_dimensions: (selected.item_dimensions || []).map((dim) => {
                        const [type, value, si] = dim.split(",");
                        return { type, value, si };
                    }),
                };
            }
        } else if (item.source === "module") {
            const selected = modules.find((m) => m.id === parsedId);
            if (selected) {
                const price = selected.selling_price || 0;
                newProducts[productIndex].items[itemIndex] = {
                    ...item,
                    source_id: selected.id,
                    name: selected.module_name,
                    description: selected.description || "",
                    price: price,
                    quantity: selected.count || 0,
                    item_dimensions: (selected.fields || []).map((dim) => {
                        const [type, value, si] = dim.split(",");
                        return { type, value, si };
                    }),
                };
            }
        }

        setData("products", newProducts);
    };

    // Handle dimension changes
    const handleDimensionChange = (productIndex, itemIndex, dimIndex, field, value) => {
        const newProducts = [...data.products];
        newProducts[productIndex].items[itemIndex].item_dimensions[dimIndex][field] = value;
        setData("products", newProducts);
    };

    // Add dimension to item
    const addDimension = (productIndex, itemIndex) => {
        const newProducts = [...data.products];
        newProducts[productIndex].items[itemIndex].item_dimensions.push({
            type: "",
            value: "",
            si: ""
        });
        setData("products", newProducts);
    };

    // Remove dimension from item
    const removeDimension = (productIndex, itemIndex, dimIndex) => {
        const newProducts = [...data.products];
        newProducts[productIndex].items[itemIndex].item_dimensions.splice(dimIndex, 1);
        setData("products", newProducts);
    };

    // Calculate totals
    const { subtotal, taxAmount, serviceChargeAmount, total } = data.products.reduce(
        (acc, product) => {
            product.items.forEach((item) => {
                const itemSubtotal = item.quantity * item.price;
                acc.subtotal += itemSubtotal;
                acc.taxAmount += (itemSubtotal * (item.tax || 0)) / 100;
            });
            acc.serviceChargeAmount = (acc.subtotal * data.service_charge) / 100;
            acc.total = acc.subtotal + acc.taxAmount + acc.serviceChargeAmount;
            return acc;
        },
        { subtotal: 0, taxAmount: 0, serviceChargeAmount: 0, total: 0 }
    );

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("invoice.store"), { 
            data: {
                ...data,
                products: data.products.map(product => ({
                    ...product,
                    items: product.items.map(item => ({
                        ...item,
                        item_dimensions: item.item_dimensions.map(dim => 
                            `${dim.type},${dim.value},${dim.si}`
                        ),
                    })),
                })),
            },
            preserveScroll: true 
        });
    };

    return (
        <Container className="py-5">
            <Link href={route("clients.show", [client.id])} className="btn btn-outline-secondary mb-3">
                ← Back
            </Link>

            <Card className="p-4 shadow">
                <h2 className="text-center text-primary mb-4">Create Invoice</h2>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Client Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data.client_name}
                                    onChange={(e) => setData("client_name", e.target.value)}
                                    isInvalid={!!errors.client_name}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Service Charge (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={data.service_charge}
                                    onChange={(e) => setData("service_charge", parseFloat(e.target.value))}
                                    isInvalid={!!errors.service_charge}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label>Client Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={data.client_address}
                            onChange={(e) => setData("client_address", e.target.value)}
                            isInvalid={!!errors.client_address}
                        />
                    </Form.Group>

                    {/* Products Section */}
                    {data.products.map((product, productIndex) => (
                        <Card key={productIndex} className="mb-3 p-3 shadow-sm">
                            <Row className="align-items-center mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={product.product_name}
                                            onChange={(e) =>
                                                updateProduct(productIndex, "product_name", e.target.value)
                                            }
                                            placeholder="Enter product name"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6} className="text-end">
                                    <Button
                                        variant="danger"
                                        onClick={() => removeProduct(productIndex)}
                                        size="sm"
                                        className="me-2"
                                    >
                                        Remove Product
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={() => addItem(productIndex)}
                                        size="sm"
                                    >
                                        + Add Item
                                    </Button>
                                </Col>
                            </Row>

                            {/* Items for this product */}
                            {product.items.map((item, itemIndex) => (
                                <Card key={itemIndex} className="mb-3 p-3">
                                    <Row className="align-items-end">
                                        <Col md={2}>
                                            <Form.Group>
                                                <Form.Label>Source</Form.Label>
                                                <Form.Select
                                                    value={item.source}
                                                    onChange={(e) =>
                                                        handleSourceChange(productIndex, itemIndex, e.target.value)
                                                    }
                                                >
                                                    <option value="custom">Custom</option>
                                                    <option value="inventory">Inventory</option>
                                                    <option value="module">Module</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        {(item.source === "inventory" || item.source === "module") && (
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Select Item</Form.Label>
                                                    <Form.Select
                                                        value={item.source_id || ""}
                                                        onChange={(e) =>
                                                            handleItemSelect(productIndex, itemIndex, e.target.value)
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {(item.source === "inventory" ? inventories : modules).map((el) => (
                                                            <option key={el.id} value={el.id}>
                                                                {item.source === "inventory" ? el.item_name : el.module_name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        )}

                                        <Col md={2}>
                                            <Form.Group>
                                                <Form.Label>Item Name</Form.Label>
                                                <Form.Control
                                                    value={item.name}
                                                    onChange={(e) =>
                                                        updateItem(productIndex, itemIndex, "name", e.target.value)
                                                    }
                                                    disabled={item.source !== "custom"}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={1}>
                                            <Form.Group>
                                                <Form.Label>Qty</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(productIndex, itemIndex, "quantity", parseInt(e.target.value) || '')
                                                    }
                                                    disabled={item.source !== "custom"}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={2}>
                                            <Form.Group>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(productIndex, itemIndex, "price", parseFloat(e.target.value) || 0)
                                                    }
                                                    disabled={item.source !== "custom"}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={1}>
                                            <Form.Group>
                                                <Form.Label>Tax (%)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={item.tax}
                                                    onChange={(e) =>
                                                        updateItem(productIndex, itemIndex, "tax", parseFloat(e.target.value) || 0)
                                                    }
                                                />
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
                                                    onChange={(e) =>
                                                        updateItem(productIndex, itemIndex, "description", e.target.value)
                                                    }
                                                    disabled={item.source !== "custom"}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6} className="mt-3">
                                            <Form.Label>Item Dimensions</Form.Label>
                                            {item.item_dimensions.map((dim, dimIndex) => (
                                                <Row key={dimIndex} className="mb-2">
                                                    <Col md={3}>
                                                        <Form.Control
                                                            placeholder="Type"
                                                            value={dim.type}
                                                            onChange={(e) =>
                                                                handleDimensionChange(
                                                                    productIndex,
                                                                    itemIndex,
                                                                    dimIndex,
                                                                    "type",
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control
                                                            placeholder="Value"
                                                            type="number"
                                                            value={dim.value}
                                                            onChange={(e) =>
                                                                handleDimensionChange(
                                                                    productIndex,
                                                                    itemIndex,
                                                                    dimIndex,
                                                                    "value",
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control
                                                            placeholder="SI Unit"
                                                            value={dim.si}
                                                            onChange={(e) =>
                                                                handleDimensionChange(
                                                                    productIndex,
                                                                    itemIndex,
                                                                    dimIndex,
                                                                    "si",
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Col>
                                                    {item.source === "custom" && (
                                                        <Col md={3}>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeDimension(productIndex, itemIndex, dimIndex)
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    )}
                                                </Row>
                                            ))}
                                            {item.source === "custom" && (
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => addDimension(productIndex, itemIndex)}
                                                >
                                                    + Add Dimension
                                                </Button>
                                            )}
                                        </Col>

                                        <Col md={12} className="text-end mt-3">
                                            <Button
                                                variant="danger"
                                                onClick={() => removeItem(productIndex, itemIndex)}
                                                size="sm"
                                            >
                                                Remove Item
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </Card>
                    ))}

                    <div className="d-flex justify-content-between mb-4">
                        <Button variant="primary" onClick={addProduct}>
                            + Add New Product
                        </Button>
                    </div>

                    <Card className="p-3 shadow-sm mb-4">
                        <Row>
                            <Col md={8}><h5>Invoice Summary</h5></Col>
                            <Col md={4} className="text-end"><h5>Amount (₹)</h5></Col>
                        </Row>
                        <hr />
                        <Row className="mb-2">
                            <Col md={8}>Subtotal</Col>
                            <Col md={4} className="text-end">₹{subtotal.toFixed(2)}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={8}>Total Tax</Col>
                            <Col md={4} className="text-end">₹{taxAmount.toFixed(2)}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={8}>Service Charge ({data.service_charge}%)</Col>
                            <Col md={4} className="text-end">₹{serviceChargeAmount.toFixed(2)}</Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md={8}><h5>Total</h5></Col>
                            <Col md={4} className="text-end"><h5>₹{total.toFixed(2)}</h5></Col>
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