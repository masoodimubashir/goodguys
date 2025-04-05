import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function CreateInventory() {
    const { data, setData, post, processing, errors } = useForm({
        item_name: '',
        selling_price: '',
        buying_price: '',
        item_type: '',
        item_sub_type: '',
        description: '',
        count: '',
        item_dimensions: [{ type: '', value: '', unit: '' }],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('inventory.store'), {
            preserveState: true,
        });
    };

    const handleAddRow = () => {
        if (data.item_dimensions.length < 3) {
            setData("item_dimensions", [...data.item_dimensions, { type: "", value: "", unit: "" }]);
        }
    };

    const handleRemoveRow = (index) => {
        const updated = [...data.item_dimensions];
        updated.splice(index, 1);
        setData("item_dimensions", updated.length ? updated : [{ type: "", value: "", unit: "" }]);
    };

    const handleItemChange = (index, field, value) => {
        const updated = [...data.item_dimensions];
        updated[index][field] = value;
        setData("item_dimensions", updated);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Inventory" />

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
                            <form className="app-form" onSubmit={submit}>
                                <div className="row">
                                    {/* Item Name */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_name" value="Item Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Item Name"
                                                id="item_name"
                                                onChange={(e) => setData('item_name', e.target.value)}
                                                value={data.item_name}
                                            />
                                            <InputError message={errors.item_name} />
                                        </div>
                                    </div>

                                    {/* Selling Price */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="selling_price" value="Selling Price" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Selling Price"
                                                id="selling_price"
                                                type="number"
                                                onChange={(e) => setData('selling_price', e.target.value)}
                                                value={data.selling_price}
                                            />
                                            <InputError message={errors.selling_price} />
                                        </div>
                                    </div>

                                      {/* Item Count */}
                                      <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="count" value="Item Count" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Item Count"
                                                id="count"
                                                type="number"
                                                onChange={(e) => setData('count', e.target.value)}
                                                value={data.count}
                                            />
                                            <InputError message={errors.count} />
                                        </div>
                                    </div>

                                    {/* Buying Price */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="buying_price" value="Buying Price" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Buying Price"
                                                id="buying_price"
                                                type="number"
                                                onChange={(e) => setData('buying_price', e.target.value)}
                                                value={data.buying_price}
                                            />
                                            <InputError message={errors.buying_price} />
                                        </div>
                                    </div>

                                    {/* Item Type */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_type" value="Item Type" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Item Type"
                                                id="item_type"
                                                onChange={(e) => setData('item_type', e.target.value)}
                                                value={data.item_type}
                                            />
                                            <InputError message={errors.item_type} />
                                        </div>
                                    </div>

                                    {/* Item Sub-Type */}
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_sub_type" value="Item Sub-Type" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Item Sub-Type"
                                                id="item_sub_type"
                                                onChange={(e) => setData('item_sub_type', e.target.value)}
                                                value={data.item_sub_type}
                                            />
                                            <InputError message={errors.item_sub_type} />
                                        </div>
                                    </div>                 

                                    {/* Item Dimensions */}
                                    <div className="col-12">
                                        <div className="mb-4">
                                            <InputLabel value="Item Dimensions (Max 3)" />
                                            <InputError message={errors.item_dimensions} />

                                            <div className="list-group rounded">
                                                {data.item_dimensions.map((dim, index) => (
                                                    <div className="list-group-item mb-3 border-0 px-0 py-0" key={index}>
                                                        <div className="row align-attributes-center">
                                                            {/* Type */}
                                                            <div className="col-md-4 mb-2">
                                                                <div className="input-group">
                                                                    <span className="input-group-text">📏</span>
                                                                    <TextInput
                                                                        className="form-control"
                                                                        placeholder="Type (e.g., length)"
                                                                        value={dim.type}
                                                                        onChange={(e) =>
                                                                            handleItemChange(index, 'type', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <InputError message={errors[`item_dimensions.${index}.type`]} />
                                                            </div>

                                                            {/* Value */}
                                                            <div className="col-md-3 mb-2">
                                                                <div className="input-group">
                                                                    <span className="input-group-text">🔢</span>
                                                                    <TextInput
                                                                        className="form-control"
                                                                        placeholder="Value (e.g., 10)"
                                                                        type="number"
                                                                        value={dim.value}
                                                                        onChange={(e) =>
                                                                            handleItemChange(index, 'value', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <InputError message={errors[`item_dimensions.${index}.value`]} />
                                                            </div>

                                                            {/* Unit */}
                                                            <div className="col-md-3 mb-2">
                                                                <div className="input-group">
                                                                    <span className="input-group-text">📐</span>
                                                                    <TextInput
                                                                        className="form-control"
                                                                        placeholder="Unit (e.g., cm)"
                                                                        value={dim.unit}
                                                                        onChange={(e) =>
                                                                            handleItemChange(index, 'unit', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <InputError message={errors[`item_dimensions.${index}.unit`]} />
                                                            </div>

                                                            {/* Add / Remove */}
                                                            <div className="col-md-2 text-md-end text-start mt-1">
                                                                {index === 0 && data.item_dimensions.length < 3 ? (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-success w-100"
                                                                        onClick={handleAddRow}
                                                                        title="Add More"
                                                                    >
                                                                        <i className="fa fa-plus me-1"></i> Add
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger w-100"
                                                                        onClick={() => handleRemoveRow(index)}
                                                                        title="Remove"
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

                                     {/* Description */}
                                     <div className="col-md-12">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="description" value="Description" />
                                            <textarea
                                                id="description"
                                                className="form-control"
                                                placeholder="Enter item description"
                                                rows="3"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                            ></textarea>
                                            <InputError message={errors.description} />
                                        </div>
                                    </div>


                                    {/* Submit */}
                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary" disabled={processing}>
                                                {processing ? 'Submitting...' : 'Submit'}
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
