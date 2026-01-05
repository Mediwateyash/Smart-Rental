// src/pages/Properties.jsx
import React from "react";

function Properties() {
  return (
    <div className="page">
      <h2 className="page-title">Properties</h2>
      <p className="page-subtitle">
        Manage all your rental properties. Add, update, or track occupancy and rent status.
      </p>

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Green Heights – 2BHK</h3>
            <span className="badge badge-paid">Occupied</span>
          </div>
          <p className="card-subtitle">
            Location: Andheri West, Mumbai · Rent: ₹35,000 / month
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">City View – 1BHK</h3>
            <span className="badge badge-pending">Vacant</span>
          </div>
          <p className="card-subtitle">
            Location: Thane · Rent: ₹22,000 / month
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lake Residency – Studio</h3>
            <span className="badge badge-paid">Occupied</span>
          </div>
          <p className="card-subtitle">
            Location: Powai · Rent: ₹18,000 / month
          </p>
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
        + Add New Property
      </button>
    </div>
  );
}

export default Properties;