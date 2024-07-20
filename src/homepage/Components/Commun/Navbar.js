import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../images/logo.png';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };
  const isActiveButton = (path) => {
    return location.pathname !== path ? 'nav-link' : 'nav-link custom-btn btn';
  };
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={logo} className="img-fluid logo-image" alt="Logo" />
          <div className="d-flex flex-column">
          <strong className="logo-text">SympDoctor</strong>
<small className="logo-slogan">Your healthcare companion</small>

          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav align-items-center ms-lg-5">
            <li className="nav-item">
            <Link className={isActive('/')} to="/">Homepage</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="about.html">About CliniSys</a>
            </li>
            <li className="nav-item dropdown">
            </li>
            <li className="nav-item">
              <a className="nav-link" href="contact.html">Contact</a>
            </li>
            <li className="nav-item ms-lg-auto">
            <Link className={isActiveButton('/register')} to="/register">Register</Link>
            </li>
            <li className="nav-item">
            <Link className={isActiveButton('/login')} to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;