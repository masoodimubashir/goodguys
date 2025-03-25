

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
                                    <div className="mb-4">
                                        <Link href="/">
                                            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                                        </Link>
                                    </div>
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




{/* <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
    <div>
        <Link href="/">
            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
        </Link>
    </div>

    <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
        {children}
    </div>
</div> */}