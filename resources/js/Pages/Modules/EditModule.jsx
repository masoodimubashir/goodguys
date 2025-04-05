import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import CreatableSelect from "react-select/creatable";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Button from "@/Components/Button";

export default function EditModule({ module, fields = [] }) {

    const parseModuleFields = () => {

        if (!module.fields) return [{ field_name: '', si_unit: '', dimension_value: '' }];

        if (Array.isArray(module.fields) && typeof module.fields[0] === 'string') {
            return module.fields.map(fieldStr => {
                const parts = fieldStr.split(' ');
                return {
                    field_name: parts[0] || '',
                    dimension_value: parts[1] || '',
                    si_unit: parts[2] || ''
                };
            });
        }

        return module.fields.map(field => ({
            field_name: field.field_name || '',
            si_unit: field.si_unit || '',
            dimension_value: field.dimension_value || ''
        }));
    };

    const initialFields = parseModuleFields();

    const { data, setData, put, processing, errors } = useForm({
        module_name: module.module_name || '',
        count: module.count || '',
        description: module.description || '',
        buying_price: module.buying_price || '',
        selling_price: module.selling_price || '',
        fields: initialFields
    });

    const handleSelectChange = (index, selectedOption) => {
        const updated = [...data.fields];
        if (selectedOption) {
            updated[index] = {
                field_name: selectedOption.value,
                si_unit: selectedOption.si_unit || '',
                dimension_value: updated[index].dimension_value || '',
            };
        } else {
            updated[index] = {
                field_name: '',
                si_unit: '',
                dimension_value: '',
            };
        }
        setData('fields', updated);
    };

    const handleChange = (index, key, value) => {
        const updated = [...data.fields];
        updated[index][key] = value;
        setData('fields', updated);
    };

    const addRow = () => {
        setData('fields', [...data.fields, { field_name: '', si_unit: '', dimension_value: '' }]);
    };

    const removeRow = (index) => {
        const updated = [...data.fields];
        updated.splice(index, 1);
        setData('fields', updated.length > 0 ? updated : [{ field_name: '', si_unit: '', dimension_value: '' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('module.update', module.id), {
            preserveScroll: true,
            data,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Module" />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('module.index')} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('module.index')} className="f-s-14 f-w-500">Back</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">

                                    {/* Module Name */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="module_name" value="Module Name" />
                                        <TextInput
                                            id="module_name"
                                            type="text"
                                            className="form-control"
                                            value={data.module_name}
                                            onChange={(e) => setData('module_name', e.target.value)}
                                            placeholder="Enter Module Name"
                                        />
                                        <InputError message={errors.module_name} />
                                    </div>

                                    {/* Count */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="count" value="Count" />
                                        <TextInput
                                            id="count"
                                            type="number"
                                            className="form-control"
                                            value={data.count}
                                            onChange={(e) => setData('count', e.target.value)}
                                            placeholder="Item Count"
                                        />
                                        <InputError message={errors.count} />
                                    </div>

                                    {/* Buying Price */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="buying_price" value="Buying Price" />
                                        <TextInput
                                            id="buying_price"
                                            type="number"
                                            value={data.buying_price}
                                            onChange={(e) => setData('buying_price', e.target.value)}
                                            placeholder="Enter Buying Price"
                                        />
                                        <InputError message={errors.buying_price} />
                                    </div>

                                    {/* Selling Price */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="selling_price" value="Selling Price" />
                                        <TextInput
                                            id="selling_price"
                                            type="number"
                                            value={data.selling_price}
                                            onChange={(e) => setData('selling_price', e.target.value)}
                                            placeholder="Enter Selling Price"
                                        />
                                        <InputError message={errors.selling_price} />
                                    </div>

                                    <div className="col-12 mb-4">
                                        <InputLabel htmlFor="description" value="Module Description" />
                                        <TextInput
                                            id="description"
                                            type="text"
                                            className="form-control"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter Description"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="col-12 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <InputLabel value="Fields" />
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={addRow}>
                                                + Add Field
                                            </button>
                                        </div>

                                        {data.fields.map((attr, index) => {
                                            const selectedOption =

                                                (attr.field_name ? {
                                                    value: attr.field_name,
                                                    label: attr.field_name,
                                                    si_unit: attr.si_unit
                                                } : null);

                                            return (
                                                <div className="row mb-2 align-items-center" key={`attr-${index}`}>
                                                    <div className="col-md-5 mb-2">
                                                        <CreatableSelect
                                                            isClearable
                                                            placeholder="Select or create field"
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            onChange={(option) => handleSelectChange(index, option)}
                                                            value={selectedOption}
                                                            options={fields.map((field) => ({
                                                                value: field.field_name,
                                                                label: field.field_name,
                                                                id: field.id,
                                                                si_unit: field.si_unit
                                                            }))}
                                                        />
                                                        <InputError message={errors[`fields.${index}.field_name`]} />
                                                    </div>

                                                    <div className="col-md-3 mb-2">
                                                        <TextInput
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="SI Unit"
                                                            value={attr.si_unit}
                                                            onChange={(e) => handleChange(index, 'si_unit', e.target.value)}
                                                        />
                                                        <InputError message={errors[`fields.${index}.si_unit`]} />

                                                    </div>

                                                    <div className="col-md-3 mb-2">
                                                        <TextInput
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter value"
                                                            value={attr.dimension_value}
                                                            onChange={(e) => handleChange(index, 'dimension_value', e.target.value)}
                                                        />
                                                        <InputError message={errors[`fields.${index}.dimension_value`]} />

                                                    </div>

                                                    <div className="col-md-1 text-end">
                                                        {data.fields.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => removeRow(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <InputError message={errors.fields} />
                                    </div>

                                    <div className="col-12 text-end">
                                        <Button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? 'Submitting...' : 'Update'}
                                        </Button>
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