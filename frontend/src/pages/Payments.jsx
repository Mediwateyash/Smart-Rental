// src/pages/Payments.jsx
import React from "react";

function Payments() {
  return (
    <div className="page">
      <h2 className="page-title">Payments</h2>
      <p className="page-subtitle">
        Track rent payments, pending dues, and overdue amounts across all properties.
      </p>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Rent Collection</h3>
          <p className="card-subtitle">This month</p>
        </div>

        <div className="dashboard-grid">
          <div className="mini-card">
            <p className="mini-label">Total Collected</p>
            <p className="mini-value">₹1,20,000</p>
          </div>
          <div className="mini-card">
            <p className="mini-label">Pending</p>
            <p className="mini-value">₹15,000</p>
          </div>
          <div className="mini-card">
            <p className="mini-label">Overdue</p>
            <p className="mini-value">₹8,000</p>
          </div>
        </div>

        <div className="table-wrapper" style={{ marginTop: "1.5rem" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rahul Sharma</td>
                <td>Green Heights – 2BHK</td>
                <td>₹35,000</td>
                <td>05 Nov 2025</td>
                <td><span className="badge badge-paid">Paid</span></td>
              </tr>
              <tr>
                <td>Imran Khan</td>
                <td>Lake Residency – Studio</td>
                <td>₹18,000</td>
                <td>03 Nov 2025</td>
                <td><span className="badge badge-pending">Pending</span></td>
              </tr>
              <tr>
                <td>Priya Singh</td>
                <td>Sunrise Villas – 3BHK</td>
                <td>₹42,000</td>
                <td>01 Nov 2025</td>
                <td><span className="badge badge-overdue">Overdue</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payments;