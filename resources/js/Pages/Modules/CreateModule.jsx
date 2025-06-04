import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import CreatableSelect from "react-select/creatable";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Button from "@/Components/Button";
import { useState } from "react";
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";

export default function CreateModule({ fields = [] }) {
    
    const [touched, setTouched] = useState({
        module_name: false,
        count: false,
        description: false,
        attributes: []
    });



    const fieldOptions = fields.map(field => ({
        value: field.id,
        label: field.field_name,
        si_unit: field.si_unit,
        dimension_value: field.dimension_value,
    }));



    const { data, setData, post, processing, errors } = useForm({
        module_name: '',
        count: '',
        description: '',
        buying_price: '',
        selling_price: '',
        attributes: [
            {
                field_id: '',
                field_name: '',
                si_unit: '',
                dimension_value: '',
            }
        ]
    });


    const handleChange = (index, key, value) => {
        const updated = [...data.attributes];
        updated[index][key] = value;

        // Update touched state for attributes
        const newTouchedAttributes = [...(touched.attributes || [])];
        newTouchedAttributes[index] = newTouchedAttributes[index] || {};
        newTouchedAttributes[index][key] = true;

        setTouched(prev => ({
            ...prev,
            attributes: newTouchedAttributes
        }));

        setData('attributes', updated);
    };

    const addRow = () => {
        const newAttribute = {
            field_id: '',
            field_name: '',
            si_unit: '',
            dimension_value: ''
        };

        setData('attributes', [...data.attributes, newAttribute]);

        // Update touched state for new attribute
        setTouched(prev => ({
            ...prev,
            attributes: [...(prev.attributes || []), {}]
        }));
    };

    const removeRow = (index) => {
        const updated = [...data.attributes];
        updated.splice(index, 1);

        // Update touched attributes
        const updatedTouchedAttributes = [...(touched.attributes || [])];
        updatedTouchedAttributes.splice(index, 1);

        setTouched(prev => ({
            ...prev,
            attributes: updatedTouchedAttributes
        }));

        setData('attributes', updated.length > 0 ? updated : [{
            field_id: '',
            field_name: '',
            si_unit: '',
            dimension_value: ''
        }]);
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        setTouched({
            module_name: true,
            count: true,
            description: true,
            attributes: data.attributes.map(() => ({
                field_id: true,
                field_name: true,
                si_unit: true,
                dimension_value: true
            }))
        });

        const formattedFields = data.attributes.map(attr => {
            const name = attr.field_name?.trim() || '';
            const value = attr.dimension_value?.trim() || '';
            const unit = attr.si_unit?.trim() || '';
            return `${name} ${unit} ${value}`.trim();
        });


        post(route('module.store'), {
            preserveScroll: true,
            data: {
                module_name: data.module_name,
                count: data.count,
                description: data.description,
                buying_price: data.buying_price,
                selling_price: data.selling_price,
                fields: formattedFields,
            },
        });

    };


    const breadcrumbs = [
        { href: '/module', label: 'Back', active: true }
    ];




    return (
        <AuthenticatedLayout>
            <Head title="Create Module" />

            <div className="container-fluid">

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
                                                value={data.module_name}
                                                onChange={(e) => {
                                                    setData('module_name', e.target.value);
                                                }}
                                                placeholder="Enter Module Name"
                                            />
                                            <InputError message={errors.module_name} />
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


                                        {/* Count */}
                                        <div className="col-md-6 mb-4">
                                            <InputLabel htmlFor="count" value="Count" />
                                            <TextInput
                                                id="count"
                                                type="number"
                                                value={data.count}
                                                onChange={(e) => {
                                                    setData('count', e.target.value);
                                                }}
                                                placeholder="Item Count"
                                            />
                                            <InputError message={errors.count} />
                                        </div>

                                        {/* Description */}
                                        <div className="col-12 mb-4">
                                            <InputLabel htmlFor="description" value="Module Description" />
                                            <TextInput
                                                id="description"
                                                type="text"
                                                value={data.description}
                                                onChange={(e) => {
                                                    setTouched(prev => ({ ...prev, description: true }));
                                                    setData('description', e.target.value);
                                                }}
                                                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                                                placeholder="Enter Description"
                                            />
                                            <InputError message={errors.description} />
                                        </div>

                                        {/* Attributes */}
                                        <div className="col-12 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <InputLabel value="Fields" />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success"
                                                    onClick={addRow}
                                                >
                                                    <i class="ti ti-plus"></i>
                                                </button>
                                            </div>

                                            {data.attributes.map((attr, index) => (
                                                <div
                                                    className="row mb-2 align-items-center"
                                                    key={`attr-${index}`}
                                                >
                                                    {/* Field Name */}
                                                    <div className="col-md-5 mb-2">
                                                        <CreatableSelect
                                                            options={fieldOptions}
                                                           
                                                            onChange={(selected) => {
                                                                const touchedAttributes = [...(touched.attributes || [])];
                                                                touchedAttributes[index] = touchedAttributes[index] || {};
                                                                touchedAttributes[index].field_name = true;

                                                                setTouched(prev => ({
                                                                    ...prev,
                                                                    attributes: touchedAttributes
                                                                }));

                                                                if (selected) {
                                                                    const existingField = fieldOptions.find(opt => opt.value === selected.value);

                                                                    if (existingField) {
                                                                        handleChange(index, 'field_id', existingField.value);
                                                                        handleChange(index, 'field_name', existingField.label);
                                                                        handleChange(index, 'si_unit', existingField.si_unit || '');

                                                                        // Only set dimension_value if it's not manually edited
                                                                        if (!attr.dimension_value) {
                                                                            handleChange(index, 'dimension_value', existingField.dimension_value || '');
                                                                        }
                                                                    } else {
                                                                        handleChange(index, 'field_id', '');
                                                                        handleChange(index, 'field_name', selected.value);
                                                                        handleChange(index, 'si_unit', '');
                                                                        handleChange(index, 'dimension_value', '');
                                                                    }
                                                                } else {
                                                                    handleChange(index, 'field_id', '');
                                                                    handleChange(index, 'field_name', '');
                                                                    handleChange(index, 'si_unit', '');
                                                                    handleChange(index, 'dimension_value', '');
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                const touchedAttributes = [...(touched.attributes || [])];
                                                                touchedAttributes[index] = touchedAttributes[index] || {};
                                                                touchedAttributes[index].field_name = true;

                                                                setTouched(prev => ({
                                                                    ...prev,
                                                                    attributes: touchedAttributes
                                                                }));
                                                            }}
                                                            isClearable
                                                            placeholder="Select or type field"
                                                        />
                                                        {
                                                            <InputError message={errors[`attributes.${index}.field_name`]} />
                                                        }
                                                    </div>

                                                    {/* SI Unit (Text Input) */}
                                                    <div className="col-md-3 mb-2">
                                                        <TextInput
                                                            type="text"
                                                            placeholder="SI Unit"
                                                            value={attr.si_unit}
                                                            onChange={(e) => {

                                                                const touchedAttributes = [...(touched.attributes || [])];
                                                                touchedAttributes[index] = touchedAttributes[index] || {};
                                                                touchedAttributes[index].si_unit = true;

                                                                setTouched(prev => ({
                                                                    ...prev,
                                                                    attributes: touchedAttributes
                                                                }));

                                                                handleChange(index, 'si_unit', e.target.value);
                                                            }}
                                                            onBlur={() => {
                                                                const touchedAttributes = [...(touched.attributes || [])];
                                                                touchedAttributes[index] = touchedAttributes[index] || {};
                                                                touchedAttributes[index].si_unit = true;

                                                                setTouched(prev => ({
                                                                    ...prev,
                                                                    attributes: touchedAttributes
                                                                }));
                                                            }}
                                                        />
                                                        {
                                                            <InputError message={errors[`attributes.${index}.si_unit`]} />
                                                        }
                                                    </div>

                                                    {/* Dimension Value */}
                                                    <div className="col-md-3 mb-2">
                                                        <TextInput
                                                            type="text"
                                                            placeholder="Enter value"
                                                            value={attr.dimension_value}
                                                            onChange={(e) => {
                                                                const touchedAttributes = [...(touched.attributes || [])];
                                                                touchedAttributes[index] = touchedAttributes[index] || {};
                                                                touchedAttributes[index].dimension_value = true;

                                                                setTouched(prev => ({
                                                                    ...prev,
                                                                    attributes: touchedAttributes
                                                                }));

                                                                handleChange(index, 'dimension_value', e.target.value);
                                                            }}
                                                            onBlur={() => {
                                                                const touchedAttributes = [...(touched.attributes || [])];
                                                                touchedAttributes[index] = touchedAttributes[index] || {};
                                                                touchedAttributes[index].dimension_value = true;

                                                                setTouched(prev => ({
                                                                    ...prev,
                                                                    attributes: touchedAttributes
                                                                }));
                                                            }}
                                                        />
                                                        {
                                                            <InputError message={errors[`attributes.${index}.dimension_value`]} />
                                                        }
                                                    </div>

                                                    {/* Remove Button */}
                                                    <div className="col-md-1 text-end">
                                                        {data.attributes.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => removeRow(index)}
                                                            >
                                                                <i class="ti ti-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Global Attributes Error */}
                                            {errors.fields && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.fields}
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <div className="col-12 text-end">
                                            <Button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={processing}
                                            >
                                                {processing ? 'Submitting...' : 'Submit'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}