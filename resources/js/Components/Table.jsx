import { Link } from "@inertiajs/react"

// In your Table component
export const Table = ({ tableHead, tableRef, data, handleDelete, auth }) => {
    return (
        <table ref={tableRef} className="table mb-0">
            <thead>
                <tr>
                    {tableHead.map((head, index) => (
                        <th key={index}>{head}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <p className="mb-0 ps-2">{item.item_name}</p>
                                </div>
                            </td>
                            <td>${parseFloat(item.selling_price).toFixed(2)}</td>
                            <td>${parseFloat(item.buying_price).toFixed(2)}</td>
                            <td className="f-w-500">{item.item_type}</td>
                            <td>{item.item_dimension}</td>
                            <td>{item.item_size}</td>
                            {
                                auth.user.role === 'admin' &&
                                <td>
                                    <div className="btn-group dropdown-icon-none">
                                        <button className="btn border-0 icon-btn b-r-4 dropdown-toggle active"
                                            type="button" data-bs-toggle="dropdown"
                                            data-bs-auto-close="true" aria-expanded="false">
                                            <i className="ti ti-dots-vertical"></i>
                                        </button>

                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    href={route('inventory.edit', item.id)}
                                                >
                                                    <i className="ti ti-edit"></i> Edit
                                                </Link>
                                            </li>



                                            <li>
                                                <button className="dropdown-item" onClick={() => handleDelete(item.id)}>
                                                    <i className="ti ti-trash"></i> Delete
                                                </button>
                                            </li>
                                        </ul>

                                    </div>

                                </td>
                            }

                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={tableHead.length} className="text-center">No items found</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};
