// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || (path === "/dashboard" && location.pathname === "/");

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">Smart Rental</div>
      </div>

      <nav className="navbar-links">
        <Link className={isActive("/dashboard") ? "nav-link active" : "nav-link"} to="/dashboard">
          Dashboard
        </Link>
        <Link className={isActive("/properties") ? "nav-link active" : "nav-link"} to="/properties">
          Properties
        </Link>
        <Link className={isActive("/tenants") ? "nav-link active" : "nav-link"} to="/tenants">
          Tenants
        </Link>
        <Link className={isActive("/payments") ? "nav-link active" : "nav-link"} to="/payments">
          Payments
        </Link>
      </nav>

      <div className="navbar-right">
        <Link className="btn btn-outline btn-sm" to="/login">
          Login
        </Link>
      </div>
    </header>
  );
}

export default Navbar;