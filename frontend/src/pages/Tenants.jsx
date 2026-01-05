// src/pages/Tenants.jsx
import React from "react";

function Tenants() {
  return (
    <div className="page">
      <h2 className="page-title">Tenants</h2>
      <p className="page-subtitle">
        View tenant details, rent status, and lease information at a glance.
      </p>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tenant List</h3>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Tenant Name</th>
                <th>Property</th>
                <th>Contact</th>
                <th>Rent Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rahul Sharma</td>
                <td>Green Heights – 2BHK</td>
                <td>+91 98765 43210</td>
                <td><span className="badge badge-paid">Paid</span></td>
              </tr>
              <tr>
                <td>Imran Khan</td>
                <td>Lake Residency – Studio</td>
                <td>+91 99887 66554</td>
                <td><span className="badge badge-pending">Pending</span></td>
              </tr>
              <tr>
                <td>Priya Singh</td>
                <td>Sunrise Villas – 3BHK</td>
                <td>+91 90909 80808</td>
                <td><span className="badge badge-overdue">Overdue</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tenants;