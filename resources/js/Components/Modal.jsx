import TextInput from "./TextInput";

export const Modal = ({ data, setData, errors, processing, handleSubmit }) => (
    <div className="modal fade" id="addItemModal" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Add New Inventory Item</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {['item_name', 'selling_price', 'buying_price', 'item_type', 'item_dimension', 'item_size'].map((field) => (
                            <div className="mb-3" key={field}>
                                <label className="form-label">
                                    {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </label>
                                <TextInput
                                    type={['selling_price', 'buying_price'].includes(field) ? 'number' : 'text'}
                                    step={['selling_price', 'buying_price'].includes(field) ? "0.01" : undefined}
                                    className={errors[field] ? 'is-invalid' : ''}
                                    value={data[field]}
                                    onChange={(e) => setData(field, e.target.value)}
                                />
                                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);