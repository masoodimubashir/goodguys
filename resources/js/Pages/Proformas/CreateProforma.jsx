import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Container, Card, Row, Col, Form, Button, Accordion } from "react-bootstrap";

export default function CreateProforma({ client, modules, inventories }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: client.id,
        client_name: client.client_name,
        client_address: client.client_address,
        service_charge: client?.service_charge?.service_charge ?? 0,
        site_name: client?.site_name || "",
        show_all_prices: true,
        created_at: new Date().toISOString().split('T')[0],
        products: [
            {
                module_name: "",
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
            },
        ],
    });

    // Toggle all prices visibility
    const toggleAllPricesVisibility = (isVisible) => {
        setData("show_all_prices", isVisible);
    };

    // Add new product
    const addProduct = () => {
        setData("products", [
            ...data.products,
            {
                module_name: "",
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

        // If last item is removed, remove the entire product
        if (newProducts[productIndex].items.length === 0) {
            newProducts.splice(productIndex, 1);
        }

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
                        const parts = dim.split(",");
                        return {
                            type: parts[0] || "",
                            value: parts[1] || "",
                            si: parts[2] || ""
                        };
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
        post(route("proforma.store"), {
            preserveScroll: true
        });
    };

    return (
        <Container className="py-2 col-lg-10 col-xl-8">
            <Link href={route("clients.show", [client.id])} className="btn btn-link text-decoration-none">
                ← Back to Client
            </Link>

            <Card className="p-4 shadow-sm rounded-4 border-0">
                <h4 className="text-center text-primary mb-5 fw-bold">Create Estimate</h4>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-4 g-3">

                        <Col md={4}>
                            <Form.Group>
                                <Form.Control
                                    size="sm"
                                    disabled
                                    type="text"
                                    value={data.client_name}
                                    isInvalid={!!errors.client_name}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Control
                                    size="sm"
                                    as="textarea"
                                    disabled
                                    rows={1}
                                    value={data.client_address}
                                    isInvalid={!!errors.client_address}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) => setData("site_name", parseFloat(e.target.value) || 0)}
                                    isInvalid={!!errors.site_name}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Control
                                    size="sm"
                                    type="date"
                                    value={data.created_at}
                                    onChange={(e) => setData("created_at", e.target.value)}
                                    isInvalid={!!errors.created_at}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Check
                                    size="sm"
                                    type="switch"
                                    id="price-visibility-switch"
                                    label={data.show_all_prices ? "Showing all prices" : "Hiding all prices"}
                                    checked={data.show_all_prices}
                                    onChange={(e) => toggleAllPricesVisibility(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr />

                    {/* Products Section */}
                    <Accordion defaultActiveKey="0" alwaysOpen className="mb-4">
                        {data.products.map((product, productIndex) => (
                            <Accordion.Item key={productIndex} eventKey={String(productIndex)} className="mb-3">
                                <Accordion.Header>
                                    <div className="d-flex justify-content-between w-100 pe-3">
                                        <span>
                                            Module : {product.module_name || "N/A"}
                                        </span>
                                        <span className="badge bg-primary rounded-pill">
                                            {product.items.length} items
                                        </span>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row className="mb-3">
                                        <Col md={8}>
                                            <Form.Group>
                                                <Form.Label>Unit Name</Form.Label>
                                                <Form.Control
                                                    size="sm"
                                                    value={product.module_name}
                                                    onChange={(e) => updateProduct(productIndex, "module_name", e.target.value)}
                                                    placeholder="Enter product name"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="d-flex align-items-end justify-content-end">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeProduct(productIndex)}
                                                className="me-2"
                                            >
                                                <i className="ti ti-trash"></i>
                                            </Button>
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={() => addItem(productIndex)}
                                            >
                                                <i className="ti ti-plus"></i> Add Item
                                            </Button>
                                        </Col>
                                    </Row>

                                    {/* Items */}
                                    {product.items.map((item, itemIndex) => (
                                        <Card key={itemIndex} className="mb-3 border-0 bg-light-subtle p-3">
                                            <Row className="g-3">
                                                <Col md={12}>
                                                    <h6 className="mb-3">Item {itemIndex + 1}</h6>
                                                </Col>

                                                <Col md={2}>
                                                    <Form.Group>
                                                        <Form.Label>Source</Form.Label>
                                                        <Form.Select
                                                            size="sm"
                                                            value={item.source}
                                                            onChange={(e) => handleSourceChange(productIndex, itemIndex, e.target.value)}
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
                                                                size="sm"
                                                                value={item.source_id || ""}
                                                                onChange={(e) => handleItemSelect(productIndex, itemIndex, e.target.value)}
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
                                                            size="sm"
                                                            value={item.name}
                                                            onChange={(e) => updateItem(productIndex, itemIndex, "name", e.target.value)}
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={1}>
                                                    <Form.Group>
                                                        <Form.Label>Qty</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            type="number"
                                                            value={item.quantity}
                                                            min="0"
                                                            onChange={(e) => updateItem(productIndex, itemIndex, "quantity", parseInt(e.target.value) || '')}
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={2}>
                                                    <Form.Group>
                                                        <Form.Label>Price</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            type="number"
                                                            step="0.01"
                                                            value={item.price}
                                                            onChange={(e) => updateItem(productIndex, itemIndex, "price", parseFloat(e.target.value) || 0)}
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={2}>
                                                    <Form.Group>
                                                        <Form.Label>Amount</Form.Label>
                                                        <div className="form-control bg-body-secondary">
                                                            ₹{(item.quantity * item.price).toFixed(2)}
                                                        </div>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            as="textarea"
                                                            rows={2}
                                                            value={item.description}
                                                            onChange={(e) => updateItem(productIndex, itemIndex, "description", e.target.value)}
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <h6 className="mt-3 mb-2">Dimensions</h6>
                                                    {item.item_dimensions.map((dim, dimIndex) => (
                                                        <Row key={dimIndex} className="g-2 mb-2">
                                                            <Col md={3}>
                                                                <Form.Control
                                                                    size="sm"
                                                                    placeholder="Type"
                                                                    type="text"
                                                                    value={dim.type}
                                                                    onChange={(e) => handleDimensionChange(productIndex, itemIndex, dimIndex, "type", e.target.value)}
                                                                    disabled={item.source !== "custom"}
                                                                />
                                                            </Col>
                                                            <Col md={3}>
                                                                <Form.Control
                                                                    size="sm"
                                                                    placeholder="Value"
                                                                    type="text"
                                                                    value={dim.value}
                                                                    onChange={(e) => handleDimensionChange(productIndex, itemIndex, dimIndex, "value", e.target.value)}
                                                                    disabled={item.source !== "custom"}
                                                                />
                                                            </Col>
                                                            <Col md={3}>
                                                                <Form.Control
                                                                    size="sm"
                                                                    placeholder="SI Unit"
                                                                    type="text"
                                                                    value={dim.si}
                                                                    onChange={(e) => handleDimensionChange(productIndex, itemIndex, dimIndex, "si", e.target.value)}
                                                                    disabled={item.source !== "custom"}
                                                                />
                                                            </Col>
                                                            {item.source === "custom" && (
                                                                <Col md={3}>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-danger"
                                                                        onClick={() => removeDimension(productIndex, itemIndex, dimIndex)}
                                                                    >
                                                                        <i className="ti ti-trash"></i> Remove
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
                                                            className="mt-2"
                                                        >
                                                            <i className="ti ti-plus"></i> Add Dimension
                                                        </Button>
                                                    )}
                                                </Col>

                                                <Col md={12} className="text-end mt-3">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => removeItem(productIndex, itemIndex)}
                                                    >
                                                        <i className="ti ti-trash"></i> Remove Item
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                    <div className="d-flex justify-content-end mb-4">
                        <Button variant="primary" size="sm" onClick={addProduct}>
                            <i className="ti ti-plus"></i> Add Product
                        </Button>
                    </div>

                    <hr />

                    {/* Proforma Summary */}
                    <Card className="p-3 border rounded-3 mb-4">
                        <h5 className="fw-bold mb-4">Estimate Summary</h5>
                        <Row className="mb-2">
                            <Col>Subtotal</Col>
                            <Col className="text-end">₹{subtotal.toFixed(2)}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>Service Charge ({data.service_charge}%)</Col>
                            <Col className="text-end">₹{serviceChargeAmount.toFixed(2)}</Col>
                        </Row>
                        <hr />
                        <Row className="fw-bold">
                            <Col>Total</Col>
                            <Col className="text-end">₹{total.toFixed(2)}</Col>
                        </Row>
                    </Card>

                    <div className="text-end">
                        <Button type="submit" variant="success" size="sm" disabled={processing}>
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}