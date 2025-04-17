import React from 'react'

import { usePage } from '@inertiajs/react';
import NavLink from './NavLink';


export const SideBar = () => {

    const { url } = usePage();

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


                        <li>
                            <NavLink active={url === '/users' ? true : false} href='/users'>
                                <i className="iconoir-user"></i>
                                Users
                            </NavLink>
                        </li>

                        <li>
                            <NavLink active={url === '/clients' ? true : false} href='/clients'>
                                <i className="iconoir-user-plus"></i>
                                Clients
                            </NavLink>
                        </li>

                        {/* <li>
                            <NavLink active={url === '/accounts' ? true : false} href='/accounts'>
                                <i className="iconoir-user-plus"></i>
                                Ledger
                            </NavLink>
                        </li> */}

                        <li>
                            <NavLink active={url === '/module' ? true : false} href='/module'>
                                <i className="iconoir-user-plus"></i>
                                Module
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
