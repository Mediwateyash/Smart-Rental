// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // Simple check - in real app use Context
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getPanelLink = () => {
    if (!user) return "/";
    if (user.role === 'admin') return "/admin";
    if (user.role === 'owner') return "/owner";
    return "/tenant";
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Smart Rental
        </Link>

        <nav className="navbar-links">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user.name.split(" ")[0]}</span>
              <Link className="nav-item" to={getPanelLink()}>Dashboard</Link>
              <button onClick={handleLogout} className="nav-item logout-btn">Logout</button>
            </div>
          ) : (
            <div className="guest-menu">
              <Link className="nav-item" to="/">Home</Link>
              <Link className="btn btn-light" to="/auth">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;