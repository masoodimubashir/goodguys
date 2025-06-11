import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react';
import NavLink from './NavLink';

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
                    className="sidebar-overlay" 
                    onClick={closeSidebar}
                  
                />
            )}

            <nav className={`sidebar ${isMobile ? (isSidebarOpen ? 'sidebar-open' : 'sidebar-closed') : ''}`}>
                <div className="app-logo">
                    <span className="bg-light-primary toggle-semi-nav" onClick={toggleSidebar}>
                        <i className={`ti ${isSidebarOpen ? 'ti-chevrons-left' : 'ti-chevrons-right'} f-s-20`}></i>
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
                                <i className="iconoir-home-alt"></i>
                                dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                active={url === '/inventory'} 
                                href='/inventory'
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <i className="iconoir-box"></i>
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
                                    <i className="iconoir-user-badge-check"></i>
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
                                <i className="iconoir-user-plus"></i>
                                Clients
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                active={url === '/module'} 
                                href='/module'
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <i className="iconoir-box"></i>
                                Module
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                active={url === '/client-vendor'} 
                                href='/client-vendor'
                                onClick={() => isMobile && closeSidebar()}
                            >
                                <i className="iconoir-box"></i>
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