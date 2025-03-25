import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

const ShowClient = () => {
    return (
        <>
            <AuthenticatedLayout>
                <Head title="Show Client" />

                <div className="col-12">
                    <div className="card-body p-3">
                        <Link class="btn btn-light-primary" href={route('inventory.create')}>
                            Make Inventory
                        </Link>
                        <Link class="btn btn-light-primary" href={route('module.create')}>
                            Make Module
                        </Link>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    )
}

export default ShowClient