import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";

export default function EditField({ field }) {
    const { data, setData, put, processing, errors } = useForm({
        field_name: field.field_name,
        si_unit: field.si_unit,
        dimension_value: field.dimension_value,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('field.update', field.id), {
            preserveScroll: true,
        });
    };

    const breadcrumbs = [
        {
            href: '/field',
            label: 'field',
            active: false
        },
        {
            href: '/field/' + field.id + '/edit',
            label: field.field_name,
            active: false,
        },
        {
            href: '/field',
            label: 'Back',
            active: true,
        }

    ];

    return (
        <AuthenticatedLayout>
            <Head title="Edit Field" />
            <div className="row m-1">
                <BreadCrumbHeader
                    breadcrumbs={breadcrumbs}
                />
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="app-form" onSubmit={submit}>
                                <div className="row">
                                    {/* Field Name */}
                                    <div className="col-md-4 mb-4">
                                        <InputLabel htmlFor="field_name" value="Field Name" />
                                        <TextInput
                                            className="form-control"
                                            placeholder="Enter Field Name"
                                            id="field_name"
                                            onChange={(e) => setData('field_name', e.target.value)}
                                            value={data.field_name}
                                        />
                                        <InputError message={errors.field_name} />
                                    </div>

                                    {/* SI Unit */}
                                    <div className="col-md-4 mb-4">
                                        <InputLabel htmlFor="si_unit" value="SI Unit" />
                                        <TextInput
                                            className="form-control"
                                            placeholder="Enter SI Unit (e.g., cm, kg)"
                                            id="si_unit"
                                            onChange={(e) => setData('si_unit', e.target.value)}
                                            value={data.si_unit}
                                        />
                                        <InputError message={errors.si_unit} />
                                    </div>

                                    {/* Dimension Value */}
                                    <div className="col-md-4 mb-4">
                                        <InputLabel htmlFor="dimension_value" value="Dimension Value" />
                                        <TextInput
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Dimension Value"
                                            id="dimension_value"
                                            onChange={(e) => setData('dimension_value', e.target.value)}
                                            value={data.dimension_value}
                                        />
                                        <InputError message={errors.dimension_value} />
                                    </div>

                                    <div className="col-12 text-end">
                                        <Button className="btn btn-primary" disabled={processing}>
                                            {processing ? 'Updating' : 'Update Field'}
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
