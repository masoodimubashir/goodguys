import { Building2, IndianRupee, Mail, MapPin, Phone, User2 } from "lucide-react";
import { Card } from "react-bootstrap";

export const ClientInfoCard = ({ client }) => {
    return (
        <Card className="shadow-sm border-0 rounded-3 col-md-6">
            <Card.Body className="p-3">
                {/* Compact Header */}
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle me-2">
                        <User2 size={18} className="text-white" />
                    </div>
                    <div>
                        <h6 className="mb-0 fw-bold text-truncate">{client.client_name}</h6>
                        <small className="text-muted">{client.site_name}</small>
                    </div>



                </div>

                {/* Compact Info Grid */}
                <div className="row g-2 small">
                    <div className="col-12">
                        <div className="d-flex align-items-center text-truncate">
                            <MapPin size={14} className="text-muted me-2" />
                            <span>{client.client_address || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center text-truncate">
                            <Mail size={14} className="text-muted me-2" />
                            <span>{client.client_email || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center text-truncate">
                            <Phone size={14} className="text-muted me-2" />
                            <span>{client.client_phone || 'N/A'}</span>
                        </div>
                    </div>
                    <span className="text-muted">
                        {new Date(client.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>

                </div>

                {/* Service Charge Badge */}
                {client.service_charge?.service_charge !== undefined && (
                    <div className="mt-2">
                        <span className="badge bg-info bg-opacity-10 text-white">
                            Service: {client.service_charge.service_charge}%
                        </span>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};