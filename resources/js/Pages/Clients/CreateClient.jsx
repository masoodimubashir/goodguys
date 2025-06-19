import { Head, Link, useForm } from "@inertiajs/react";
import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";

const CLIENT_TYPES = {
    SERVICE: 'Service Client',
    PRODUCT: 'Product Client',
};

export default function CreateClient() {
    const { data, setData, post, processing, errors, reset } = useForm({
        client_type: CLIENT_TYPES.SERVICE,
        client_name: '',
        client_email: '',
        client_phone: '',
        client_address: '',
        service_charge: '',
        site_name: '',
        created_at: new Date().toISOString().split('T')[0], // Default to today's date
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleClientTypeChange = (type) => {
        // Reset service charge if changing to product type
        const updates = { client_type: type };
        if (type === CLIENT_TYPES.PRODUCT) {
            updates.service_charge = '';
        }
        setData(currentData => ({
            ...currentData,
            ...updates
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    const breadcrumbs = [
        { href: '/clients', label: 'Back', active: true }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Create Client" />

            <div className="row justify-content-center">

                <div className="d-flex justify-content-between align-items-center">

                    <BreadCrumbHeader
                        breadcrumbs={breadcrumbs}
                    />

                </div>

                <div className="col-12">
                    <div className="card shadow-sm border-0">
                       
                        <div className="card-body">
                            <form className="app-form" onSubmit={handleSubmit}>
                                
                                <div className="row g-4">
                                    <ClientTypeSelector
                                        selectedType={data.client_type}
                                        onChange={handleClientTypeChange}
                                    />

                                    <FormFields
                                        data={data}
                                        errors={errors}
                                        onChange={handleInputChange}
                                    />

                                    <div className="col-12 text-end">
                                        <Button className="btn btn-primary px-4" disabled={processing}>
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

// Reusable components to improve organization

function BreadcrumbNav() {
    return (
        <div className="row mb-3">
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
    );
}

function ClientTypeSelector({ selectedType, onChange }) {
    return (
        <div className="col-12">
            <InputLabel htmlFor="client_type" value="Client Type" />
            <div className="btn-group w-100" role="group">
                <input
                    type="radio"
                    className="btn-check"
                    name="client_type"
                    id="service"
                    value={CLIENT_TYPES.SERVICE}
                    checked={selectedType === CLIENT_TYPES.SERVICE}
                    onChange={() => onChange(CLIENT_TYPES.SERVICE)}
                />
                <label className="btn btn-outline-primary" htmlFor="service">
                    Service Client
                </label>

                <input
                    type="radio"
                    className="btn-check"
                    name="client_type"
                    id="product"
                    value={CLIENT_TYPES.PRODUCT}
                    checked={selectedType === CLIENT_TYPES.PRODUCT}
                    onChange={() => onChange(CLIENT_TYPES.PRODUCT)}
                />
                <label className="btn btn-outline-primary" htmlFor="product">
                    Product Client
                </label>
            </div>
        </div>
    );
}

function FormField({ label, id, type = "text", placeholder, value, onChange, error, ...props }) {
    return (
        <div className="col-md-4">
            <InputLabel htmlFor={id} value={label} />
            <TextInput
                type={type}
                className="form-control"
                id={id}
                name={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
            <InputError message={error} />
        </div>
    );
}

function FormFields({ data, errors, onChange }) {

    const isServiceType = data.client_type === CLIENT_TYPES.SERVICE;

    return (
        <>
            <FormField
                label="Client Name"
                id="client_name"
                placeholder="Enter Client Name"
                value={data.client_name}
                onChange={onChange}
                error={errors.client_name}
            />

            <FormField
                label="Client Email"
                id="client_email"
                type="email"
                placeholder="Enter Client Email"
                value={data.client_email}
                onChange={onChange}
                error={errors.client_email}
            />

            <FormField
                label="Client Phone"
                id="client_phone"
                placeholder="Enter Client Phone"
                value={data.client_phone}
                onChange={onChange}
                error={errors.client_phone}
            />

            <FormField
                label="Client Address"
                id="client_address"
                placeholder="Enter Client Address"
                value={data.client_address}
                onChange={onChange}
                error={errors.client_address}
            />

            <div className="col-md-3">
                <InputLabel
                    htmlFor="site_name"
                    value={isServiceType ? "Enter Site Name" : "Enter Product Type"}
                />
                <TextInput
                    className="form-control"
                    id="site_name"
                    name="site_name"
                    placeholder={isServiceType ? "Enter Site Name" : "Enter Product Type"}
                    value={data.site_name}
                    onChange={onChange}
                />
                <InputError message={errors.site_name} />
            </div>

            {/* Created At Date Field */}
            <div className="col-md-3">
                <InputLabel htmlFor="created_at" value="Created Date" />
                <TextInput
                    type="date"
                    className="form-control"
                    id="created_at"
                    name="created_at"
                    value={data.created_at}
                    onChange={onChange}
                />
                <InputError message={errors.created_at} />
            </div>

            {isServiceType && (
                <div className="col-md-2">
                    <InputLabel htmlFor="service_charge" value="Service Charge (%)" />
                    <TextInput
                        type="number"
                        className="form-control"
                        id="service_charge"
                        name="service_charge"
                        placeholder="Enter Service Charge"
                        value={data.service_charge}
                        onChange={onChange}
                    />
                    <InputError message={errors.service_charge} />
                </div>
            )}
        </>
    );
}