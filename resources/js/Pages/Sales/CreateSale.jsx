import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Select from "react-select";

export default function CreateSale({ inventories }) {
    const { data, setData, post, processing, errors } = useForm({
        inventory_id: '',
        item_name: '',
        selling_price: '',
        buying_price: '',
        count: '',
        profit: 0,
    });

    const inventoryOptions = inventories.map(item => ({
        value: item.id,
        label: item.item_name,
    }));



    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value);

        if (e.target.name === "selling_price" || e.target.name === "buying_price") {
            setData("profit", (data.selling_price - data.buying_price).toFixed(2));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('sale.store'), { preserveState: true });
    };

    return (

        <AuthenticatedLayout>
            <Head title="Create Sale" />
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


                                    {/* Item Name */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="item_name" value="Item Name" />
                                            <TextInput
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Item Name"
                                                id="item_name"
                                                name="item_name"
                                                onChange={handleInputChange}
                                                value={data.item_name}
                                            />
                                            {errors.item_name && <InputError message={errors.item_name} />}
                                        </div>
                                    </div>

                                    {/* Select2 Dropdown for Items */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="inventory_id" value="Select Item" />
                                            <Select
                                                id="inventory_id"
                                                options={inventoryOptions}
                                                isClearable={true}
                                                isSearchable={true}
                                                onChange={(selectedOption) =>
                                                    setData('inventory_id', selectedOption ? selectedOption.value : '')
                                                }
                                            />
                                            {errors.inventory_id && <InputError message={errors.inventory_id} />}
                                        </div>
                                    </div>

                                    {/* Selling Price */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="selling_price" value="Selling Price" />
                                            <TextInput
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Selling Price"
                                                id="selling_price"
                                                name="selling_price"
                                                onChange={handleInputChange}
                                                value={data.selling_price}
                                            />
                                            {errors.selling_price && <InputError message={errors.selling_price} />}
                                        </div>
                                    </div>

                                    {/* Buying Price */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="buying_price" value="Buying Price" />
                                            <TextInput
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Buying Price"
                                                id="buying_price"
                                                name="buying_price"
                                                onChange={handleInputChange}
                                                value={data.buying_price}
                                            />
                                            {errors.buying_price && <InputError message={errors.buying_price} />}
                                        </div>
                                    </div>

                                    {/* Count */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="count" value="Count" />
                                            <TextInput
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Count"
                                                id="count"
                                                name="count"
                                                onChange={(e) => setData("count", e.target.value)}
                                                value={data.count}
                                            />
                                            {errors.count && <InputError message={errors.count} />}
                                        </div>
                                    </div>

                                    {/* Profit (Read-only) */}
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="profit" value="Profit (Auto-calculated)" />
                                            <TextInput
                                                type="text"
                                                className="form-control"
                                                id="profit"
                                                name="profit"
                                                value={data.profit}
                                                readOnly
                                            />
                                        </div>
                                    </div>

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
