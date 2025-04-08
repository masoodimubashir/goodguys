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
        site_name: '',
        tax: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            preserveScroll: true,
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
                                <i className="iconoir-home-alt"></i>
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

                                    {/* Client Name */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="client_name" value="Client Name" />
                                        <TextInput
                                            className="form-control"
                                            id="client_name"
                                            placeholder="Enter Client Name"
                                            value={data.client_name}
                                            onChange={(e) => setData('client_name', e.target.value)}
                                        />
                                        <InputError message={errors.client_name} />
                                    </div>

                                    {/* Client Email */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="client_email" value="Client Email" />
                                        <TextInput
                                            className="form-control"
                                            type="email"
                                            id="client_email"
                                            placeholder="Enter Client Email"
                                            value={data.client_email}
                                            onChange={(e) => setData('client_email', e.target.value)}
                                        />
                                        <InputError message={errors.client_email} />
                                    </div>

                                    {/* Client Phone */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="client_phone" value="Client Phone" />
                                        <TextInput
                                            className="form-control"
                                            id="client_phone"
                                            placeholder="Enter Client Phone"
                                            value={data.client_phone}
                                            onChange={(e) => setData('client_phone', e.target.value)}
                                        />
                                        <InputError message={errors.client_phone} />
                                    </div>

                                    {/* Client Address */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="client_address" value="Client Address" />
                                        <TextInput
                                            className="form-control"
                                            id="client_address"
                                            placeholder="Enter Client Address"
                                            value={data.client_address}
                                            onChange={(e) => setData('client_address', e.target.value)}
                                        />
                                        <InputError message={errors.client_address} />
                                    </div>

                                    {/* Site Name */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="site_name" value="Site Name" />
                                        <TextInput
                                            className="form-control"
                                            id="site_name"
                                            placeholder="Enter Site Name"
                                            value={data.site_name}
                                            onChange={(e) => setData('site_name', e.target.value)}
                                        />
                                        <InputError message={errors.site_name} />
                                    </div>

                                    {/* Service Charge */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="service_charge" value="Service Charge (%)" />
                                        <TextInput
                                            className="form-control"
                                            id="service_charge"
                                            type="number"
                                            placeholder="Enter Service Charge"
                                            value={data.service_charge}
                                            onChange={(e) => setData('service_charge', e.target.value)}
                                        />
                                        <InputError message={errors.service_charge} />
                                    </div>

                                    {/* Tax */}
                                    <div className="col-md-6 mb-4">
                                        <InputLabel htmlFor="tax" value="Tax (%)" />
                                        <TextInput
                                            className="form-control"
                                            id="tax"
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter Tax Percentage"
                                            value={data.tax}
                                            onChange={(e) => setData('tax', e.target.value)}
                                        />
                                        <InputError message={errors.tax} />
                                    </div>

                                  

                                    {/* Submit Button */}
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
