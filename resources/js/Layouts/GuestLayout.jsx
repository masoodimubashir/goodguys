

import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="app-wrapper d-block">
            <div>
                <main className="w-100 p-0">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12 p-0">
                                <div className="login-form-container">
                                    
                                    <div className="form_container">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}




