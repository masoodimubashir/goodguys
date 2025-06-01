import { Link, router } from "@inertiajs/react";
import { Banknote } from "lucide-react";

export const BankAccountCard = ({ BankProfile }) => {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this Bank Account?')) {
            router.delete(route('bank-account.destroy', BankProfile.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="col-md-6 col-lg-6"> {/* More compact column size */}
            <div className="card shadow-sm h-100 border-0">
                <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                        <div className="me-2  d-flex align-items-center justify-content-center">
                            <Banknote size={20} />
                        </div>
                        <h6 className="mb-0">{BankProfile.bank_name}</h6>
                    </div>
                    <div className="d-flex gap-1">
                        <Link
                            title="Edit"
                                href={route('bank-account.edit', BankProfile.id)}

                        >
                            <i className="ti ti-edit fs-4"
                            ></i>
                        </Link>
                        <i className="ti ti-trash fs-4 text-danger"
                            onClick={handleDelete}
                        ></i>
                    </div>
                </div>
                <div className="card-body p-3">
                    <h6 className="mb-2 text-truncate">{BankProfile.holder_name}</h6>

                    {/* Compact details in two columns */}
                    <div className="row g-2 small text-muted">
                        <div className="col-3">
                            <div className="text-truncate">
                                <span className="d-block fw-semibold">Account No</span>
                                {BankProfile.account_number || 'NA'}
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-truncate">
                                <span className="d-block fw-semibold">IFSC</span>
                                {BankProfile.ifsc_code || 'NA'}
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-truncate">
                                <span className="d-block fw-semibold">Branch</span>
                                {BankProfile.branch_code || 'NA'}
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-truncate">
                                <span className="d-block fw-semibold">UPI</span>
                                {BankProfile.upi_address || 'NA'}
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-truncate">
                                <span className="d-block fw-semibold">Swift Code:</span>
                                {BankProfile.swift_code || 'NA'}
                            </div>

                        </div>
                        <div className="col-3">
                            <div className="text-truncate">
                                <span className="d-block fw-semibold">Tax Number:</span>
                                {BankProfile.tax_number || 'NA'}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};