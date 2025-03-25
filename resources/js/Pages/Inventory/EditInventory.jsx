import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Button from "@/Components/Button";
import { ShowMessage } from "@/Components/ShowMessage";

export default function EditInventory({ inventory }) {
    const { data, setData, put, processing, errors } = useForm({
        item_name: inventory.item_name || "",
        selling_price: inventory.selling_price || "",
        buying_price: inventory.buying_price || "",
        item_type: inventory.item_type || "",
        count: inventory.count || 0,
        attributes:
            (inventory.item_dimension || []).length > 0
                ? inventory.item_dimension.map((dimension, index) => ({
                      dimension,
                      size: inventory.item_size?.[index] || "",
                  }))
                : [{ dimension: "", size: "" }],
    });

    const handleItemChange = (index, field, value) => {
        const updated = [...data.attributes];
        updated[index][field] = value;
        setData("attributes", updated);
    };

    const handleAddRow = () => {
        if (data.attributes.length < 3) {
            setData("attributes", [...data.attributes, { dimension: "", size: "" }]);
        }
    };

    const handleRemoveRow = (index) => {
        const updated = [...data.attributes];
        updated.splice(index, 1);
        setData("attributes", updated.length ? updated : [{ dimension: "", size: "" }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const item_dimension = data.attributes.map(attr => attr.dimension);
        const item_size = data.attributes.map(attr => attr.size);

        put(route("inventory.update", inventory.id), {
            preserveScroll: true,
            data: {
                item_name: data.item_name,
                selling_price: data.selling_price,
                buying_price: data.buying_price,
                item_type: data.item_type,
                count: data.count,
                item_dimension,
                item_size,
            },
            onSuccess: () => ShowMessage("success", "Item updated successfully"),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Inventory" />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('inventory.index')} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('inventory.index')} className="f-s-14 f-w-500">Back</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="app-form" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_name" value="Item Name" />
                                            <TextInput
                                                className="form-control"
                                                id="item_name"
                                                value={data.item_name}
                                                onChange={(e) => setData("item_name", e.target.value)}
                                                placeholder="Enter Item Name"
                                            />
                                            <InputError message={errors.item_name} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="selling_price" value="Selling Price" />
                                            <TextInput
                                                className="form-control"
                                                id="selling_price"
                                                type="number"
                                                value={data.selling_price}
                                                onChange={(e) => setData("selling_price", e.target.value)}
                                                placeholder="Enter Selling Price"
                                            />
                                            <InputError message={errors.selling_price} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="buying_price" value="Buying Price" />
                                            <TextInput
                                                className="form-control"
                                                id="buying_price"
                                                type="number"
                                                value={data.buying_price}
                                                onChange={(e) => setData("buying_price", e.target.value)}
                                                placeholder="Enter Buying Price"
                                            />
                                            <InputError message={errors.buying_price} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_type" value="Item Type" />
                                            <TextInput
                                                className="form-control"
                                                id="item_type"
                                                value={data.item_type}
                                                onChange={(e) => setData("item_type", e.target.value)}
                                                placeholder="Enter Item Type"
                                            />
                                            <InputError message={errors.item_type} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="count" value="Item Count" />
                                            <TextInput
                                                className="form-control"
                                                id="count"
                                                type="number"
                                                value={data.count}
                                                onChange={(e) => setData("count", e.target.value)}
                                                placeholder="Enter Item Count"
                                            />
                                            <InputError message={errors.count} />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="mb-4">
                                            <InputLabel value="Dimensions & Sizes (Max 3 rows)" />
                                            <InputError message={errors.attributes} />

                                            <div className="list-group rounded">
                                                {data.attributes.map((attr, index) => (
                                                    <div className="list-group-item mb-3 border-0 px-0 py-0" key={index}>
                                                        <div className="row align-attributes-center">
                                                            <div className="col-md-5 mb-2 mb-md-0 pe-md-1">
                                                                <div className="input-group">
                                                                    <span className="input-group-text">📏</span>
                                                                    <TextInput
                                                                        className="form-control"
                                                                        placeholder="Dimension"
                                                                        value={attr.dimension}
                                                                        onChange={(e) =>
                                                                            handleItemChange(index, 'dimension', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <InputError message={errors[`attributes.${index}.dimension`]} />
                                                            </div>

                                                            <div className="col-md-5 mb-2 mb-md-0 ps-md-1 pe-md-1">
                                                                <div className="input-group">
                                                                    <span className="input-group-text">📐</span>
                                                                    <TextInput
                                                                        className="form-control"
                                                                        placeholder="Size"
                                                                        value={attr.size}
                                                                        onChange={(e) =>
                                                                            handleItemChange(index, 'size', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <InputError message={errors[`attributes.${index}.size`]} />
                                                            </div>

                                                            <div className="col-md-2 text-md-end text-start mt-1">
                                                                {index === 0 && data.attributes.length < 3 ? (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-success w-100"
                                                                        onClick={handleAddRow}
                                                                    >
                                                                        <i className="fa fa-plus me-1"></i> Add
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger w-100"
                                                                        onClick={() => handleRemoveRow(index)}
                                                                    >
                                                                        <i className="fa fa-trash me-1"></i> Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary" disabled={processing}>
                                                {processing ? "Updating..." : "Update Item"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
