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
                            <ul className="list-group-flush">
                                <li className="d-flex align-items-between px-0 py-2">
                                    <i className="fas fa-envelope text-primary me-2"></i>
                                    <strong>Email:</strong> <span className="text-muted ms-1">{client.client_email}</span>
                                </li>
                                <li className="d-flex align-items-between px-0 py-2">
                                    <i className="fas fa-phone text-success me-2"></i>
                                    <strong>Phone:</strong> <span className="text-muted ms-1">{client.client_phone}</span>
                                </li>
                                <li className="d-flex align-items-between px-0 py-2">
                                    <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                    <strong>Address:</strong> <span className="text-muted ms-1">{client.client_address}</span>
                                </li>
                                <li className="d-flex align-items-between px-0 py-2">
                                    <i className="fas fa-globe text-info me-2"></i>
                                    <strong>Tax:</strong> <span className="text-muted ms-1">{client.tax}%</span>
                                </li>
                              
                                <li className="d-flex align-items-between px-0 py-2">
                                    <i className="fas fa-globe text-info me-2"></i>
                                    <strong>Service Charge:</strong> <span className="text-muted ms-1">{client.service_charge}%</span>
                                </li>
                            </ul>
                        </div>

                       
                    </div>
                </div>

            </div>
            

        </>
    );
}
