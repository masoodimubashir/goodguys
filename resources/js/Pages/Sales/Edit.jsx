import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Select from "react-select";

export default function Edit({ sale, inventories }) {

    const inventoryOptions = inventories.map(inventory => ({
        value: inventory.id,
        label: inventory.item_name
    }));

    const selectedInventory = inventoryOptions.find(option => option.value === sale.inventory_id);

    const { data, setData, put, processing, errors } = useForm({
        item_name: sale.item_name,
        selling_price: sale.selling_price,
        buying_price: sale.buying_price,
        inventory_id: selectedInventory ? selectedInventory.value : "",
        count: sale.count,
        profit: sale.profit,
    });

    const handlePriceChange = (field, value) => {
        setData({
            ...data,
            [field]: value,
            profit: field === "selling_price"
                ? value - data.buying_price
                : data.selling_price - value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('sale.update', sale.id), {
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Sale" />
            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('sale.index')} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('sale.index')} className="f-s-14 f-w-500">Back</Link>
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
                                                onChange={(e) => setData("item_name", e.target.value)}
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
                                                onChange={(e) => handlePriceChange("selling_price", Number(e.target.value))}
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
                                                onChange={(e) => handlePriceChange("buying_price", Number(e.target.value))}
                                                value={data.buying_price}
                                            />
                                            {errors.buying_price && <InputError message={errors.buying_price} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="inventory_id" value="Select Item" />
                                            <Select
                                                id="inventory_id"
                                                isClearable={true}
                                                isSearchable={true}
                                                options={inventoryOptions}
                                                value={inventoryOptions.find(option => option.value === data.inventory_id)}
                                                onChange={(selected) => setData("inventory_id", selected ? selected.value : "")}
                                            />
                                            {errors.inventory_id && <InputError message={errors.inventory_id} />}
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
                                                onChange={(e) => setData("count", e.target.value)}
                                                value={data.count}
                                            />
                                            {errors.count && <InputError message={errors.count} />}
                                        </div>
                                    </div>

                                    {/* Profit Field */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="profit" value="Profit" />
                                            <TextInput
                                                className="form-control"
                                                id="profit"
                                                type="number"
                                                value={data.profit}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary" disabled={processing}>
                                                {processing ? "Updating..." : "Update"}
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
