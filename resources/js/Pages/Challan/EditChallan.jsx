import React, { useState } from 'react';
import { Table, Button, Form, InputGroup, Collapse, Badge } from 'react-bootstrap';
import { Edit, Trash2, Plus, RotateCcw, Check, X, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const EditChallan = ({ purchaseData: initialChallan }) => {


    // Initialize Inertia form
    const { data, setData, put, processing, errors } = useForm({
        ...initialChallan,
        purchase_list: {
            ...initialChallan?.purchase_list,
            purchased_products: initialChallan?.purchase_list?.purchased_products.map(product => ({
                ...product,
                return_lists: product.return_lists || []
            }))
        }
    });

    // UI state management
    const [state, setState] = useState({
        expandedProducts: {},
        showAddReturn: {},
        editingReturnId: null,
        editingProductId: null
    });

    // Form states
    const [forms, setForms] = useState({
        addReturn: {
            vendor_name: '',
            return_date: new Date().toISOString().split('T')[0],
            unit_count: '',
            bill_total: '',
            bill_description: ''
        },
        editReturn: {
            vendor_name: '',
            return_date: '',
            unit_count: '',
            bill_total: '',
            bill_description: ''
        },
        editProduct: {
            product_name: '',
            description: '',
            price: '',
            unit_count: ''
        }
    });

    // Helper functions
    const toggleProductExpand = (productId) => {
        setState(prev => ({
            ...prev,
            expandedProducts: {
                ...prev.expandedProducts,
                [productId]: !prev.expandedProducts[productId]
            }
        }));
    };




    const calculateRemainingQuantity = (product) => {
        const totalReturned = product.return_lists?.reduce(
            (sum, r) => sum + parseInt(r.unit_count || 0), 0) || 0;
        return product.unit_count - totalReturned;
    };

    const handleSave = () => {
        put(`/challan/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message or perform other actions
                console.log('Challan updated successfully');
            },
            onError: (errors) => {
                console.error('Error updating challan:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Edit Challan: {data.challan_number}</h4>
                    <Button
                        size='sm'
                        variant="primary"
                        onClick={handleSave}
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Returns</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.purchase_list?.purchased_products?.map((product) => (
                            <React.Fragment key={product.id}>
                                <tr>
                                    <td className="text-nowrap">

                                        {
                                            state.expandedProducts[product.id] ?
                                                <ArrowUp  onClick={() => toggleProductExpand(product.id)} /> :
                                                <ArrowDown  onClick={() => toggleProductExpand(product.id)} />
                                        }


                                    </td>
                                    <td>
                                        {product.product_name}
                                        {product.description && (
                                            <div className="text-muted small">{product.description}</div>
                                        )}
                                    </td>
                                    <td>

                                        {product.unit_count}
                                        {calculateRemainingQuantity(product) < product.unit_count && (
                                            <Badge bg="warning" className="ms-2">
                                                Remaining: {calculateRemainingQuantity(product)}
                                            </Badge>
                                        )}
                                    </td>
                                    <td>
                                        ₹${product.price}
                                    </td>
                                    <td>₹{product.price * product.unit_count}</td>
                                    <td>
                                        {product.return_lists?.length || 0} returns
                                        <br />
                                        ₹{product.return_lists?.reduce(
                                            (sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0}
                                    </td>

                                </tr>

                                {/* Expanded returns section */}
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <Collapse in={state.expandedProducts[product.id]}>
                                            <div>
                                                <div className="p-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h6 className="mb-0 text-muted">
                                                            <RotateCcw size={16} className="me-2" />
                                                            Returns for {product.product_name}
                                                        </h6>
                                                    </div>

                                                    <Table size="sm" className="mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Vendor</th>
                                                                <th>Return Date</th>
                                                                <th>Quantity</th>
                                                                <th>Amount (₹)</th>
                                                                <th>Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>


                                                            {/* Return Rows */}
                                                            {product.return_lists?.map(returnItem => (
                                                                <tr key={returnItem.id} className={state.editingReturnId === returnItem.id ? "table-warning" : ""}>

                                                                    <td>{returnItem.vendor_name}</td>
                                                                    <td>{returnItem.return_date}</td>
                                                                    <td>{returnItem.unit_count}</td>
                                                                    <td className="fw-bold">₹{parseFloat(returnItem.bill_total * returnItem.unit_count || 0).toLocaleString('en-IN')}</td>
                                                                    <td className="text-truncate" style={{ maxWidth: '150px' }} title={returnItem.bill_description}>
                                                                        {returnItem.bill_description}
                                                                    </td>

                                                                </tr>
                                                            ))}

                                                            {/* Return Total Row */}
                                                            {product.return_lists?.length > 0 && (
                                                                <tr className="table-secondary">
                                                                    <td colSpan={3} className="text-end fw-bold">Returns Total:</td>
                                                                    <td className="fw-bold">
                                                                        ₹{(product.return_lists?.reduce((sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0).toLocaleString('en-IN')}
                                                                    </td>
                                                                    <td colSpan={2}></td>
                                                                </tr>
                                                            )}

                                                            {/* No Returns Message */}
                                                            {(!product.return_lists || product.return_lists.length === 0) && !state.showAddReturn[product.id] && (
                                                                <tr>
                                                                    <td colSpan={6} className="text-center text-muted py-3">
                                                                        <em>No returns recorded for this product</em>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditChallan;







































// import React, { useState, useEffect } from 'react';
// import { Table, Button, Form, InputGroup, Collapse, Badge } from 'react-bootstrap';
// import { Edit, Trash2, Plus, RotateCcw, Check, X } from 'lucide-react';
// import { useForm } from '@inertiajs/react';

// const EditChallan = ({ purchaseData }) => {
//   // Initialize Inertia form
//   const { data, setData, put, processing, errors } = useForm({
//     ...purchaseData,
//     purchase_list: {
//       ...purchaseData.purchase_list,
//       purchased_products: purchaseData.purchase_list.purchased_products.map(product => ({
//         ...product,
//         return_lists: product.return_lists || []
//       }))
//     }
//   });

//   // UI state management
//   const [state, setState] = useState({
//     expandedProducts: {},
//     showAddReturn: {},
//     editingReturnId: null,
//     editingProductId: null
//   });

//   // Form states
//   const [forms, setForms] = useState({
//     addReturn: {
//       vendor_name: '',
//       return_date: new Date().toISOString().split('T')[0],
//       unit_count: '',
//       bill_total: '',
//       bill_description: ''
//     },
//     editReturn: {
//       vendor_name: '',
//       return_date: '',
//       unit_count: '',
//       bill_total: '',
//       bill_description: ''
//     },
//     editProduct: {
//       product_name: '',
//       description: '',
//       price: '',
//       unit_count: ''
//     }
//   });

//   // Initialize with the first challan item if exists
//   useEffect(() => {
//     if (purchaseData.challans?.length > 0) {
//       const firstChallan = purchaseData.challans[0];
//       setForms(prev => ({
//         ...prev,
//         editProduct: {
//           product_name: firstChallan.item_name,
//           description: firstChallan.description,
//           price: firstChallan.price,
//           unit_count: firstChallan.unit_count
//         }
//       }));
//     }
//   }, [purchaseData.challans]);

//   // Helper functions
//   const toggleProductExpand = (productId) => {
//     setState(prev => ({
//       ...prev,
//       expandedProducts: {
//         ...prev.expandedProducts,
//         [productId]: !prev.expandedProducts[productId]
//       }
//     }));
//   };

//   const toggleAddReturn = (productId) => {
//     setState(prev => ({
//       ...prev,
//       showAddReturn: {
//         ...prev.showAddReturn,
//         [productId]: !prev.showAddReturn[productId]
//       }
//     }));
//   };

//   const startProductEdit = (product) => {
//     setState(prev => ({ ...prev, editingProductId: product.id }));
//     setForms(prev => ({
//       ...prev,
//       editProduct: {
//         product_name: product.product_name,
//         description: product.description,
//         price: product.price,
//         unit_count: product.unit_count
//       }
//     }));
//   };

//   const handleProductEdit = () => {
//     const updatedProducts = data.purchase_list.purchased_products.map(product => 
//       product.id === state.editingProductId ? {
//         ...product,
//         product_name: forms.editProduct.product_name,
//         description: forms.editProduct.description,
//         price: parseFloat(forms.editProduct.price),
//         unit_count: parseInt(forms.editProduct.unit_count)
//       } : product
//     );

//     setData('purchase_list.purchased_products', updatedProducts);
//     setState(prev => ({ ...prev, editingProductId: null }));
//   };

//   const handleAddReturn = (productId) => {
//     const newReturn = {
//       id: Date.now(), // Temporary ID for local state
//       purchased_product_id: productId,
//       ...forms.addReturn,
//       unit_count: parseInt(forms.addReturn.unit_count),
//       bill_total: parseFloat(forms.addReturn.bill_total),
//       created_at: new Date().toISOString()
//     };

//     const updatedProducts = data.purchase_list.purchased_products.map(product => 
//       product.id === productId ? {
//         ...product,
//         return_lists: [...(product.return_lists || []), newReturn]
//       } : product
//     );

//     setData('purchase_list.purchased_products', updatedProducts);
    
//     // Reset form
//     setForms(prev => ({
//       ...prev,
//       addReturn: {
//         vendor_name: '',
//         return_date: new Date().toISOString().split('T')[0],
//         unit_count: '',
//         bill_total: '',
//         bill_description: ''
//       }
//     }));
//     toggleAddReturn(productId);
//   };

//   const startReturnEdit = (returnItem) => {
//     setState(prev => ({ ...prev, editingReturnId: returnItem.id }));
//     setForms(prev => ({
//       ...prev,
//       editReturn: {
//         vendor_name: returnItem.vendor_name,
//         return_date: returnItem.return_date,
//         unit_count: returnItem.unit_count.toString(),
//         bill_total: returnItem.bill_total.toString(),
//         bill_description: returnItem.bill_description
//       }
//     }));
//   };

//   const handleEditReturn = () => {
//     const updatedProducts = data.purchase_list.purchased_products.map(product => ({
//       ...product,
//       return_lists: product.return_lists.map(returnItem => 
//         returnItem.id === state.editingReturnId ? {
//           ...returnItem,
//           ...forms.editReturn,
//           unit_count: parseInt(forms.editReturn.unit_count),
//           bill_total: parseFloat(forms.editReturn.bill_total)
//         } : returnItem
//       )
//     }));

//     setData('purchase_list.purchased_products', updatedProducts);
//     setState(prev => ({ ...prev, editingReturnId: null }));
//   };

//   const deleteReturn = (returnId) => {
//     const updatedProducts = data.purchase_list.purchased_products.map(product => ({
//       ...product,
//       return_lists: product.return_lists.filter(returnItem => returnItem.id !== returnId)
//     }));

//     setData('purchase_list.purchased_products', updatedProducts);
//   };

//   const calculateRemainingAmount = (product) => {
//     const totalReturns = product.return_lists?.reduce(
//       (sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0;
//     return (product.price * product.unit_count) - totalReturns;
//   };

//   const calculateRemainingQuantity = (product) => {
//     const totalReturned = product.return_lists?.reduce(
//       (sum, r) => sum + parseInt(r.unit_count || 0), 0) || 0;
//     return product.unit_count - totalReturned;
//   };

//   const handleSave = () => {
//     put(`/challan/${data.id}`, {
//       preserveScroll: true,
//       onSuccess: () => {
//         console.log('Challan updated successfully');
//       },
//       onError: (errors) => {
//         console.error('Error updating challan:', errors);
//       }
//     });
//   };

//   return (
//     <div className="p-3">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4>Edit Challan: {data.challan_number}</h4>
//         <Button 
//           variant="primary" 
//           onClick={handleSave}
//           disabled={processing}
//         >
//           {processing ? 'Saving...' : 'Save Changes'}
//         </Button>
//       </div>

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Product</th>
//             <th>Quantity</th>
//             <th>Price</th>
//             <th>Total</th>
//             <th>Returns</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.purchase_list.purchased_products.map((product) => (
//             <React.Fragment key={product.id}>
//               <tr>
//                 <td>
//                   {state.editingProductId === product.id ? (
//                     <Form.Control
//                       value={forms.editProduct.product_name}
//                       onChange={(e) => setForms(prev => ({
//                         ...prev,
//                         editProduct: { ...prev.editProduct, product_name: e.target.value }
//                       }))}
//                       isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.product_name`]}
//                     />
//                   ) : (
//                     <>
//                       {product.product_name}
//                       {product.description && (
//                         <div className="text-muted small">{product.description}</div>
//                       )}
//                     </>
//                   )}
//                 </td>
//                 <td>
//                   {state.editingProductId === product.id ? (
//                     <Form.Control
//                       type="number"
//                       value={forms.editProduct.unit_count}
//                       onChange={(e) => setForms(prev => ({
//                         ...prev,
//                         editProduct: { ...prev.editProduct, unit_count: e.target.value }
//                       }))}
//                       isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.unit_count`]}
//                     />
//                   ) : (
//                     <>
//                       {product.unit_count}
//                       {calculateRemainingQuantity(product) < product.unit_count && (
//                         <Badge bg="warning" className="ms-2">
//                           Remaining: {calculateRemainingQuantity(product)}
//                         </Badge>
//                       )}
//                     </>
//                   )}
//                 </td>
//                 <td>
//                   {state.editingProductId === product.id ? (
//                     <InputGroup>
//                       <InputGroup.Text>₹</InputGroup.Text>
//                       <Form.Control
//                         type="number"
//                         step="0.01"
//                         value={forms.editProduct.price}
//                         onChange={(e) => setForms(prev => ({
//                           ...prev,
//                           editProduct: { ...prev.editProduct, price: e.target.value }
//                         }))}
//                         isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.price`]}
//                       />
//                     </InputGroup>
//                   ) : (
//                     `₹${product.price}`
//                   )}
//                 </td>
//                 <td>₹{product.price * product.unit_count}</td>
//                 <td>
//                   {product.return_lists?.length || 0} returns
//                   <br />
//                   ₹{product.return_lists?.reduce(
//                     (sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0}
//                 </td>
//                 <td className="text-nowrap">
//                   {state.editingProductId === product.id ? (
//                     <>
//                       <Button 
//                         variant="success" 
//                         size="sm" 
//                         onClick={handleProductEdit}
//                         className="me-2"
//                       >
//                         <Check size={14} />
//                       </Button>
//                       <Button 
//                         variant="secondary" 
//                         size="sm" 
//                         onClick={() => setState(prev => ({ ...prev, editingProductId: null }))}
//                       >
//                         <X size={14} />
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         size="sm"
//                         variant="outline-primary"
//                         onClick={() => toggleProductExpand(product.id)}
//                         className="me-2"
//                       >
//                         {state.expandedProducts[product.id] ? 'Hide' : 'Show'} Details
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline-secondary"
//                         onClick={() => startProductEdit(product)}
//                       >
//                         <Edit size={14} />
//                       </Button>
//                     </>
//                   )}
//                 </td>
//               </tr>
              
//               {/* Expanded returns section */}
//               <tr>
//                 <td colSpan={6} className="p-0">
//                   <Collapse in={state.expandedProducts[product.id]}>
//                     <div>
//                       <div className="p-3">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                           <h6 className="mb-0 text-muted">
//                             <RotateCcw size={16} className="me-2" />
//                             Returns for {product.product_name}
//                           </h6>
//                           {calculateRemainingQuantity(product) > 0 && (
//                             <Button
//                               size="sm"
//                               variant={state.showAddReturn[product.id] ? "secondary" : "outline-primary"}
//                               onClick={() => toggleAddReturn(product.id)}
//                             >
//                               {state.showAddReturn[product.id] ? (
//                                 <>
//                                   <X size={12} className="me-1" /> Cancel
//                                 </>
//                               ) : (
//                                 <>
//                                   <Plus size={12} className="me-1" /> Add Return
//                                 </>
//                               )}
//                             </Button>
//                           )}
//                         </div>

//                         <Table size="sm" className="mb-0">
//                           <thead>
//                             <tr>
//                               <th>Vendor</th>
//                               <th>Return Date</th>
//                               <th>Quantity</th>
//                               <th>Amount (₹)</th>
//                               <th>Description</th>
//                               <th>Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {/* Add Return Row */}
//                             {state.showAddReturn[product.id] && (
//                               <tr>
//                                 <td>
//                                   <Form.Control
//                                     size="sm"
//                                     value={forms.addReturn.vendor_name}
//                                     onChange={(e) => setForms(prev => ({
//                                       ...prev,
//                                       addReturn: { ...prev.addReturn, vendor_name: e.target.value }
//                                     }))}
//                                     placeholder="Vendor name"
//                                     isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.vendor_name`]}
//                                   />
//                                 </td>
//                                 <td>
//                                   <Form.Control
//                                     type="date"
//                                     size="sm"
//                                     value={forms.addReturn.return_date}
//                                     onChange={(e) => setForms(prev => ({
//                                       ...prev,
//                                       addReturn: { ...prev.addReturn, return_date: e.target.value }
//                                     }))}
//                                     isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.return_date`]}
//                                   />
//                                 </td>
//                                 <td>
//                                   <Form.Control
//                                     type="number"
//                                     size="sm"
//                                     value={forms.addReturn.unit_count}
//                                     onChange={(e) => setForms(prev => ({
//                                       ...prev,
//                                       addReturn: { ...prev.addReturn, unit_count: e.target.value }
//                                     }))}
//                                     placeholder="Qty"
//                                     max={calculateRemainingQuantity(product)}
//                                     min={1}
//                                     isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.unit_count`]}
//                                   />
//                                 </td>
//                                 <td>
//                                   <InputGroup size="sm">
//                                     <InputGroup.Text>₹</InputGroup.Text>
//                                     <Form.Control
//                                       type="number"
//                                       step="0.01"
//                                       value={forms.addReturn.bill_total}
//                                       onChange={(e) => setForms(prev => ({
//                                         ...prev,
//                                         addReturn: { ...prev.addReturn, bill_total: e.target.value }
//                                       }))}
//                                       placeholder="Amount"
//                                       max={calculateRemainingAmount(product)}
//                                       isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.bill_total`]}
//                                     />
//                                   </InputGroup>
//                                 </td>
//                                 <td>
//                                   <Form.Control
//                                     size="sm"
//                                     value={forms.addReturn.bill_description}
//                                     onChange={(e) => setForms(prev => ({
//                                       ...prev,
//                                       addReturn: { ...prev.addReturn, bill_description: e.target.value }
//                                     }))}
//                                     placeholder="Description"
//                                     isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.bill_description`]}
//                                   />
//                                 </td>
//                                 <td className="text-nowrap">
//                                   <Button 
//                                     size="sm" 
//                                     variant="success" 
//                                     onClick={() => handleAddReturn(product.id)}
//                                   >
//                                     <Check size={12} className="me-1" /> Confirm
//                                   </Button>
//                                 </td>
//                               </tr>
//                             )}

//                             {/* Return Rows */}
//                             {product.return_lists?.map(returnItem => (
//                               <tr key={returnItem.id} className={state.editingReturnId === returnItem.id ? "table-warning" : ""}>
//                                 {state.editingReturnId === returnItem.id ? (
//                                   <>
//                                     <td>
//                                       <Form.Control
//                                         size="sm"
//                                         value={forms.editReturn.vendor_name}
//                                         onChange={(e) => setForms(prev => ({
//                                           ...prev,
//                                           editReturn: { ...prev.editReturn, vendor_name: e.target.value }
//                                         }))}
//                                         isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.${returnItem.id}.vendor_name`]}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="date"
//                                         size="sm"
//                                         value={forms.editReturn.return_date}
//                                         onChange={(e) => setForms(prev => ({
//                                           ...prev,
//                                           editReturn: { ...prev.editReturn, return_date: e.target.value }
//                                         }))}
//                                         isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.${returnItem.id}.return_date`]}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="number"
//                                         size="sm"
//                                         value={forms.editReturn.unit_count}
//                                         onChange={(e) => setForms(prev => ({
//                                           ...prev,
//                                           editReturn: { ...prev.editReturn, unit_count: e.target.value }
//                                         }))}
//                                         max={calculateRemainingQuantity(product) + parseInt(forms.editReturn.unit_count)}
//                                         isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.${returnItem.id}.unit_count`]}
//                                       />
//                                     </td>
//                                     <td>
//                                       <InputGroup size="sm">
//                                         <InputGroup.Text>₹</InputGroup.Text>
//                                         <Form.Control
//                                           type="number"
//                                           step="0.01"
//                                           value={forms.editReturn.bill_total}
//                                           onChange={(e) => setForms(prev => ({
//                                             ...prev,
//                                             editReturn: { ...prev.editReturn, bill_total: e.target.value }
//                                           }))}
//                                           isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.${returnItem.id}.bill_total`]}
//                                         />
//                                       </InputGroup>
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         size="sm"
//                                         value={forms.editReturn.bill_description}
//                                         onChange={(e) => setForms(prev => ({
//                                           ...prev,
//                                           editReturn: { ...prev.editReturn, bill_description: e.target.value }
//                                         }))}
//                                         isInvalid={!!errors[`purchase_list.purchased_products.${product.id}.return_lists.${returnItem.id}.bill_description`]}
//                                       />
//                                     </td>
//                                     <td className="text-nowrap">
//                                       <Button 
//                                         size="sm" 
//                                         variant="success" 
//                                         onClick={handleEditReturn}
//                                         className="me-1"
//                                       >
//                                         <Check size={12} />
//                                       </Button>
//                                       <Button
//                                         size="sm"
//                                         variant="secondary"
//                                         onClick={() => setState(prev => ({ ...prev, editingReturnId: null }))}
//                                       >
//                                         <X size={12} />
//                                       </Button>
//                                     </td>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <td>{returnItem.vendor_name}</td>
//                                     <td>{returnItem.return_date}</td>
//                                     <td>{returnItem.unit_count}</td>
//                                     <td className="fw-bold">₹{parseFloat(returnItem.bill_total * returnItem.unit_count || 0).toLocaleString('en-IN')}</td>
//                                     <td className="text-truncate" style={{ maxWidth: '150px' }} title={returnItem.bill_description}>
//                                       {returnItem.bill_description}
//                                     </td>
//                                     <td className="text-nowrap">
//                                       <Button 
//                                         size="sm" 
//                                         variant="info" 
//                                         onClick={() => startReturnEdit(returnItem)} 
//                                         className="me-1"
//                                       >
//                                         <Edit size={12} />
//                                       </Button>
//                                       <Button 
//                                         size="sm" 
//                                         variant="danger" 
//                                         onClick={() => deleteReturn(returnItem.id)}
//                                       >
//                                         <Trash2 size={12} />
//                                       </Button>
//                                     </td>
//                                   </>
//                                 )}
//                               </tr>
//                             ))}

//                             {/* Return Total Row */}
//                             {product.return_lists?.length > 0 && (
//                               <tr className="table-secondary">
//                                 <td colSpan={3} className="text-end fw-bold">Returns Total:</td>
//                                 <td className="fw-bold">
//                                   ₹{(product.return_lists?.reduce((sum, r) => sum + parseFloat(r.bill_total * r.unit_count || 0), 0) || 0).toLocaleString('en-IN')}
//                                 </td>
//                                 <td colSpan={2}></td>
//                               </tr>
//                             )}

//                             {/* No Returns Message */}
//                             {(!product.return_lists || product.return_lists.length === 0) && !state.showAddReturn[product.id] && (
//                               <tr>
//                                 <td colSpan={6} className="text-center text-muted py-3">
//                                   <em>No returns recorded for this product</em>
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </Table>
//                       </div>
//                     </div>
//                   </Collapse>
//                 </td>
//               </tr>
//             </React.Fragment>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default EditChallan;