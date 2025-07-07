import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react';
import NavLink from './NavLink';
import { Box, Boxes, ChevronLeft, ChevronRight, Home, PartyPopper, ShoppingBag, User, UserPlus } from 'lucide-react';

export const SideBar = () => {


    const { url, props } = usePage();
    const user = props.auth.user;

    // State to manage sidebar open/close
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar when clicking outside (mobile only)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isSidebarOpen) {
                const sidebar = document.querySelector('nav');
                if (sidebar && !sidebar.contains(event.target)) {
                    setIsSidebarOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen, isMobile]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className=""
                    onClick={closeSidebar}

                />
            )}

            <nav className={`sidebar ${isMobile ? (isSidebarOpen ? 'sidebar-open' : 'sidebar-closed') : ''}`}>
                <div className="app-logo">
                    <span className="bg-light-primary toggle-semi-nav" onClick={toggleSidebar}>
                        <i>
                            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                        </i>

                    </span>
                </div>

                <div className="app-nav" id="app-simple-bar">
                    <ul className="main-nav p-0 mt-2">
                        <li>
                            <NavLink
                                active={url === '/dashboard'}
                                href={route('dashboard')}
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <Home size={16} />
                                dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                active={url === '/inventory'}
                                href='/inventory'
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <Box size={16} />
                                Inventory
                            </NavLink>
                        </li>

                        {user.role === 'admin' && (
                            <li>
                                <NavLink
                                    active={url === '/users'}
                                    href='/users'
                                    onClick={() => isMobile && closeSidebar()}
                                >
                                    <User size={16} />
                                    Users
                                </NavLink>
                            </li>
                        )}

                        <li>
                            <NavLink
                                active={url === '/clients'}
                                href='/clients'
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <UserPlus size={16} />
                                Clients
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                active={url === '/module'}
                                href='/module'
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <Boxes size={16} />
                                Module
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                active={url === '/client-vendor'}
                                href='/client-vendor'
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <ShoppingBag size={16} />
                                Parties
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