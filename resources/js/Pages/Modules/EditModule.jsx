




import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import CreatableSelect from "react-select/creatable";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Button from "@/Components/Button";

export default function EditModule({ module, fields = [] }) {
    // Improved parser that handles both string and object formats
    const parseModuleFields = () => {
        if (!module.fields) return [{ field_name: '', si_unit: '', dimension_value: '' }];

        return module.fields.map(field => {
            // Handle string format (e.g., "length,20,m")
            if (typeof field === 'string') {
                const [field_name, dimension_value, si_unit] = field.split(',');
                return {
                    field_name: field_name || '',
                    dimension_value: dimension_value || '',
                    si_unit: si_unit || ''
                };
            }

            // Handle object format
            return {
                field_name: field.field_name || '',
                si_unit: field.si_unit || '',
                dimension_value: field.dimension_value || ''
            };
        });
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
            // Check if the selected option has separate properties
            if (selectedOption.field_name && selectedOption.dimension_value && selectedOption.si_unit) {
                // If it's already split into separate properties
                updated[index] = {
                    field_name: selectedOption.field_name,
                    dimension_value: selectedOption.dimension_value,
                    si_unit: selectedOption.si_unit
                };
            }
            // Handle comma-separated format (legacy)
            else if (selectedOption.value.includes(',')) {
                const [field_name, dimension_value, si_unit] = selectedOption.value.split(',');
                updated[index] = {
                    field_name: field_name.trim(),
                    dimension_value: dimension_value.trim(),
                    si_unit: si_unit.trim()
                };
            } else {
                // New simple selection - only field name
                updated[index] = {
                    field_name: selectedOption.value,
                    dimension_value: updated[index].dimension_value || '', // Keep existing
                    si_unit: updated[index].si_unit || '' // Keep existing
                };
            }
        } else {
            // Clear all fields if selection is cleared
            updated[index] = { field_name: '', si_unit: '', dimension_value: '' };
        }

        setData('fields', updated);
    };

    // Prepare options for the select component
    const prepareOptions = () => {
        return fields.map(field => ({
            value: field.field_name,
            label: field.field_name,
            field_name: field.field_name,
            dimension_value: field.dimension_value || '',
            si_unit: field.si_unit || ''
        }));
    };

    // Handle individual field changes
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
                            <form onSubmit={handleSubmit} className="row">

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

                                <div className="col-12 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <InputLabel value="Fields" />
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={addRow}>
                                            + Add Field
                                        </button>
                                    </div>

                                    {data.fields.map((attr, index) => {
                                        // Create the option value in the format "field,dimension,unit"
                                        const optionValue = `${attr.field_name}`;

                                        const selectedOption = attr.field_name ? {
                                            label: optionValue,
                                            value: optionValue,
                                            si_unit: attr.si_unit
                                        } : null;

                                        return (
                                            <div className="row mb-2 align-items-center" key={`attr-${index}`}>
                                                <div className="col-md-5 mb-2">
                                                    <CreatableSelect
                                                        isClearable
                                                        placeholder="Select or create field"
                                                        className="react-select-container"
                                                        classNamePrefix="react-select"
                                                        onChange={(option) => handleSelectChange(index, option)}
                                                        value={attr.field_name ? {
                                                            value: attr.field_name,
                                                            label: attr.field_name,
                                                            field_name: attr.field_name,
                                                            dimension_value: attr.dimension_value,
                                                            si_unit: attr.si_unit
                                                        } : null}
                                                    // options={prepareOptions()}
                                                    // formatOptionLabel={(option) => (
                                                    //     <div>
                                                    //         <strong>{option.field_name}</strong>
                                                    //         {option.dimension_value && ` (${option.dimension_value} ${option.si_unit})`}
                                                    //     </div>
                                                    // )}
                                                    />
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

                                <div className="col-12 text-end">
                                    <Button type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing ? 'Submitting...' : 'Update'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}