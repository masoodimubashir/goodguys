import { Building2, Mail, MapPin, Phone, User2 } from "lucide-react";
import { Card, Col, Row } from "react-bootstrap";

export const ClientInfoCard = ({ client }) => {


    const client_type = client?.service_charge ? 'Site Name' : 'Product Name';

    return (

        <>
                <Col md={4}>
                    <Card className={`shadow-sm border-0 rounded-4 card-hover`}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                    <User2 size={24} className="text-white" />
                                </div>
                                <div>
                                    <h6 className="mb-1 fw-bold">{client.client_name}</h6>
                                    <small className="text-muted">Client Information</small>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="mb-2 d-flex align-items-center gap-2">
                                    <Building2 size={16} className="text-muted" />
                                    <span className="fw-medium">{client.site_name}</span>
                                </p>
                                <p className="mb-0 d-flex align-items-center gap-2">
                                    <MapPin size={16} className="text-muted" />
                                    <span className="fw-medium">{client.client_address}</span>
                                </p>
                            </div>

                            <div className="mb-3">
                                <p className="mb-0 d-flex align-items-center gap-2">
                                    <Mail size={16} className="text-muted" />
                                    <span>{client.client_email || 'N/A'}</span>
                                </p>
                                <p className="mb-0 d-flex align-items-center gap-2">
                                    <Phone size={16} className="text-muted" />
                                    <span>{client.client_phone || 'N/A'}</span>
                                </p>
                                <p className="mb-0 d-flex align-items-center gap-2">
                                    <MapPin size={16} className="text-muted" />
                                    <span>{client.client_address || 'N/A'}</span>
                                </p>
                            </div>

                            {client.service_charge?.service_charge !== undefined && (
                                <div className="alert alert-info py-2">
                                    <div className="d-flex justify-content-between">
                                        <span>Service Charge:</span>
                                        <strong>{client.service_charge.service_charge}%</strong>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
        </>

    );
};