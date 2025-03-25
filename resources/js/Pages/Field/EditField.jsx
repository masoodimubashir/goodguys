import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function EditField({ field }) {
    const { data, setData, put, processing, errors } = useForm({
        field_name: field.field_name,
        field_unit_name: field.field_unit_name,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('field.update', field.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Field" />
            <div className="row m-1">
                <div className="col-12 ">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li className="">
                            <Link href={route('field.index')} className="f-s-14 f-w-500">
                                <span>
                                    <i className="iconoir-home-alt"></i>
                                </span>
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
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="field_name" value="Field Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Field Name"
                                                id="field_name"
                                                onChange={(e) => setData('field_name', e.target.value)}
                                                value={data.field_name}
                                            />
                                            {errors.field_name && <InputError message={errors.field_name} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="field_type" value="Field Unit Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Field Unit Name"
                                                id="field_unit_name"
                                                onChange={(e) => setData('field_unit_name', e.target.value)}
                                                value={data.field_unit_name}
                                            />
                                            {errors.field_unit_name && <InputError message={errors.field_unit_name} />}
                                        </div>
                                    </div>


                                  

                                    <div className="col-12">
                                        <div className="text-end">
                                            <Button className="btn btn-primary" disabled={processing}>
                                                {processing ? 'Updating' : 'Update Field'}
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
