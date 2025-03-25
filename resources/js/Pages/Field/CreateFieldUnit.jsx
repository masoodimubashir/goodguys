import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import Select from "react-select";


export default function CreateFieldUnit({ fields }) {
    const { data, setData, post, processing, errors } = useForm({
        unit_count: '',
        unit_size: '',
        field_id: '', 
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('fieldunit.store'), {
            preserveState: true,
        });
    };

    // Convert fields prop into react-select compatible options
    const fieldOptions = fields.map(field => ({
        value: field.id,
        label: field.field_name,
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Create Field Unit" />
            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('fieldunit.index')} className="f-s-14 f-w-500">
                                <span><i className="iconoir-home-alt"></i></span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('fieldunit.index')} className="f-s-14 f-w-500">Back</Link>
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
                                            <InputLabel htmlFor="unit_count" value="Unit Count" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Field Unit Name"
                                                id="unit_count"
                                                onChange={(e) => setData('unit_count', e.target.value)}
                                                value={data.unit_count}
                                            />
                                            {errors.unit_count && <InputError message={errors.unit_count} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="unit_size" value="Field Unit Size" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Unit Size"
                                                id="unit_size"
                                                onChange={(e) => setData('unit_size', e.target.value)}
                                                value={data.unit_size}
                                            />
                                            {errors.unit_size && <InputError message={errors.unit_size} />}
                                        </div>
                                    </div>

                                    {/* React-Select Dropdown */}
                               
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="field_id" value="Select Field" className="form-label" />
                                            <Select
                                                class="select-example form-select select-basic"
                                                id="field_id"
                                                options={fieldOptions}
                                                isClearable={true}
                                                isSearchable={true}
                                                onChange={(selectedOption) =>
                                                    setData('field_id', selectedOption ? selectedOption.value : '')
                                                }
                                            />
                                            {errors.field_id && <InputError message={errors.field_id} />}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary">
                                                {processing ? 'Submitting' : 'Submit'}
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
