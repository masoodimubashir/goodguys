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
        show_all_prices: true,
        products: [
            {
                product_name: client.site_name || '',
                items: [
                    {
                        source: "custom",
                        source_id: null,
                        name: "",
                        description: "",
                        price: '',
                        quantity: '',
                        tax: client.tax || 0,
                        item_dimensions: [],
                    },
                ],
            },
        ],
    });

    // Toggle all prices visibility
    const toggleAllPricesVisibility = (isVisible) => {
        setData("show_all_prices", isVisible);

        // Update all items to reflect the global setting
        const newProducts = data.products.map(product => ({
            ...product,
            items: product.items.map(item => ({
                ...item,
            }))
        }));

        setData("products", newProducts);
    };

    // Add new product
    const addProduct = () => {
        setData("products", [
            ...data.products,
            {
                product_name: client.site_name || "",
                items: [
                    {
                        source: "custom",
                        source_id: null,
                        name: "",
                        description: "",
                        price: '',
                        quantity: '',
                        tax: client.tax || 0,
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
            tax: client.tax || 0,
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
        }
        else if (item.source === "module") {
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
                            value: parts[2] || "",
                            si: parts[1] || ""
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

    // Calculate totals - always using the actual price values
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
                show_all_prices: data.show_all_prices
            },
            preserveScroll: true
        });
    };

    return (

        <Container className="py-2 col-lg-8 col-md-10 mt-4">

            <Link href={route("clients.show", [client.id])} className="btn btn-link text-decoration-none">
                ← Back
            </Link>

            <Card className="p-4 shadow-sm rounded-4 border-0">

                <h4 className="text-center text-primary fw-bold mb-3">Create Quotation</h4>

                <Form onSubmit={handleSubmit}>
                    
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Client Name</Form.Label>
                                <Form.Control
                                    size="sm"
                                    disabled
                                    type="text"
                                    value={data.client_name}
                                    onChange={(e) => setData("client_name", e.target.value)}
                                    isInvalid={!!errors.client_name}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Price Visibility</Form.Label>
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

                        <Col md={4} >
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Client Address</Form.Label>
                                <Form.Control
                                    size="sm"
                                    disabled
                                    as="textarea"
                                    rows={1}
                                    value={data.client_address}
                                    onChange={(e) => setData("client_address", e.target.value)}
                                    isInvalid={!!errors.client_address}
                                />
                            </Form.Group>
                        </Col>


                    </Row>

                    <hr />


                    {/* Products Section */}
                    {data.products.map((product, productIndex) => (
                        <Card key={productIndex}>
                            <Row className="align-items-center mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            value={product.product_name}
                                            onChange={(e) => updateProduct(productIndex, "product_name", e.target.value)}
                                            placeholder="Enter product name"
                                            disabled={client.site_name}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="text-end">
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeProduct(productIndex)}
                                        className="me-2"
                                    >
                                        <i className="ti ti-trash"></i> Remove
                                    </Button>
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => addItem(productIndex)}
                                    >
                                        <i className="ti ti-plus"></i> Add
                                    </Button>
                                </Col>
                            </Row>

                            {/* Items */}
                            {product.items.map((item, itemIndex) => (
                                <Card key={itemIndex} className="mb-3  border-0 bg-light-subtle
                                ">
                                    <Row className="g-3">
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

                                                    type="text"
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

                                                    type="text"
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

                                        <Col md={6}>
                                            {item.item_dimensions.map((dim, dimIndex) => (
                                                <Row key={dimIndex} className="g-2 mb-2">
                                                    <Col md={3}>
                                                        <Form.Control
                                                            size="sm"
                                                            placeholder="Type"
                                                            value={dim.type}
                                                            onChange={(e) => handleDimensionChange(productIndex, itemIndex, dimIndex, "type", e.target.value)}
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control
                                                            size="sm"
                                                            placeholder="Value"
                                                            type="number"
                                                            value={dim.value}
                                                            onChange={(e) => handleDimensionChange(productIndex, itemIndex, dimIndex, "value", e.target.value)}
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control
                                                            size="sm"
                                                            placeholder="SI Unit"
                                                            value={dim.si}
                                                            onChange={(e) => handleDimensionChange(productIndex, itemIndex, dimIndex, "si", e.target.value)}
                                                            disabled={item.source !== "custom"}
                                                        />
                                                    </Col>
                                                    {item.source === "custom" && (
                                                        <Col md="3">
                                                            <Button
                                                                variant="outline-danger"
                                                                onClick={() => removeDimension(productIndex, itemIndex, dimIndex)}
                                                            >
                                                                <i className="ti ti-trash"></i>
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
                                                    + Add
                                                </Button>
                                            )}
                                        </Col>

                                        <Col md={6} className="text-end mt-3">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeItem(productIndex, itemIndex)}
                                            >
                                                <i className="ti ti-trash"></i> Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </Card>
                    ))}


                    <hr />

                    <div className="d-flex justify-content-end mb-5">
                        <Button variant="primary btn-sm" onClick={addProduct}>
                            + Add
                        </Button>
                    </div>

                    {/* Invoice Summary */}
                    <Card className="p-3 border  rounded-3 ">
                        <h5 className="fw-bold mb-4">Invoice Summary</h5>
                        <Row className="mb-2">
                            <Col>Subtotal</Col>
                            <Col className="text-end">₹{subtotal.toFixed(2)}</Col>
                        </Row>


                        <hr />
                        <Row className="fw-bold">
                            <Col>Total</Col>
                            <Col className="text-end">₹{total.toFixed(2)}</Col>
                        </Row>
                    </Card>

                    <div className="text-end">
                        <Button type="submit" variant="success" size="sm" disabled={processing}>
                            Create
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>

    );
}



