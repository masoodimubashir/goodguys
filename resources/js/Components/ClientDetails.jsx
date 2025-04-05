import React from "react";

export default function ClientDetails({ client }) {
    return (

        <>
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">

                <div className="bg-primary  px-4 py-3">
                    <h3 className="mb-0 fw-semibold text-white">
                        <i className="fas fa-user me-2"></i> {client.client_name}
                    </h3>
                </div>

                <div className="px-4 py-4">
                    <div className="row">
                        {/* Left - Client Info */}
                        <div className="col-md-8">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item px-0 py-2">
                                    <i className="fas fa-envelope text-primary me-2"></i>
                                    <strong>Email:</strong> <span className="text-muted ms-1">{client.client_email}</span>
                                </li>
                                <li className="list-group-item px-0 py-2">
                                    <i className="fas fa-phone text-success me-2"></i>
                                    <strong>Phone:</strong> <span className="text-muted ms-1">{client.client_phone}</span>
                                </li>
                                <li className="list-group-item px-0 py-2">
                                    <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                    <strong>Address:</strong> <span className="text-muted ms-1">{client.client_address}</span>
                                </li>
                                <li className="list-group-item px-0 py-2">
                                    <i className="fas fa-globe text-info me-2"></i>
                                    <strong>Site:</strong> <span className="text-muted ms-1">{client.site_name}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Right - Assets */}
                        <div className="col-md-4 d-flex flex-column align-items-md-end align-items-start mt-4 mt-md-0">
                            <h5 className="fw-bold text-secondary mb-2">
                                <i className="fas fa-box-open me-2"></i>Assets
                            </h5>
                            <div className="badge bg-success fs-5 px-4 py-2">
                                {1234 || "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            

        </>
    );
}
