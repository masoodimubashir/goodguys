import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function CreateField() {
    const { data, setData, post, processing, errors } = useForm({
        field_name: '',
        si_unit: '',
        dimension_value: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('field.store'), {
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Field" />
            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('field.index')} className="f-s-14 f-w-500">
                                <i className="iconoir-home-alt"></i>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('field.index')} className="f-s-14 f-w-500">Back</Link>
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
                                            placeholder="Enter SI Unit"
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
                                            {processing ? 'Submitting...' : 'Submit'}
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
