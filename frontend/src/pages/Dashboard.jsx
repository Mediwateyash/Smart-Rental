// src/pages/Dashboard.jsx
import React from "react";

function Dashboard() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">
            Manage rentals <span className="hero-highlight">smarter</span>, not harder.
          </h1>
          <p className="hero-desc">
            Smart Rental Management System helps landlords and tenants handle listings, rent,
            and maintenance in one easy-to-use platform.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary">Add New Property</button>
            <button className="btn btn-outline">View Tenants</button>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-number">24</div>
              <div className="hero-stat-label">Active Properties</div>
            </div>
            <div>
              <div className="hero-stat-number">18</div>
              <div className="hero-stat-label">Occupied Units</div>
            </div>
            <div>
              <div className="hero-stat-number">₹1.2L</div>
              <div className="hero-stat-label">Monthly Rent Collected</div>
            </div>
          </div>
        </div>

        <div className="hero-card card card-highlight">
          <div className="card-header">
            <div>
              <h3 className="card-title">This Month Overview</h3>
              <p className="card-subtitle">Quick snapshot of key metrics</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="mini-card">
              <p className="mini-label">Total Rent Collected</p>
              <p className="mini-value">₹1,20,000</p>
              <span className="badge badge-paid">On track</span>
            </div>

            <div className="mini-card">
              <p className="mini-label">Pending Payments</p>
              <p className="mini-value">₹15,000</p>
              <span className="badge badge-pending">3 tenants</span>
            </div>

            <div className="mini-card">
              <p className="mini-label">Open Maintenance</p>
              <p className="mini-value">5</p>
              <span className="badge badge-overdue">2 urgent</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Tenants</h3>
            <p className="card-subtitle">Last 5 tenant registrations</p>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Property</th>
                  <th>Move-in Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rahul Sharma</td>
                  <td>2BHK, Green Heights</td>
                  <td>01 Nov 2025</td>
                  <td><span className="badge badge-paid">Active</span></td>
                </tr>
                <tr>
                  <td>Anjali Mehta</td>
                  <td>1BHK, City View</td>
                  <td>20 Oct 2025</td>
                  <td><span className="badge badge-paid">Active</span></td>
                </tr>
                <tr>
                  <td>Imran Khan</td>
                  <td>Studio, Lake Residency</td>
                  <td>05 Oct 2025</td>
                  <td><span className="badge badge-pending">Pending Rent</span></td>
                </tr>
                <tr>
                  <td>Priya Singh</td>
                  <td>3BHK, Sunrise Villas</td>
                  <td>15 Sep 2025</td>
                  <td><span className="badge badge-overdue">Overdue</span></td>
                </tr>
                <tr>
                  <td>Rohan Joshi</td>
                  <td>1RK, Metro Homes</td>
                  <td>01 Sep 2025</td>
                  <td><span className="badge badge-paid">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;