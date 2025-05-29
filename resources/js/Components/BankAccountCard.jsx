import { Link, router } from "@inertiajs/react";

export const BankAccountCard = ({ BankProfile }) => {

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this Bank Account?')) {
            router.delete(route('bank-account.destroy', BankProfile.id), {
                preserveScroll: true,
            });
        }
    };
 
    return (
        <div className="col-md-8">
            <div className="card shadow-sm h-100">
                <div className="card-header  d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Bank Account</h5>
                    <div className="d-flex gap-2">
                        <Link href={route('bank-account.edit', BankProfile.id)} className="btn btn-sm btn-outline-primary">
                            <i className="ti ti-edit"></i>
                        </Link>
                        <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
                            <i className="ti ti-trash"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-sm bg-primary-subtle text-primary rounded-circle me-3 d-flex align-items-center justify-content-center">
                            <i className="ti ti-building-bank fs-4"></i>
                        </div>
                        <div>
                            <h5 className="mb-1">{BankProfile.holder_name}</h5>
                            <p className="text-muted mb-0">{BankProfile.bank_name}</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6 className="text-uppercase text-muted fs-12 mb-2">Account Details</h6>
                                <p className="mb-1"><span className="text-muted">Account No:</span> {BankProfile.account_number || 'NA'}</p>
                                <p className="mb-1"><span className="text-muted">Branch Code:</span> {BankProfile.branch_code}</p>
                                <p className="mb-1"><span className="text-muted">IFSC Code:</span> {BankProfile.ifsc_code}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6 className="text-uppercase text-muted fs-12 mb-2">Other Details</h6>
                                <p className="mb-1"><span className="text-muted">Swift Code:</span> {BankProfile.swift_code}</p>
                                <p className="mb-1"><span className="text-muted">UPI Address:</span> {BankProfile.upi_address}</p>
                                <p className="mb-1"><span className="text-muted">Tax Number:</span> {BankProfile.tax_number}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
