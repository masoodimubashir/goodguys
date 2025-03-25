import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { InvoicePdf } from '@/Pdf/InvoicePdf';
import { Head } from '@inertiajs/react';
import { PDFViewer } from '@react-pdf/renderer';

export default function Dashboard() {
    return (

        <AuthenticatedLayout >

            <Head title="Dashboard" />


            <div className="row h-screen">

                <PDFViewer>
                    <InvoicePdf />
                </PDFViewer>

                {/* <div className="col-lg-6 col-xxl-4">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card project-total-card">
                                <div className="card-body">
                                    <div className="d-flex position-relative">
                                        <h5 className="text-dark txt-ellipsis-1">Total Hours</h5>
                                        <div className="clock-box">
                                            <div className="clock">
                                                <div className="hour" id="hour"></div>
                                                <div className="min" id="min"></div>
                                                <div className="sec" id="sec"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex">
                                            <h2 className="text-info-dark hour-display">00H</h2>
                                        </div>
                                        <div className="progress-labels mg-t-40">
                                            <span className="text-info">Productive</span>
                                            <span className="text-info">Middle</span>
                                            <span className="text-info">Idle</span>
                                        </div>
                                        <div className="custom-progress-container info-progress">
                                            <div className="progress-bar productive"></div>
                                            <div className="progress-bar middle"></div>
                                            <div className="progress-bar idle"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="card bg-info-300 project-details-card">
                                <div className="card-body">
                                    <div className="d-flex gap-2">
                                        <span className="badge bg-white-300 text-info-dark p-1  b-r-10">📱 Mobile app</span>
                                        <span className="badge dashed-1-info text-info-dark ms-2 p-1  b-r-10">Marketing</span>
                                    </div>
                                    <div className="my-4">
                                        <h5 className="f-w-600 text-info-dark txt-ellipsis-1">Project Alpha</h5>
                                        <p className="text-info f-s-13 txt-ellipsis-1 mb-0">Revolutionizing ideas,
                                            empowering innovation, and driving success.</p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between pt-3">
                                        <ul className="avatar-group">
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-light-primary b-2-primary">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/4.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-light-success b-2-success"
                                                data-bs-title="Lennon Briggs" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/5.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-light-info b-2-info"
                                                data-bs-title="Maya Horton" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/6.png')}}" />
                                            </li>
                                        </ul>
                                        <span className="badge bg-white-300 text-info-dark ms-2 ">🔥 1H left</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="card bg-success-300 project-details-card">
                                <div className="card-body">
                                    <div className="d-flex gap-2">
                                        <span className="badge bg-white-300 text-success-dark p-1 b-r-10">⚡ API </span>
                                        <span className="badge bg-transparent dashed-1-dark-light text-success-dark ms-2 p-1 b-r-10">Web Development</span>
                                    </div>
                                    <div className="my-4">
                                        <h5 className="f-w-600 text-success-dark txt-ellipsis-1">Project Beta</h5>
                                        <p className="text-success f-s-13 txt-ellipsis-1 mb-0"> Innovating solutions
                                            for seamless task management efficiency.</p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between pt-3">
                                        <ul className="avatar-group">
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-light-primary b-2-primary">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/4.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-light-danger b-2-danger"
                                                data-bs-title="Maya Horton" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/6.png')}}" />
                                            </li>
                                        </ul>
                                        <span className="badge bg-white-300 text-success-dark ms-2 ">✨ 2D left</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="card core-teams-card">
                                <div className="card-body">
                                    <div className="d-flex">
                                        <h5 className="text-dark f-w-600 txt-ellipsis-1">💼 Core Teams</h5>
                                    </div>
                                    <div>
                                        <h2 className="text-warning-dark my-4 d-inline-flex align-items-baseline">1k
                                            <span className="f-s-12 text-dark">Team Members</span></h2>
                                        <ul className="avatar-group justify-content-start ">
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden text-bg-primary b-2-light"
                                                data-bs-title="Sabrina Torres" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/4.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden text-bg-success b-2-light"
                                                data-bs-title="Eva Bailey" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/5.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden text-bg-danger b-2-light"
                                                data-bs-title="Michael Hughes" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/6.png')}}" />
                                            </li>
                                            <li className="text-bg-secondary h-35 w-35 d-flex-center b-r-50"
                                                data-bs-title="10 More" data-bs-toggle="tooltip">
                                                10+
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xxl-4">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div>
                                <input className="file-uploader-box filelight file-light-info"
                                    data-allow-reorder="true"
                                    id="fileUploaderBox" multiple="multiple" type="file" />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="card ">
                                <div className="card-body">
                                    <div className="project-expense" id="projectExpense"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="col-md-6 col-xxl-4 ">
                    <div className="card project-connect-card">
                        <div className="card-body pb-0">
                            <div className="text-center">
                                <h5 className=" mb-2 f-s-24">Get started <span className="text-primary f-w-700">Effortlessly.</span>
                                </h5>
                                <p className="f-s-14 text-dark pb-0 txt-ellipsis-2">
                                    Connect your team's tools and unlock a unified view of every project's
                                    progress, deadlines, and team contributions.
                                </p>
                            </div>
                            <div className="connect-chat-box">
                                <div className="avatar-connect-box">
                                    <img alt="logo" className="avatar-connect-logo"
                                        src="{{asset('../assets/images/dashboard/project/avatar.png')}}" />
                                    <img alt="logo" className="dribbble-connect-logo"
                                        src="{{asset('../assets/images/dashboard/project/dribbble.png')}}" />
                                </div>
                                <img alt="img" src="{{asset('../assets/images/dashboard/project/chat.png')}}" />
                                <img alt="logo"
                                    className="slack-logo animate__shakeY animate__animated animate__infinite animate__slower"
                                    src="{{asset('../assets/images/dashboard/project/slack.png')}}" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xxl-3 ">
                    <div className="p-3">
                        <h5>Tracker</h5>
                    </div>
                    <div className="card">
                        <div className="card-body position-relative">
                            <div className="time-tracker">
                                <div className="share-time">
                                    <div className="dropdown">
                                        <span aria-expanded="false"
                                            className="w-35 h-35 bg-primary-300 text-info-dark rounded p-2 d-flex-center" data-bs-toggle="dropdown" role="button">
                                            <i className="iconoir-share-android-solid"></i>
                                        </span>
                                        <ul className="dropdown-menu  dropdown-menu-end rounded">
                                            <li><a className="dropdown-item f-s-14" href="#"><i
                                                className="iconoir-instagram text-danger-dark me-2 f-s-18 align-text-top"></i>Instagram</a>
                                            </li>
                                            <li><a className="dropdown-item f-s-14" href="#"><i
                                                className="iconoir-twitter text-twitter me-2 f-s-18 align-text-top"></i>Twitter</a>
                                            </li>
                                            <li><a className="dropdown-item f-s-14" href="#"><i
                                                className="iconoir-chat-lines text-whatsapp me-2 f-s-18 align-text-top"></i>Messenger</a>
                                            </li>
                                            <li><a className="dropdown-item f-s-14" href="#"><i
                                                className="iconoir-more-horiz text-dark me-2 f-s-18 align-text-top"></i>Other
                                                Apps</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <h2 className="timer-display f-w-600">00:00:00</h2>
                                <div className="controls">
                                    <button className="btn btn-light-primary icon-btn b-r-18" id="start-btn"><i
                                        className="iconoir-play-solid"></i></button>
                                    <button className="btn btn-danger icon-btn b-r-18" disabled id="stop-btn"><i
                                        className="iconoir-square"></i></button>
                                    <button className="btn btn-light-info icon-btn b-r-18" id="reset-btn"><i
                                        className="iconoir-refresh"></i></button>
                                </div>
                            </div>

                            <ul className="tracker-history-list app-scroll mt-3">
                                <li className="bg-info-300">
                                    <div>
                                        <h6 className="text-info-dark mb-0">Session 1</h6>
                                    </div>
                                    <div className="text-dark f-w-600 ms-2">
                                        00:01:23
                                    </div>
                                </li>

                                <li className="bg-primary-300">
                                    <div>
                                        <h6 className="text-primary-dark mb-0">Session 2</h6>
                                    </div>
                                    <div className="text-dark f-w-600 ms-2">
                                        00:02:45
                                    </div>
                                </li>
                                <li className="bg-danger-300">
                                    <div>
                                        <h6 className="text-danger-dark mb-0">Session 3</h6>
                                    </div>
                                    <div className="text-dark f-w-600 ms-2">
                                        00:03:30
                                    </div>
                                </li>
                                <li className="bg-warning-300">
                                    <div>
                                        <h6 className="text-warning-dark mb-0">Session 4</h6>
                                    </div>
                                    <div className="text-dark f-w-600 ms-2">
                                        00:04:12
                                    </div>
                                </li>
                                <li className="bg-success-300">
                                    <div>
                                        <h6 className="text-success-dark mb-0">Session 5</h6>
                                    </div>
                                    <div className="text-dark f-w-600 ms-2">
                                        01:06:00
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7 col-xxl-6 order-1-md">
                    <div className="p-3">
                        <h5>Project Status</h5>
                    </div>
                    <div className="card mb-0">
                        <div className="card-body py-2 px-0 overflow-hidden">
                            <div className="table-responsive app-scroll ">
                                <table className="table align-middle project-status-table mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">Project</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">TeamLead</th>
                                            <th scope="col">priority</th>
                                            <th scope="col">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 text-success-dark text-nowrap">Web Redesign</h6>
                                            </td>
                                            <td><span
                                                className="badge text-light-warning f-s-9 f-w-700">In Progress</span>
                                            </td>
                                            <td className="f-w-600 text-dark">
                                                <a className="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-secondary m-auto "
                                                    data-bs-title="Athena Stewart" data-bs-toggle="tooltip">
                                                    <img alt="avtar" className="img-fluid"
                                                        src="{{asset('../assets/images/avtar/2.png')}}" />
                                                </a>


                                            </td>
                                            <td className="text-success-dark f-w-600">
                                                High
                                            </td>
                                            <td>
                                                <span className="text-dark f-s-14 f-w-500 text-nowrap"><i
                                                    className="ti ti-circle-filled me-2 f-s-6"></i> Design phase completed</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 text-warning-dark text-nowrap">Mobile App</h6>
                                            </td>
                                            <td>
                                                <span className="badge text-light-success f-s-9 f-w-700">Completed</span>
                                            </td>
                                            <td className="f-w-600 text-dark">
                                                <a className="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-secondary m-auto"
                                                    data-bs-title="Jane Smith" data-bs-toggle="tooltip">
                                                    <img alt="avtar" className="img-fluid"
                                                        src="{{asset('../assets/images/avtar/3.png')}}" />
                                                </a>
                                            </td>
                                            <td className="text-secondary-dark f-w-600">
                                                Medium
                                            </td>
                                            <td>
                                                <span className="text-dark f-s-14 f-w-500 text-nowrap"><i
                                                    className="ti ti-circle-filled me-2 f-s-6"></i> Project deployed successfully</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 text-danger-dark text-nowrap">
                                                    Campaign</h6>
                                            </td>
                                            <td>
                                                <span className="badge text-light-secondary f-s-9 f-w-700">Not Started</span>
                                            </td>
                                            <td className="f-w-600 text-dark">
                                                <a className="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-secondary m-auto"
                                                    data-bs-title="Mark Lee" data-bs-toggle="tooltip">
                                                    <img alt="avtar" className="img-fluid"
                                                        src="{{asset('../assets/images/avtar/4.png')}}" />
                                                </a>
                                            </td>
                                            <td className="text-danger-dark f-w-600">
                                                Low
                                            </td>
                                            <td>
                                                <span className="text-dark f-s-14 f-w-500 text-nowrap"><i
                                                    className="ti ti-circle-filled me-2 f-s-6"></i> Campaign to begin in December</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 text-primary-dark text-nowrap">E-Commerce</h6>
                                            </td>
                                            <td>
                                                <span className="badge text-light-warning f-s-9 f-w-700">In Progress</span>
                                            </td>
                                            <td className="f-w-600 text-dark">
                                                <a className="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-secondary m-auto"
                                                    data-bs-title="Alice Johnson" data-bs-toggle="tooltip">
                                                    <img alt="avtar" className="img-fluid"
                                                        src="{{asset('../assets/images/avtar/5.png')}}" />
                                                </a>
                                            </td>
                                            <td className="text-success-dark f-w-600">
                                                High
                                            </td>
                                            <td>
                                                <span className="text-dark f-s-14 f-w-500 text-nowrap"><i
                                                    className="ti ti-circle-filled me-2 f-s-6"></i> Initial setup </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 text-success-dark text-nowrap">Social Media </h6>
                                            </td>
                                            <td>
                                                <span className="badge text-light-success f-s-9 f-w-700">Completed</span>
                                            </td>
                                            <td className="f-w-600 text-dark">
                                                <a className="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-secondary m-auto"
                                                    data-bs-title="Sophia Green" data-bs-toggle="tooltip">
                                                    <img alt="avtar" className="img-fluid"
                                                        src="{{asset('../assets/images/avtar/4.png')}}" />
                                                </a>
                                            </td>
                                            <td className="text-danger-dark f-w-600">
                                                Low
                                            </td>
                                            <td>
                                                <span className="text-dark f-s-14 f-w-500 text-nowrap">
                                                    <i className="ti ti-circle-filled me-2 f-s-6"></i> Campaign launched successfully
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 text-success-dark text-nowrap">SEO Optimization</h6>
                                            </td>
                                            <td>
                                                <span className="badge text-light-warning f-s-9 f-w-700">In Progress</span>
                                            </td>
                                            <td className="f-w-600 text-dark">
                                                <a className="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-secondary m-auto"
                                                    data-bs-title="Liam Carter" data-bs-toggle="tooltip">
                                                    <img alt="avtar" className="img-fluid"
                                                        src="{{asset('../assets/images/avtar/5.png')}}" />
                                                </a>
                                            </td>
                                            <td className="text-success-dark f-w-600">
                                                Medium
                                            </td>
                                            <td>
                                                <span className="text-dark f-s-14 f-w-500 text-nowrap">
                                                    <i className="ti ti-circle-filled me-2 f-s-6"></i> Keyword analysis ongoing
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 text-success-dark text-nowrap">UI/UX Revamp</h6>
                                            </td>
                                            <td>
                                                <span className="badge text-light-info f-s-9 f-w-700">Scheduled</span>
                                            </td>
                                            <td className="f-w-600 text-dark">
                                                <a className="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-secondary m-auto"
                                                    data-bs-title="Olivia Brown" data-bs-toggle="tooltip">
                                                    <img alt="avtar" className="img-fluid"
                                                        src="{{asset('../assets/images/avtar/6.png')}}" />
                                                </a>
                                            </td>
                                            <td className="text-danger-dark f-w-600">
                                                Low
                                            </td>
                                            <td>
                                                <span className="text-dark f-s-14 f-w-500 text-nowrap">
                                                    <i className="ti ti-circle-filled me-2 f-s-6"></i> Resources allocated
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="table-footer ">
                        <p className="mb-0 f-s-15 f-w-500 txt-ellipsis-1">Showing 7 to 20 of 20 entries</p>
                        <ul className="pagination app-pagination justify-content-end ">
                            <li className="page-item disabled"><a className="page-link b-r-left"
                                href="#">Previous</a></li>
                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                            <li className="page-item active"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item"><a className="page-link" href="#">Next</a></li>
                        </ul>
                    </div>
                </div>

                <div className="col-md-6 col-lg-5 col-xxl-3">
                    <div className="p-3">
                        <h5>Today Tasks</h5>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="task-container slider">
                                <div className="card task-card bg-danger-300">
                                    <div className="card-body">
                                        <h6 className="text-danger-dark txt-ellipsis-1">Finalize Project
                                            Proposal</h6>

                                        <ul className="avatar-group justify-content-start my-3">
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-primary">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/4.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-success"
                                                data-bs-title="Lennon Briggs" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/5.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-danger"
                                                data-bs-title="Maya Horton" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/6.png')}}" />
                                            </li>
                                        </ul>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div aria-valuemax="100" aria-valuemin="0"
                                                aria-valuenow="25" className="progress w-100" role="progressbar">
                                                <div
                                                    className="progress-bar bg-danger-dark progress-bar-striped progress-bar-animated"
                                                    style={{ width: '68%' }}
                                                ></div>
                                            </div>
                                            <span className="badge bg-white-300 text-danger-dark ms-2 ">+ 68%</span>
                                        </div>


                                    </div>
                                </div>

                                <div className="card">
                                    <div className="d-flex justify-content-between align-items-center rounded p-1 bg-primary-300">
                                        <span className="bg-primary h-35 w-35 d-flex-center rounded">
                                            <i className="iconoir-group f-s-18"></i>
                                        </span>
                                        <h6 className="mb-0 txt-ellipsis-1">Meeting</h6>
                                        <div className="d-flex gap-2">
                                            <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i
                                                className="iconoir-more-horiz f-s-18"></i>
                                            </span>
                                            <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i
                                                className="iconoir-copy f-s-18"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card task-card bg-warning-300">
                                    <div className="card-body">
                                        <h6 className="text-warning-dark txt-ellipsis-1">Design Homepage Layout</h6>
                                        <ul className="avatar-group justify-content-start my-3">
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-primary">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/3.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info"
                                                data-bs-title="Sophia Turner" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/7.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-warning"
                                                data-bs-title="Lucas Green" data-bs-toggle="tooltip">
                                                <img alt="avtar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/8.png')}}" />
                                            </li>
                                        </ul>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div aria-valuemax="100" aria-valuemin="0"
                                                aria-valuenow="25" className="progress w-100" role="progressbar">
                                                <div className="progress-bar bg-warning-dark progress-bar-striped progress-bar-animated"
                                                    style={{
                                                        width: '35%'
                                                    }}></div>
                                            </div>

                                            <span className="badge bg-white-400 text-secondary-dark ms-2">+ 35%</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="card">
                                    <div className="d-flex justify-content-between align-items-center rounded p-1 bg-info-300">
                                        <span className="bg-info h-35 w-35 d-flex-center rounded">
                                            <i className="iconoir-group f-s-18"></i>
                                        </span>
                                        <h6 className="mb-0 txt-ellipsis-1">Meeting</h6>
                                        <div className="d-flex gap-2">
                                            <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i
                                                className="iconoir-more-horiz f-s-18"></i>
                                            </span>
                                            <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i
                                                className="iconoir-copy f-s-18"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="d-flex justify-content-between align-items-center rounded p-1 bg-success-300">
                                        <span className="bg-success h-35 w-35 d-flex-center rounded">
                                            <i className="iconoir-group f-s-18"></i>
                                        </span>
                                        <h6 className="mb-0 txt-ellipsis-1">Meeting</h6>
                                        <div className="d-flex gap-2">
                                            <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i
                                                className="iconoir-more-horiz f-s-18"></i>
                                            </span>
                                            <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i
                                                className="iconoir-copy f-s-18"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card task-card bg-info-300">
                                    <div className="card-body">
                                        <h6 className="text-info-dark txt-ellipsis-1">Develop API Integration</h6>
                                        <ul className="avatar-group justify-content-start my-3">
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info">
                                                <img alt="avatar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/4.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info"
                                                data-bs-title="Michael Johnson" data-bs-toggle="tooltip">
                                                <img alt="avatar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/6.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-warning"
                                                data-bs-title="Emily Brown" data-bs-toggle="tooltip">
                                                <img alt="avatar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/5.png')}}" />
                                            </li>
                                        </ul>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="60"
                                                className="progress w-100" role="progressbar">
                                                <div className="progress-bar bg-info-dark progress-bar-striped progress-bar-animated"
                                                    style={{ width: '60%' }}></div>
                                            </div>
                                            <span className="badge bg-white-400 text-secondary-dark ms-2">+ 60%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card task-card bg-success-300">
                                    <div className="card-body">
                                        <h6 className="text-success-dark txt-ellipsis-1">Test User Feedback</h6>
                                        <ul className="avatar-group justify-content-start my-3">
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-primary">
                                                <img alt="avatar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/9.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info"
                                                data-bs-title="Alice Smith" data-bs-toggle="tooltip">
                                                <img alt="avatar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/10.png')}}" />
                                            </li>
                                            <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-success"
                                                data-bs-title="John Doe" data-bs-toggle="tooltip">
                                                <img alt="avatar" className="img-fluid"
                                                    src="{{asset('../assets/images/avtar/11.png')}}" />
                                            </li>
                                        </ul>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="80"
                                                className="progress w-100" role="progressbar">
                                                <div className="progress-bar bg-success-dark progress-bar-striped progress-bar-animated"
                                                    style={{ width: '80%' }}></div>
                                            </div>
                                            <span className="badge bg-white-400 text-secondary-dark ms-2">+ 80%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </AuthenticatedLayout>

    );
}
