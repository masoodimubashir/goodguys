import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ShowMessage } from "@/Components/ShowMessage";
import BreadCrumbHeader from "@/Components/BreadCrumbHeader";
import { Table, Pagination } from "react-bootstrap";
import { Edit2, Trash } from "lucide-react";
import Swal from "sweetalert2";

export default function Module({ modules: initialModules }) {
    const [modules, setModules] = useState(initialModules);
    const { flash, auth } = usePage().props;
    const { delete: destroy } = useForm();

    // State for pagination and search
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const tableHead = ["Module Name", "Buying Price", "Selling Price", "Total Price", "Count", "Fields", "Actions"];

    /** Show success/error messages on load */
    useEffect(() => {
        if (flash.message) ShowMessage("success", flash.message);
        if (flash.error) ShowMessage("error", flash.error);
    }, [flash]);

    // Filter modules based on search term
    const filteredModules = modules.filter(module => {
        const term = searchTerm.toLowerCase();
        return (
            module.module_name.toLowerCase().includes(term) ||
            module.fields.some(field => field.toLowerCase().includes(term))
        );
    });

    // Pagination logic
    const totalItems = filteredModules.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    /** Delete module */
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("module.destroy", id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setModules((prev) => prev.filter((module) => module.id !== id));
                        ShowMessage("success", "Module deleted successfully.");
                    },
                    onError: () => ShowMessage("error", "Failed to delete module."),
                });
            }
        });
    };

    const breadcrumbs = [
        { href: '/module', label: 'Back', active: true }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Modules" />

            <div className="row g-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <BreadCrumbHeader
                        homeHref="/module"
                        breadcrumbs={breadcrumbs}
                    />

                    <div className="d-flex gap-2">
                        <Link href={route("module.create")} className="btn btn-sm btn-primary">
                            <i className="ti ti-plus me-1"></i> Add Module
                        </Link>

                        <Link href={route('field.index')} className="btn btn-sm btn-primary">
                            <i className="ti ti-eye me-1"></i> View Fields
                        </Link>
                    </div>
                </div>

                {/* Search and Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        <span className="me-2">Show</span>
                        <select 
                            className="form-select form-select-sm w-auto"
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="ms-2">entries</span>
                    </div>
                    
                    <div style={{ width: '300px' }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search modules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <Table responsive hover bordered size="sm">
                        <thead className="table-light">
                            <tr>
                                {tableHead.map((head, index) => (
                                    <th key={index} className="text-nowrap">{head}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((module) => {
                                    const totalPrice = module.selling_price * module.count;
                                    return (
                                        <tr key={module.id}>
                                            <td>{module.module_name}</td>
                                            <td>{module.buying_price}</td>
                                            <td>{module.selling_price}</td>
                                            <td>{module.selling_price} * {module.count} =  {totalPrice}</td>
                                            <td>{module.count}</td>
                                            <td>
                                                {module.fields.map((field, i) => (
                                                    <div key={i}>
                                                        <span className="badge bg-light text-dark border mb-1 d-block">
                                                            {field}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <Link className="dropdown-item" href={route("module.edit", module.id)} title="Edit">
                                                        <Edit2 size={18}></Edit2>
                                                    </Link>
                                                    <button className="dropdown-item text-danger" onClick={() => handleDelete(module.id)} title="Delete" >
                                                        <Trash size={18}></Trash>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={tableHead.length} className="text-center text-muted py-4">
                                        <i className="ti ti-box fs-4 d-block mb-2"></i>
                                        {searchTerm ? "No matching modules found" : "No modules found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                        </div>
                        
                        <Pagination className="mb-0">
                            <Pagination.Prev 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(currentPage - 1)} 
                            />
                            
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            
                            <Pagination.Next 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage(currentPage + 1)} 
                            />
                        </Pagination>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}