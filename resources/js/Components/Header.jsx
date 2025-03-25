import React from 'react'
import ProfileCanvas from './ProfileCanvas'
import Logo from '../../Logo/good_guys.png'

export const Header = () => {
    return (
        <>
            <header className="header-main">

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-6 col-sm-4 d-flex align-items-center header-left p-0">
                            <span className="header-toggle me-3">
                                <i className="iconoir-view-grid"></i>
                            </span>
                        </div>

                        <div className="col-6 col-sm-8 d-flex align-items-center justify-content-end header-right p-0">

                            <ul className="d-flex align-items-center">

                                <li className="header-profile">

                                    <ProfileCanvas Logo={Logo} />

                                </li>

                            </ul>

                        </div>

                    </div>

                </div>

            </header >
        </>
    )
}
