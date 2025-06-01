import { useState } from 'react';


import { Link, router, usePage } from '@inertiajs/react';
import NavLink from './NavLink';
import { use } from 'react';

const ProfileCanvas = ({ Logo }) => {

    const user = usePage().props.auth.user;

    const [isOpen, setIsOpen] = useState(false);

    const toggleCanvas = () => {
        setIsOpen(!isOpen);
    };

    const logOut = (e) => {
        e.preventDefault()
        router.post(route('logout'));
    }

    return (
        <>
            <a
                className="d-block head-icon"
                onClick={toggleCanvas}
                role="button"
            >
                <img
                    alt="avatar"
                    className="b-r-50 w-35 bg-dark"
                    src={Logo}
                />
            </a>

            <div
                className={`offcanvas offcanvas-end header-profile-canvas ${isOpen ? 'show' : ''}`}
                id="profilecanvasRight"
                tabIndex="-1"
            >
                <div className="offcanvas-body app-scroll">
                    <ul>
                        <li className="d-flex gap-3 mb-3">
                            <div className="d-flex-center">
                                <span className="h-45 w-45 d-flex-center b-r-10 position-relative">
                                    <img
                                        alt=""
                                        className="img-fluid b-r-10"
                                        src={Logo}
                                    />
                                </span>
                            </div>
                            <div className="text-center mt-2">
                                <h6 className="mb-0">
                                    
                                    {user.name}

                                </h6>
                                <p className="f-s-12 mb-0 text-secondary">
                                    {user.email}
                                </p>
                            </div>
                        </li>

                        <li>
                            <NavLink
                                className="f-w-500"
                                href={route('profile.edit')}
                            >
                                <i className="iconoir-user-love pe-1 f-s-20"></i> Profile
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                className="f-w-500"
                                href={route('company-profile.index')}
                            >
                                <i className="iconoir-settings pe-1 f-s-20"></i> Company Profile
                            </NavLink>
                        </li>


                        <li>
                            <Link
                                role='button'
                                className="mb-0 btn btn-light-danger btn-sm justify-content-center"
                                onClick={logOut}
                            >
                                <i className="ph-duotone ph-sign-out pe-1 f-s-20"></i> Log Out
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ProfileCanvas;
