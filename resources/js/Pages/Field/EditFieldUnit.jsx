import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Select from "react-select"; 

export default function EditInventory({ inventory, itemTypes }) {
    const itemTypeOptions = itemTypes.map(type => ({
        value: type.id,
        label: type.name
    }));

    const selectedItemType = itemTypeOptions.find(option => option.value === inventory.item_type_id);

    const { data, setData, put, processing, errors } = useForm({
        item_name: inventory.item_name,
        selling_price: inventory.selling_price,
        buying_price: inventory.buying_price,
        item_type_id: selectedItemType ? selectedItemType.value : "",
        item_dimension: inventory.item_dimension,
        item_size: inventory.item_size,
        count: inventory.count,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('inventory.update', inventory.id), {
            preserveScroll: true,
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
                                <i className="iconoir-home-alt"></i>
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
                                            {errors.item_name && <InputError message={errors.item_name} />}
                                        </div>
                                    </div>

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
                                            {errors.selling_price && <InputError message={errors.selling_price} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
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
                                            {errors.buying_price && <InputError message={errors.buying_price} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_type_id" value="Item Type" />
                                            <Select
                                                id="item_type_id"
                                                options={itemTypeOptions}
                                                value={itemTypeOptions.find(option => option.value === data.item_type_id)}
                                                onChange={(selected) => setData('item_type_id', selected.value)}
                                            />
                                            {errors.item_type_id && <InputError message={errors.item_type_id} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_dimension" value="Item Dimension" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Item Dimension"
                                                id="item_dimension"
                                                onChange={(e) => setData('item_dimension', e.target.value)}
                                                value={data.item_dimension}
                                            />
                                            {errors.item_dimension && <InputError message={errors.item_dimension} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_size" value="Item Size" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Item Size"
                                                id="item_size"
                                                onChange={(e) => setData('item_size', e.target.value)}
                                                value={data.item_size}
                                            />
                                            {errors.item_size && <InputError message={errors.item_size} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
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
                                            {errors.count && <InputError message={errors.count} />}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary" disabled={processing}>
                                                {processing ? 'Updating' : 'Update Inventory'}
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