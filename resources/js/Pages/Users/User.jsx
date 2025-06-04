import React, { act, useEffect, useRef, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShowMessage } from '@/Components/ShowMessage';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import BreadCrumbHeader from '@/Components/BreadCrumbHeader';

export default function User({ users: initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const tableHead = ['Name', 'Email', 'Actions'];
    const tableRef = useRef(null);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    useEffect(() => {
        if (flash.message) {
            ShowMessage('success', flash.message);
        }
        if (flash.error) {
            ShowMessage('error', flash.error);
        }
    }, [flash]);

    const initializeDataTable = () => {
        if (tableRef.current) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
            if (users.length > 0) {
                $(tableRef.current).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "All"]],
                });
            }
        }
    };

    useEffect(() => {
        initializeDataTable();
        return () => {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, [users]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('users.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        if ($.fn.DataTable.isDataTable(tableRef.current)) {
                            $(tableRef.current).DataTable().destroy();
                        }
                        setUsers(users.filter(user => user.id !== id));
                        ShowMessage('success', 'User deleted successfully');
                    },
                    onError: () => ShowMessage('error', 'Failed to delete user'),
                });
            }
        })
    };

    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">

                    <BreadCrumbHeader
                        breadcrumbs={[
                            { href: route('users.index'), label: 'Users', active:true },
                        ]}
                    />

                    {auth.user.role === 'admin' && (
                        <Link href={route('register')} className="btn btn-primary me-2 btn-sm">
                            <i className="ti ti-plus me-1"></i> Add User
                        </Link>
                    )}

                </div>
                <div className="col-12">
                    <Table responsive size='sm' hover bordered ref={tableRef} >
                        <thead>
                            <tr>
                                {tableHead.map((head, index) => (
                                    <th key={index} className={index === tableHead.length - 1 ? "text-end" : ""}>
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        {auth.user.role === 'admin' && (
                                            <td className="">
                                                <div className='d-flex gap-4'>

                                                    <button className="dropdown-item" onClick={() => handleDelete(user.id)} title='Delete'>
                                                        <i className="ti ti-trash text-danger"></i>
                                                    </button>
                                                </div>

                                            </td>
                                        )}
                                        {auth.user.role !== 'admin' && <td></td>}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={tableHead.length} className="text-center">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
