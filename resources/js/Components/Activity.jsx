import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Badge, Button, InputGroup, Form, Table } from 'react-bootstrap';
import { Search, FileText, Package, Activity, IndianRupee, Text, XCircle, ChevronLeft, ChevronRight, Plus, Save, Minus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { ShowMessage } from './ShowMessage';

const ActivityTab = ({ activities, client, }) => {


    // State for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State for filtered activities
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [paginatedActivities, setPaginatedActivities] = useState([]);

    // State for new activity entry
    const [newActivity, setNewActivity] = useState({
        show: false,
        client_id: client?.id,
        unit_type: '',
        description: '',
        qty: '',
        price: '',
        narration: '',
        multiplier: 1,
        total: 0,
        created_at: new Date().toISOString().split('T')[0]
    });

    const [paymentType, setPaymentType] = useState('');
    const [selectedVendor, setSelectedVendor] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Filter activities whenever search term, date range, or original activities change
    useEffect(() => {
        let results = activities.data || activities;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(activity =>
                (activity.description?.toLowerCase().includes(term)) 
            );
        }

        // Apply date range filter
        if (startDate && endDate) {
            results = results.filter(activity => {
                const activityDate = new Date(activity.created_at);
                return activityDate >= startDate && activityDate <= endDate;
            });
        }

        setFilteredActivities(results);
        setCurrentPage(1); // Reset to first page when filters change
    }, [activities, searchTerm, startDate, endDate]);

    // Paginate filtered activities whenever they change
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedActivities(filteredActivities.slice(startIndex, endIndex));
    }, [filteredActivities, currentPage]);

    // Reset date filter
    const resetDateFilter = () => {
        setDateRange([null, null]);
    };

    // Calculate total pages
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle new activity field changes
    const handleNewActivityChange = (field, value) => {
        setNewActivity(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Create new activity
    const createActivity = () => {

        setIsCreating(true);

        const activityData = {
            client_id: client.id,
            unit_type: newActivity.unit_type,
            description: newActivity.description,
            qty: Number(newActivity.qty) || 1,
            price: Number(newActivity.price),
            narration: newActivity.narration,
            multiplier: Number(newActivity.multiplier) || 1,
            created_at: newActivity.created_at,
            total: Number((newActivity.qty * newActivity.price) * newActivity.multiplier),
        };

        router.post(route('activity.store'), activityData, {
            onSuccess: () => {
                // Reset form
                setNewActivity({
                    show: false,
                    client_id: client?.id,
                    unit_type: '',
                    description: '',
                    qty: '',
                    price: '',
                    narration: '',
                    multiplier: 1,
                    created_at: new Date().toISOString().split('T')[0],
                });
                setPaymentType('');
                setSelectedVendor('');

                ShowMessage('success', 'Activity created successfully!');

                // Refresh the activities list
                router.reload({
                    only: ['activities'],
                    preserveScroll: true
                });
            },
            onError: (errors) => {
                ShowMessage('error', 'Error creating activity');
            },
            onFinish: () => {
                setIsCreating(false);
            }
        });
    };

    return (
        <div className="activity-tab">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                    <Badge bg="primary" pill>
                        {filteredActivities.length} activities
                    </Badge>
                </div>
               
            </div>

            {/* Search and Filter Section */}
            <div className="d-flex gap-3 mb-3">
                <div className="flex-grow-1">
                    <InputGroup>
                        <InputGroup.Text>
                            <Search size={14} />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <div className="d-flex gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            isClearable={true}
                            placeholderText="Filter by date range"
                            className="form-control form-control-sm"
                        />
                        {(startDate || endDate) && (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={resetDateFilter}
                                title="Clear date filter"
                            >
                                <XCircle size={14} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Table hover responsive size='sm' className="mb-0">
                <thead className="table-light">
                    <tr>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <FileText size={14} />
                                Description
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <Package size={14} />
                                Unit Type
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <Activity size={14} />
                                Quantity
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <IndianRupee size={14} />
                                Pay
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <IndianRupee size={14} />
                                Multiplier
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <IndianRupee size={14} />
                                Total
                            </div>
                        </th>
                        <th>
                            <div className="d-flex align-items-center gap-2">
                                <Text size={14} />
                                Narration
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    

                {/* Existing Activities */}
                {paginatedActivities.map((activity) => {
                    const totalValue = (parseFloat(activity.price) || 0) *
                        (parseInt(activity.qty) || 1) *
                        (parseInt(activity.multiplier) || 1);
                    const rowClass = activity.payment_flow === 1
                        ? "table-success"
                        : activity.payment_flow === 0
                            ? "table-warning"
                            : "";

                    return (
                        <tr key={activity.id} className={rowClass}>
                            <td>
                                <div>
                                    <span className="fw-bold">{activity.description ?? 'NA'}</span>
                                    <br />
                                    <small className="text-muted">
                                        {new Date(activity.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </small>
                                </div>
                            </td>
                            <td>
                                <span className="fw-medium">{activity.unit_type ?? 'NA'}</span>
                            </td>
                            <td>
                                <span className="fw-bold">{activity.qty > 1 ? activity.qty : 'NA'}</span>
                            </td>
                            <td>
                                <span className="fw-bold text-primary">
                                    {(activity.price)} {activity.payment_flow === 1 ? <Plus size={13}/> : <Minus size={13}/>}
                                </span>
                            </td>
                            <td>
                                <span className="fw-bold">
                                    {activity.multiplier > 1 ? activity.multiplier : 'NA'}
                                </span>
                            </td>
                            <td>
                                <span className="fw-bold text-success">
                                    {activity.total || totalValue} {activity.payment_flow === 1 ? <Plus size={13}/> : <Minus size={13}/>}
                                </span>
                            </td>
                            <td>
                                <span>{activity.narration}</span>
                            </td>
                            <td></td>
                        </tr>
                    );
                })}

                {filteredActivities.length === 0 && !newActivity.show && (
                    <tr>
                        <td colSpan={8} className="text-center py-5">
                            <div className="text-muted">
                                <Activity size={20} className="mb-3 opacity-50" />
                                <h5 className="mb-2">No Activities Found</h5>
                                {searchTerm || (startDate || endDate) ? (
                                    <p>No activities match your search criteria</p>
                                ) : (
                                    <p>No activities available</p>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>

            {/* Client-side Pagination */ }
    {
        filteredActivities.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of{' '}
                    {filteredActivities.length} entries
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <ChevronLeft size={14} />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'primary' : 'outline-secondary'}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <ChevronRight size={14} />
                    </Button>
                </div>
            </div>
        )
    }
        </div >
    );
};

export default ActivityTab;