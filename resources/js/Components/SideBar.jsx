import React from 'react'

import { usePage } from '@inertiajs/react';
import NavLink from './NavLink';


export const SideBar = () => {

    const { url, props } = usePage();

    const user = props.auth.user;



    return (
        <>
            <nav>
                <div className="app-logo">
                    <span className="bg-light-primary toggle-semi-nav">
                        <i className="ti ti-chevrons-right f-s-20"></i>
                    </span>
                </div>

                <div className="app-nav" id="app-simple-bar">

                    <ul className="main-nav p-0 mt-2">

                        <li>
                            <NavLink active={url === '/dashboard' ? true : false} href={route('dashboard')}>
                                <i className="iconoir-home-alt"></i>
                                dashboard
                            </NavLink>
                        </li>


                        <li>
                            <NavLink active={url === '/inventory' ? true : false} href='/inventory'>
                                <i className="iconoir-box"></i>
                                Inventory
                            </NavLink>
                        </li>




                        {
                            user.role === 'admin' &&
                            <li>
                                <NavLink active={url === '/users' ? true : false} href='/users'>
                                    <i class="iconoir-user-badge-check"></i>
                                    Users
                                </NavLink>
                            </li>
                        }

                        <li>
                            <NavLink active={url === '/clients' ? true : false} href='/clients'>
                                <i className="iconoir-user-plus"></i>
                                Clients
                            </NavLink>
                        </li>

                        <li>
                            <NavLink active={url === '/module' ? true : false} href='/module'>
                                <i class="iconoir-box"></i>
                                Module
                            </NavLink>
                        </li>

                        <li>
                            <NavLink active={url === '/vendor' ? true : false} href='/vendor'>
                                <i class="iconoir-box"></i>
                                Vendors
                            </NavLink>
                        </li>





                    </ul>

                </div>

                <div className="menu-navs">
                    <span className="menu-previous"><i className="ti ti-chevron-left"></i></span>
                    <span className="menu-next"><i className="ti ti-chevron-right"></i></span>
                </div>

            </nav>
        </>
    )
}
