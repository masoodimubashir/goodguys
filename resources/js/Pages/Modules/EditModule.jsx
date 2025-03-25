import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Button from "@/Components/Button";
import CreatableSelect from "react-select/creatable";

export default function EditModule({ module, fields }) {
    const fieldOptions = fields.map(field => ({
        value: field.id,
        label: field.field_name,
    }));

    const { data, setData, put, processing, errors } = useForm({
        module_name: module.module_name || '',
        count: module.count || '',
        description: module.description || '',
        attributes: module.field_ids?.map(id => {
            const matchedField = fields.find(f => f.id === id);
            return matchedField
                ? { field_id: matchedField.id, field_name: '' }
                : { field_id: '', field_name: '' };
        }) || []
    });

    const handleChange = (index, key, value) => {
        const updated = [...data.attributes];
        updated[index][key] = value;
        setData('attributes', updated);
    };

    const addRow = () => {
        const newAttr = { field_id: '', field_name: '' };
        setData('attributes', [...data.attributes, newAttr]);
    };

    const removeRow = (index) => {
        const updated = [...data.attributes];
        updated.splice(index, 1);
        setData('attributes', updated.length > 0 ? updated : [{ field_id: '', field_name: '' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('module.update', module.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Module" />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route("module.index")} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route("module.index")} className="f-s-14 f-w-500">Back</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
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

                                    {/* Description */}
                                    <div className="col-12 mb-4">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <TextInput
                                            id="description"
                                            type="text"
                                            className="form-control"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Module Description"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    {/* Dynamic Field Select/Input */}
                                    <div className="col-12 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <InputLabel value="Fields" />
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={addRow}>
                                                + Add Field
                                            </button>
                                        </div>

                                        {data.attributes.map((attr, index) => (
                                            <div className="row mb-2 align-items-center" key={`edit-field-${index}`}>
                                                <div className="col-md-11 mb-2">
                                                    <CreatableSelect
                                                        options={fieldOptions}
                                                        value={
                                                            attr.field_id
                                                                ? fieldOptions.find(opt => opt.value === attr.field_id)
                                                                : attr.field_name
                                                                ? { label: attr.field_name, value: attr.field_name }
                                                                : null
                                                        }
                                                        onChange={(selected) => {
                                                            if (selected && fieldOptions.some(opt => opt.value === selected.value)) {
                                                                handleChange(index, 'field_id', selected.value);
                                                                handleChange(index, 'field_name', '');
                                                            } else if (selected) {
                                                                handleChange(index, 'field_name', selected.value);
                                                                handleChange(index, 'field_id', '');
                                                            } else {
                                                                handleChange(index, 'field_id', '');
                                                                handleChange(index, 'field_name', '');
                                                            }
                                                        }}
                                                        isClearable
                                                        placeholder="Select or type field"
                                                    />
                                                </div>

                                                <div className="col-md-1 text-end">
                                                    {data.attributes.length > 1 && (
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
                                        ))}

                                        <InputError message={errors.attributes} />
                                    </div>

                                    {/* Submit */}
                                    <div className="col-12 text-end mt-4">
                                        <Button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? "Updating..." : "Update Module"}
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
