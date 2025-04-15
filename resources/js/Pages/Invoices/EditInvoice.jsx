import React, { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

// Types
const itemSourceTypes = {
  CUSTOM: "custom",
  INVENTORY: "inventory",
  MODULE: "module"
};

// Helper functions
const calculateTotals = (items, taxRate, serviceChargeRate) => {
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const serviceChargeAmount = (subtotal * serviceChargeRate) / 100;
  const total = subtotal + taxAmount + serviceChargeAmount;

  return { subtotal, taxAmount, serviceChargeAmount, total };
};

// Sub-components
const ItemDimension = ({ dimension, index, itemIndex, handleDimensionChange, removeDimension, isCustomSource }) => (
  <Row className="mb-2">
    <Col md={3}>
      <Form.Control
        placeholder="Type"
        value={dimension.type}
        onChange={(e) => handleDimensionChange(itemIndex, index, "type", e.target.value)}
        disabled={!isCustomSource}
      />
    </Col>
    <Col md={3}>
      <Form.Control
        placeholder="Value"
        type="number"
        value={dimension.value}
        onChange={(e) => handleDimensionChange(itemIndex, index, "value", e.target.value)}
        disabled={!isCustomSource}
      />
    </Col>
    <Col md={3}>
      <Form.Control
        placeholder="SI Unit"
        value={dimension.si}
        onChange={(e) => handleDimensionChange(itemIndex, index, "si", e.target.value)}
        disabled={!isCustomSource}
      />
    </Col>
    {isCustomSource && (
      <Col md={3}>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => removeDimension(itemIndex, index)}
        >
          Remove
        </Button>
      </Col>
    )}
  </Row>
);

const InvoiceItem = ({
  item,
  index,
  inventories,
  modules,
  updateItem,
  removeItem,
  handleSourceChange,
  handleItemSelect,
  handleDimensionChange,
  addDimension,
  removeDimension,
  errors
}) => {
  const isCustomSource = item.source === itemSourceTypes.CUSTOM;

  return (
    <Card className="mb-3 p-3 shadow-sm">
      <Row className="align-items-end">
        <Col md={2}>
          <Form.Group>
            <Form.Label>Source</Form.Label>
            <Form.Select
              value={item.source}
              onChange={(e) => handleSourceChange(index, e.target.value)}
            >
              <option value={itemSourceTypes.CUSTOM}>Custom</option>
              <option value={itemSourceTypes.INVENTORY}>Inventory</option>
              <option value={itemSourceTypes.MODULE}>Module</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {!isCustomSource && (
          <Col md={2}>
            <Form.Group>
              <Form.Label>Select Item</Form.Label>
              <Form.Select
                value={item.source_id || ""}
                onChange={(e) => handleItemSelect(index, e.target.value)}
              >
                <option value="">Select</option>
                {(item.source === itemSourceTypes.INVENTORY ? inventories : modules).map((el) => (
                  <option key={el.id} value={el.id}>
                    {item.source === itemSourceTypes.INVENTORY ? el.item_name : el.module_name}
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
              onChange={(e) => updateItem(index, "name", e.target.value)}
              disabled={!isCustomSource}
              isInvalid={!!errors[`items.${index}.name`]}
            />
            {errors[`items.${index}.name`] && (
              <Form.Control.Feedback type="invalid">
                {errors[`items.${index}.name`]}
              </Form.Control.Feedback>
            )}
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
              isInvalid={!!errors[`items.${index}.quantity`]}
            />
            {errors[`items.${index}.quantity`] && (
              <Form.Control.Feedback type="invalid">
                {errors[`items.${index}.quantity`]}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={item.price}
              onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
              disabled={!isCustomSource}
              isInvalid={!!errors[`items.${index}.price`]}
            />
            {errors[`items.${index}.price`] && (
              <Form.Control.Feedback type="invalid">
                {errors[`items.${index}.price`]}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <div className="form-control bg-light">
              ₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}
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
              disabled={!isCustomSource}
              isInvalid={!!errors[`items.${index}.description`]}
            />
            {errors[`items.${index}.description`] && (
              <Form.Control.Feedback type="invalid">
                {errors[`items.${index}.description`]}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>

        <Col md={6} className="mt-3">
          <Form.Label>Item Dimensions</Form.Label>
          {item.item_dimensions.map((dim, dimIndex) => (
            <ItemDimension
              key={dimIndex}
              dimension={dim}
              index={dimIndex}
              itemIndex={index}
              handleDimensionChange={handleDimensionChange}
              removeDimension={removeDimension}
              isCustomSource={isCustomSource}
            />
          ))}
          {isCustomSource && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => addDimension(index)}
            >
              + Add Dimension
            </Button>
          )}
        </Col>

        <Col md={12} className="text-end mt-3">
          <Button
            variant="danger"
            onClick={() => removeItem(index)}
            size="sm"
          >
            Remove Item
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

const InvoiceClientDetails = ({ data, setData, errors }) => (
  <Row className="mb-4">
    <Col md={3}>
      <Form.Group>
        <Form.Label>Client Name</Form.Label>
        <Form.Control
          type="text"
          value={data.client_name}
          onChange={(e) => setData("client_name", e.target.value)}
          isInvalid={!!errors.client_name}
        />
        {errors.client_name && (
          <Form.Control.Feedback type="invalid">
            {errors.client_name}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </Col>
    <Col md={3}>
      <Form.Group>
        <Form.Label>Tax (%)</Form.Label>
        <Form.Control
          type="number"
          value={data.tax}
          onChange={(e) => setData("tax", parseFloat(e.target.value) || 0)}
        />
      </Form.Group>
    </Col>
    <Col md={3}>
      <Form.Group>
        <Form.Label>Service Charge (%)</Form.Label>
        <Form.Control
          type="number"
          value={data.service_charge}
          onChange={(e) => setData("service_charge", parseFloat(e.target.value) || 0)}
        />
      </Form.Group>
    </Col>
    <Col md={12} className="mt-3">
      <Form.Group>
        <Form.Label>Client Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          value={data.client_address}
          onChange={(e) => setData("client_address", e.target.value)}
          isInvalid={!!errors.client_address}
        />
        {errors.client_address && (
          <Form.Control.Feedback type="invalid">
            {errors.client_address}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </Col>
  </Row>
);

const InvoiceSummary = ({ subtotal, taxRate, serviceChargeRate, taxAmount, serviceChargeAmount, total }) => (
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
      <Col md={8}>Tax ({taxRate}%)</Col>
      <Col md={4} className="text-end">₹{taxAmount.toFixed(2)}</Col>
    </Row>
    <Row className="mb-2">
      <Col md={8}>Service Charge ({serviceChargeRate}%)</Col>
      <Col md={4} className="text-end">₹{serviceChargeAmount.toFixed(2)}</Col>
    </Row>
    <hr />
    <Row>
      <Col md={8}><h5>Total</h5></Col>
      <Col md={4} className="text-end"><h5>₹{total.toFixed(2)}</h5></Col>
    </Row>
  </Card>
);

// Main component
export default function EditInvoice({ invoice_ref, modules, inventories }) {

  const mapInvoiceItemsToFormData = () => {

    return invoice_ref.invoices.map(invoice => {
      const parsedDimensions = invoice.additional_description ?
        JSON.parse(invoice.additional_description) : [];

      // Determine source (inventory, module, or custom)
      let source = itemSourceTypes.CUSTOM;
      let source_id = null;

      // Check if this item matches an inventory item
      const matchingInventory = inventories.find(inv =>
        inv.item_name === invoice.item_name &&
        inv.selling_price === invoice.price
      );

      if (matchingInventory) {
        source = itemSourceTypes.INVENTORY;
        source_id = matchingInventory.id;
      } else {
        // Check if this item matches a module
        const matchingModule = modules.find(mod =>
          mod.module_name === invoice.item_name &&
          mod.selling_price === invoice.price
        );

        if (matchingModule) {
          source = itemSourceTypes.MODULE;
          source_id = matchingModule.id;
        }
      }

      return {
        id: invoice.id,
        source: source,
        source_id: source_id,
        name: invoice.item_name,
        description: invoice.description,
        price: invoice.price,
        quantity: invoice.count,
        item_dimensions: parsedDimensions.map(dim => ({
          type: dim.type,
          value: dim.value,
          si: dim.si
        })),
      };
    });
  };

  // Initialize form with existing invoice_ref data
  const { data, setData, put, processing, errors } = useForm({
    id: invoice_ref.id,
    client_id: invoice_ref.client_id,
    client_name: invoice_ref.client?.client_name || "",
    client_address: invoice_ref.client?.client_address || "",
    invoice_number: invoice_ref.invoice_number,
    tax: invoice_ref.client?.tax || 0,
    service_charge: invoice_ref.client?.service_charge?.service_charge || 0,
    items: mapInvoiceItemsToFormData(),
  });


  // Item management functions
  const addItem = () => {
    setData("items", [
      ...data.items,
      {
        source: itemSourceTypes.CUSTOM,
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
  };

  const handleSourceChange = (index, source) => {
    const newItems = [...data.items];
    const { tax, service_charge } = newItems[index];

    newItems[index] = {
      source,
      source_id: null,
      name: "",
      description: "",
      price: '',
      quantity: '',
      tax,
      service_charge,
      item_dimensions: [],
    };

    setData("items", newItems);
  };

  const handleItemSelect = (index, sourceId) => {
    if (!sourceId) return;

    const newItems = [...data.items];
    const parsedId = parseInt(sourceId);
    const isInventory = newItems[index].source === itemSourceTypes.INVENTORY;

    const collection = isInventory ? inventories : modules;
    const selected = collection.find((item) => item.id === parsedId);

    if (selected) {
      const { tax, service_charge } = newItems[index];
      const nameField = isInventory ? 'item_name' : 'module_name';
      const dimensionsField = isInventory ? 'item_dimensions' : 'fields';

      newItems[index] = {
        ...newItems[index],
        source_id: selected.id,
        name: selected[nameField],
        description: selected.description || "",
        price: selected.selling_price || 0,
        quantity: selected.count || 1, // Default to 1 for better UX
        tax,
        service_charge,
        item_dimensions: (selected[dimensionsField] || []).map((dim) => {
          if (typeof dim === 'string') {
            const [type, value, si] = dim.split(",");
            return { type, value, si };
          }
          return dim; // Already in object format
        }),
      };
    }

    setData("items", newItems);
  };

  // Dimension management functions
  const handleDimensionChange = (itemIndex, dimIndex, field, value) => {
    const newItems = [...data.items];
    newItems[itemIndex].item_dimensions[dimIndex][field] = value;
    setData("items", newItems);
  };

  const addDimension = (itemIndex) => {
    const newItems = [...data.items];
    newItems[itemIndex].item_dimensions.push({ type: "", value: "", si: "" });
    setData("items", newItems);
  };

  const removeDimension = (itemIndex, dimIndex) => {
    const newItems = [...data.items];
    newItems[itemIndex].item_dimensions.splice(dimIndex, 1);
    setData("items", newItems);
  };

  // Calculate invoice totals
  const { subtotal, taxAmount, serviceChargeAmount, total } = calculateTotals(
    data.items,
    data.tax || 0,
    data.service_charge || 0
  );

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
      id: data.id,
      client_id: data.client_id,
      client_name: data.client_name,
      client_address: data.client_address,
      invoice_number: data.invoice_number,
      tax: data.tax,
      service_charge: data.service_charge,
      items: data.items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        additional_description: JSON.stringify(item.item_dimensions)
      })),
    };

    // Send the update request
    put(route("invoice.update", invoice_ref.id), payload, {
      preserveScroll: true
    });
  };

  return (
    <Container className="py-5">

      <Link href={route("clients.show", [data.client_id])} className="btn btn-outline-secondary mb-3">
        ← Back
      </Link>

      <Card className="p-4 shadow">
        <h2 className="text-center text-primary mb-4">Edit Invoice</h2>

        <Form onSubmit={handleSubmit}>
          <InvoiceClientDetails
            data={data}
            setData={setData}
            errors={errors}
          />

          {data.items.map((item, index) => (
            <InvoiceItem
              key={`item-${index}`}
              item={item}
              index={index}
              inventories={inventories}
              modules={modules}
              updateItem={updateItem}
              removeItem={removeItem}
              handleSourceChange={handleSourceChange}
              handleItemSelect={handleItemSelect}
              handleDimensionChange={handleDimensionChange}
              addDimension={addDimension}
              removeDimension={removeDimension}
              errors={errors}
            />
          ))}

          <Button variant="success" onClick={addItem} className="mb-4">
            + Add Item
          </Button>

          <InvoiceSummary
            subtotal={subtotal}
            taxRate={data.tax || 0}
            serviceChargeRate={data.service_charge || 0}
            taxAmount={taxAmount}
            serviceChargeAmount={serviceChargeAmount}
            total={total}
          />

          <div className="text-end">
            <Button type="submit" variant="primary" disabled={processing}>
              Update Invoice
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}