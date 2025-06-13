import React, { useState } from 'react';
import { Edit, Eye, Plus, Save, X, Trash } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { ShowMessage } from './ShowMessage';
import Swal from 'sweetalert2';

const ProjectDocumentTab = ({ client }) => {


    const [editingId, setEditingId] = useState(null);
    const [tempImage, setTempImage] = useState(null);

    const addForm = {
        data: { client_id: client.id, document_proof: null },
        setData: (key, value) => {
            addForm.data = { ...addForm.data, [key]: value };
        },
        errors: {}
    };

    const [editFormData, setEditFormData] = useState({
        id: null,
        document_proof: null,
        errors: {}
    });

    // Update form data helper function
    const editForm = (key, value) => {
        setEditFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle new document image upload
    const handleNewImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            addForm.setData('document_proof', file);
        }
    };

    // Handle edit document image upload
    const handleEditImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
            };
            reader.readAsDataURL(file);
            editForm('document_proof', file);
        }
    };

    // Add a new document
    const handleAddDocument = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('client_id', addForm.data.client_id);
        formData.append('document_proof', addForm.data.document_proof);

        router.post('/project-document', formData, {
            preserveScroll: true,
            onSuccess: () => {
                addForm.setData('document_proof', null);
                e.target.reset();
            },
            onError: (errors) => {
                ShowMessage('error', 'Failed to add document.');
            }
        });
    };

    // Start editing a document
    const startEditing = (id) => {
        setEditingId(id);
        const doc = client.project_documents.find(d => d.id === id);
        if (doc) {
            setTempImage(`/storage/${doc.document_proof}`);
            editForm('id', id);
            editForm('document_proof', null); // Reset file input
        }
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setTempImage(null);
        // Fixed: Use editForm function instead of undefined method
        editForm('id', null);
        editForm('document_proof', null);
    };

    // Save edited document
    const saveDocument = (e) => {

        e.preventDefault();

        // Fixed: Check editFormData.id instead of editForm.data.id
        if (!editFormData.id) {
            ShowMessage('error','Cannot save document - missing ID');
            return;
        }

        const formData = new FormData();

        formData.append('_method', 'PUT');

        if (editFormData.document_proof) {
            formData.append('document_proof', editFormData.document_proof);
        }

        router.post(`/project-document/${editFormData.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                setTempImage(null);
                // Fixed: Use editForm function
                editForm('id', null);
                editForm('document_proof', null);
            },
            onError: (errors) => {
                ShowMessage('error', 'Failed to save document.');
            }
        });
    };

    // Delete a document
    const deleteDocument = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/project-document/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (editingId === id) {
                            setEditingId(null);
                            setTempImage(null);
                        }
                    },
                    onError: (errors) => {
                        ShowMessage('error', 'Failed to delete document.');
                    }
                });
            }
        })
    };

    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    {/* Add new document section */}
                    <div className="border-bottom">
                        <form onSubmit={handleAddDocument} className='mb-2'>
                            <div className="row g-3 align-items-center">
                                <div className="col-md-8">
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className={`form-control ${addForm.errors?.document_proof ? 'is-invalid' : ''}`}
                                            accept="image/jpeg,image/jpg"
                                            onChange={handleNewImageUpload}
                                            required
                                        />
                                        <button
                                            className="btn btn-primary btn-sm"
                                            type="submit"
                                        >
                                            <Plus className="me-1" size={16} />
                                            Add
                                        </button>
                                        {addForm.errors?.document_proof && (
                                            <div className="invalid-feedback d-block">
                                                {addForm.errors.document_proof}
                                            </div>
                                        )}
                                    </div>
                                    <small className="text-muted">Only JPG/JPEG files under 2MB</small>
                                </div>
                                <div className="col-md-4">
                                    {addForm.data.document_proof && (
                                        <div className="border p-1 rounded" style={{ width: 80, height: 80 }}>
                                            <img
                                                src={
                                                    typeof addForm.data.document_proof === 'string'
                                                        ? addForm.data.document_proof
                                                        : URL.createObjectURL(addForm.data.document_proof)
                                                }
                                                alt="New document preview"
                                                className="img-fluid h-100 w-100 object-fit-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Documents table */}
                    {client.project_documents.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="text-muted mb-3">
                                <i className="bi bi-file-earmark-x display-4"></i>
                            </div>
                            <h5 className="text-secondary">No documents found</h5>
                            <p className="text-muted">Add your first project document using the form above</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table bordered hover size='sm'>
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Document Preview</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {client.project_documents.map((doc, index) => (
                                        <tr key={doc.id}>
                                            <td className="fw-bold">{index + 1}</td>
                                            <td>
                                                {editingId === doc.id ? (
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            type="file"
                                                            className={`form-control form-control-sm me-2 ${editForm.errors?.document_proof ? 'is-invalid' : ''}`}
                                                            style={{ width: 'auto' }}
                                                            accept="image/jpeg,image/jpg"
                                                            onChange={handleEditImageUpload}
                                                        />
                                                        {editForm.errors?.document_proof && (
                                                            <div className="invalid-feedback">
                                                                {editForm.errors.document_proof}
                                                            </div>
                                                        )}
                                                        {tempImage && (
                                                            <div style={{ width: 50, height: 50 }}>
                                                                <img
                                                                    src={tempImage}
                                                                    alt={`Document ${index + 1}`}
                                                                    className="img-fluid h-100 w-100 object-fit-cover rounded"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ width: 50, height: 50 }}>
                                                        <img
                                                            src={`/storage/${doc.document_proof}`}
                                                            alt={`Document ${index + 1}`}
                                                            className="img-fluid h-100 w-100 object-fit-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                            </td>


                                            <td>
                                                {editingId === doc.id ? (
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-link p-0"
                                                            onClick={saveDocument}
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-link p-0"
                                                            onClick={cancelEditing}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-link p-0"
                                                            onClick={() => startEditing(doc.id)}
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-link p-0"
                                                            onClick={() => deleteDocument(doc.id)}
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                        <a
                                                            href={`/storage/${doc.document_proof}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-link p-0"
                                                        >
                                                            <Eye size={16} />
                                                        </a>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>

                <div className="card-footer">
                    <small className="text-muted">
                        Showing {client.project_documents.length} {client.project_documents.length === 1 ? 'document' : 'documents'}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default ProjectDocumentTab;