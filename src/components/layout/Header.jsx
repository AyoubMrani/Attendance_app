import React from "react";
import {useLocation} from "react-router-dom";

function Header() {
    const location = useLocation();

    return (
        <nav className="navbar bg-dark border-bottom border-body navbar-expand-lg bg-body-tertiary"
             data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Attendance</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page"
                               href="/">
                                Today's Attendance</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                               aria-current="page" href="/history">History</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === '/create/student' ? 'active' : ''}`}
                               aria-current="page" href="/create/student">Add Student</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === '/create/professor' ? 'active' : ''}`}
                               aria-current="page" href="/create/professor">Add Professor</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header;
