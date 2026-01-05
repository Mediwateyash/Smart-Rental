
import React, { useState, useEffect } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        fetchUsers();
        fetchProperties();
        fetchRooms();
    }, []);

    const fetchProperties = async () => {
        try {
            const { data } = await api.get("/properties");
            setProperties(data);
        } catch (err) { console.error(err); }
    };

    const fetchRooms = async () => {
        try {
            const { data } = await api.get("/rooms");
            setRooms(data);
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/users");
            setUsers(data);
        } catch (err) { console.error(err); }
    };

    // ... existing delete/role functions ...

    return (
        <div className="page">
            <h1 className="page-title">Admin Console</h1>
            <p className="page-subtitle">Master Management System</p>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", marginTop: "1rem" }}>
                <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("users")}>Users</button>
                <button className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("properties")}>Properties</button>
                <button className={`btn ${activeTab === 'rooms' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("rooms")}>Rooms</button>
            </div>

            {activeTab === 'users' && (
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>All Users</h3>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td><span className="badge badge-pending">{u.role}</span></td>
                                        <td>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                {u.role !== 'admin' && (
                                                    <button className="btn btn-outline" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem" }} onClick={() => handleMakeAdmin(u._id)}>Make Admin</button>
                                                )}
                                                <button className="btn btn-outline" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", color: "red", borderColor: "red" }} onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'properties' && (
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>All Properties ({properties.length})</h3>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Owner</th>
                                    <th>Location</th>
                                    <th>Rent</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.title}</td>
                                        <td>{p.owner?.name} ({p.owner?.email})</td>
                                        <td>{p.city}, {p.address}</td>
                                        <td>₹{p.rent}</td>
                                        <td><a href={`/room/${p._id}`} style={{ color: "var(--color-primary)" }}>View</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'rooms' && (
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>All Rooms & Occupancy ({rooms.length})</h3>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Room #</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                    <th>Tenant (Occupant)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(r => (
                                    <tr key={r._id}>
                                        <td>{r.property?.title || "Unknown"}</td>
                                        <td>{r.roomNumber}</td>
                                        <td>{r.property?.owner?.name}</td>
                                        <td>
                                            <span style={{
                                                padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem",
                                                background: r.status === 'Occupied' ? '#dcfce7' : '#fef9c3',
                                                color: r.status === 'Occupied' ? '#166534' : '#854d0e'
                                            }}>{r.status}</span>
                                        </td>
                                        <td>
                                            {r.currentTenant ? (
                                                <div>
                                                    <div style={{ fontWeight: "bold" }}>{r.currentTenant.name}</div>
                                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{r.currentTenant.email}</div>
                                                </div>
                                            ) : (
                                                <span style={{ color: "#aaa" }}>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
