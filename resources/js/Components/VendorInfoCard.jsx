import { Building2, FileText, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'
import { Card } from 'react-bootstrap'

const VendorInfoCard = ({ vendor }) => {
    return (
        <Card className={`shadow-sm border-0 rounded-4 card-hover col-md-5`}>
            <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <Building2 size={24} className="text-white" />
                    </div>
                    <div>
                        <h6 className="mb-1 fw-bold">{vendor.vendor_name}</h6>
                        <small className="text-muted">Vendor Details</small>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="mb-2 d-flex align-items-center gap-2">
                        <Phone size={16} className="text-muted" />
                        <span className="fw-medium">{vendor.contact_number}</span>
                    </p>
                    <p className="mb-2 d-flex align-items-center gap-2">
                        <Mail size={16} className="text-muted" />
                        <span className="fw-medium">{vendor.email}</span>
                    </p>
                    <p className="mb-2 d-flex align-items-center gap-2">
                        <MapPin size={16} className="text-muted" />
                        <span className="fw-medium">{vendor.address}</span>
                    </p>
                    <p className="mb-0 d-flex align-items-center gap-2">
                        <FileText size={16} className="text-muted" />
                        <span className="fw-medium">{vendor.description}</span>
                    </p>
                </div>
            </Card.Body>
        </Card>
    )
}

export default VendorInfoCard