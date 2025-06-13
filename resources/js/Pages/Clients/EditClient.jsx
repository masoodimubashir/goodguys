import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';

export default function EditClient({ client }) {


  const isServiceClient = !!client.service_charge;

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '';

    // Format to 'YYYY-MM-DD' without time zone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const { data, setData, put, processing, errors } = useForm({
    client_type: client.client_type,
    client_name: client.client_name || '',
    site_name: client.site_name || '',
    client_email: client.client_email || '',
    client_phone: client.client_phone || '',
    client_address: client.client_address || '',
    service_charge: isServiceClient ? client?.service_charge?.service_charge : '',
    created_at: formatDateForInput(client.created_at),
  });

  const handleSubmit = (e) => {

    e.preventDefault();
    if (data.client_type === 'PRODUCT') {
      delete data.service_charge;
    }

    put(route('clients.update', client.id), {
      preserveScroll: true,
      onSuccess: () => ShowMessage('success', 'Client updated successfully'),
    });

  };

  const breadcrumbs = [
    { href: '/clients', label: 'Back', active: true }
  ];

  return (
    <AuthenticatedLayout>

      <Head title="Edit Client" />

      <div className="row g-4">

        <div className="d-flex justify-content-between align-items-center">

          <BreadCrumbHeader
            breadcrumbs={breadcrumbs}
          />

        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-body p-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Client Name</label>
                  <TextInput
                    type="text"
                    className="form-control"
                    placeholder="Enter Client Name"
                    value={data.client_name}
                    onChange={e => setData('client_name', e.target.value)}
                  />
                  <InputError message={errors.client_name} />
                </div>

                <div className="mb-3">
                  <InputLabel
                    htmlFor="site_name"
                    value={isServiceClient ? "Enter Site Name" : "Enter Project Title"}
                  />
                  <TextInput
                    className="form-control"
                    id="site_name"
                    name="site_name"
                    placeholder={isServiceClient ? "Enter Site Name" : "Enter Project Title"}
                    value={data.site_name}
                    onChange={e => setData('site_name', e.target.value)}
                  />
                  <InputError message={errors.site_name} />
                </div>


                <div className="mb-3">
                  <label className="form-label">Client Email</label>
                  <TextInput
                    type="email"
                    className="form-control"
                    placeholder="Enter Client Email"
                    value={data.client_email}
                    onChange={e => setData('client_email', e.target.value)}
                  />
                  <InputError message={errors.client_email} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Client Phone</label>
                  <TextInput
                    type="text"
                    className="form-control"
                    placeholder="Enter Client Phone"
                    value={data.client_phone}
                    onChange={e => setData('client_phone', e.target.value)}
                  />
                  <InputError message={errors.client_phone} />
                </div>

                <div className="mb-3">
                  <label className="client_address">Client Address</label>
                  <TextInput
                    type="text"
                    id="client_address"
                    className="form-control"
                    placeholder="Enter Client Address"
                    value={data.client_address}
                    onChange={e => setData('client_address', e.target.value)}
                  />
                  <InputError message={errors.client_address} />
                </div>



                <div className="mb-3">

                  <InputLabel htmlFor="created_at" value="Created Date" />
                  <input
                    type="date"
                    className="form-control"
                    id="created_at"
                    name="created_at"
                    value={data.created_at}
                    onChange={(e) => setData('created_at', e.target.value)}
                  />
                  <InputError message={errors.created_at} />

                </div>

                {data.client_type === 'Service Client' && (
                  <div className="mb-3">
                    <label className="form-label">Service Charge (%)</label>
                    <TextInput
                      type="number"
                      className="form-control"
                      placeholder="Enter Service Charge"
                      value={data.service_charge}
                      onChange={e => setData('service_charge', e.target.value)}
                    />
                    <InputError message={errors.service_charge} />
                  </div>
                )}



                <div className="d-flex justify-content-end gap-2">

                  <Link href={route('clients.index')} className="btn btn-secondary">
                    Cancel
                  </Link>

                  <button type="submit" className="btn btn-primary" disabled={processing}>
                    Update Client
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
