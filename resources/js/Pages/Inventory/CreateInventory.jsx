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
        count: '',
        attributes: [{ dimension: '', size: '' }],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('inventory.store'), {
            preserveState: true,
        });
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

    const handleItemChange = (index, field, value) => {
        const updated = [...data.attributes];
        updated[index][field] = value;
        setData("attributes", updated);
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
                                    <div className="col-md-6">
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
                                    <div className="col-md-6">
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

                                    {/* Dimensions & Sizes */}
                                    <div className="col-12">
                                        <div className="mb-4">
                                            <InputLabel value="Dimensions & Sizes (Max 3 rows)" />
                                            <InputError message={errors.attributes} />

                                            <div className="list-group rounded">
                                                {data.attributes.map((attr, index) => (
                                                    <div className="list-group-item mb-3 border-0 px-0 py-0" key={index}>
                                                        <div className="row align-attributes-center">
                                                            {/* Dimension */}
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

                                                            {/* Size */}
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

                                                            {/* Add/Remove Buttons */}
                                                            <div className="col-md-2 text-md-end text-start mt-1">
                                                                {index === 0 && data.attributes.length < 3 ? (
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
