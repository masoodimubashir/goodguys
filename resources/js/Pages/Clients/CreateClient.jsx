import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

export default function CreateClient() {
    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        client_email: '',
        client_phone: '',
        client_address: '',
        service_charge: '',
        site_name : '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Client" />

            <div className="row m-1">
                <div className="col-12">
                    <ul className="app-line-breadcrumbs mb-3">
                        <li>
                            <Link href={route('clients.index')} className="f-s-14 f-w-500">
                                <span>
                                    <i className="iconoir-home-alt"></i>
                                </span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link href={route('clients.index')} className="f-s-14 f-w-500">Back</Link>
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
                                            <InputLabel htmlFor="client_name" value="Client Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Client Name"
                                                id="client_name"
                                                onChange={(e) => setData('client_name', e.target.value)}
                                                value={data.client_name}
                                            />
                                            {errors.client_name && <InputError message={errors.client_name} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="client_email" value="Client Email" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Client Email"
                                                id="client_email"
                                                type="email"
                                                onChange={(e) => setData('client_email', e.target.value)}
                                                value={data.client_email}
                                            />
                                            {errors.client_email && <InputError message={errors.client_email} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="client_phone" value="Client Phone" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Client Phone"
                                                id="client_phone"
                                                onChange={(e) => setData('client_phone', e.target.value)}
                                                value={data.client_phone}
                                            />
                                            {errors.client_phone && <InputError message={errors.client_phone} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="client_address" value="Client Address" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Client Address"
                                                id="client_address"
                                                onChange={(e) => setData('client_address', e.target.value)}
                                                value={data.client_address}
                                            />
                                            {errors.client_address && <InputError message={errors.client_address} />}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="service_charge" value="Service Charge (%)" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Service Charge"
                                                id="service_charge"
                                                type="number"
                                                onChange={(e) => setData('service_charge', e.target.value)}
                                                value={data.service_charge}
                                            />
                                            {errors.service_charge && <InputError message={errors.service_charge} />}
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <InputLabel htmlFor="site_name" value="Site Name" />
                                            <TextInput
                                                className="form-control"
                                                placeholder="Enter Site Name"
                                                id="site_name"
                                                type="text"
                                                onChange={(e) => setData('site_name', e.target.value)}
                                                value={data.site_name}
                                            />
                                            {errors.site_name && <InputError message={errors.site_name} />}
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
