
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const TenantDashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [rooms, setRooms] = useState([]); // Vacant rooms
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState("find_home");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterBHK, setFilterBHK] = useState("");

    useEffect(() => {
        fetchVacantRooms();
        fetchMyApplications();
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/users/profile");
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
        } catch (err) { console.error(err); }
    }

    const fetchVacantRooms = async () => {
        try {
            // In real app, filter for status=Vacant in backend
            const { data } = await api.get("/rooms");
            setRooms(data.filter(r => r.status === 'Vacant'));
        } catch (err) { console.error(err); }
    };

    const fetchMyApplications = async () => {
        try {
            const { data } = await api.get("/applications");
            setApplications(data);
        } catch (err) { console.error(err); }
    };

    const handleApply = async (roomId) => {
        if (!confirm("Apply for this room?")) return;
        try {
            await api.post("/applications", { roomId });
            alert("Application Sent Successfully! The owner will be notified.");
            fetchMyApplications();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || err.message || "Application Failed";
            alert("Application Failed: " + msg);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put("/users/profile", editForm);
            alert("Profile Updated");
            setIsEditingProfile(false);
            fetchProfile();
        } catch (err) { alert("Update failed"); }
    };

    // Filter logic
    const filteredRooms = rooms.filter(r => {
        const matchSearch = (r.property?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (r.property?.address?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchCity = filterCity ? (r.property?.city?.toLowerCase() || "") === filterCity.toLowerCase() : true;
        // Basic BHK mapping logic (assuming property.bedrooms exists/is correct number)
        const matchBHK = filterBHK ? r.property?.bedrooms?.toString() === filterBHK : true;

        return matchSearch && matchCity && matchBHK;
    });

    return (
        <div className="page">
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title">Welcome, {user.name}</h1>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <button className={`btn ${activeTab === 'find_home' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("find_home")}>Find a Home</button>
                <button className={`btn ${activeTab === 'my_apps' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("my_apps")}>My Applications</button>
                <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setActiveTab("profile"); setEditForm(user); }}>My Profile</button>
            </div>

            {activeTab === 'find_home' && (
                <div>
                    {/* Search & Filters */}
                    <div className="card" style={{ marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                        <input
                            className="form-control"
                            placeholder="Search properties (Name, Address)..."
                            style={{ flex: 1, minWidth: "200px" }}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <select className="form-control" style={{ width: "150px" }} value={filterCity} onChange={e => setFilterCity(e.target.value)}>
                            <option value="">All Cities</option>
                            {[...new Set(rooms.map(r => r.property?.city).filter(Boolean).map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()))].map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <select className="form-control" style={{ width: "150px" }} value={filterBHK} onChange={e => setFilterBHK(e.target.value)}>
                            <option value="">Any BHK</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                        </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                        {filteredRooms.map(r => (
                            <div key={r._id} className="card">
                                <div style={{ height: "150px", background: "#ddd", marginBottom: "1rem", borderRadius: "4px", overflow: "hidden" }}>
                                    {r.property?.images?.[0] ?
                                        <img src={r.property.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Room" /> :
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>No Image</div>
                                    }
                                </div>
                                <h3>{r.property?.title} - Room {r.roomNumber}</h3>
                                <p className="text-muted">{r.property?.address}, {r.property?.city}</p>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", margin: "0.5rem 0" }}>
                                    <span>{r.property?.bedrooms} Bedroom(s)</span>
                                    <strong>Owner: {r.property?.owner?.name}</strong>
                                </div>
                                <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}><strong>Contact:</strong> {r.property?.owner?.phone || "N/A"}</p>

                                <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "0.5rem 0" }}>₹{r.rent}/mo</p>
                                {r.property?.amenities?.length > 0 &&
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                                        {r.property.amenities.map(a => <span key={a} style={{ background: "#eee", padding: "0.2rem 0.5rem", borderRadius: "12px", fontSize: "0.8rem" }}>{a}</span>)}
                                    </div>
                                }
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: "1rem" }}>
                                    <Link to={`/room-details/${r._id}`} className="btn btn-outline" style={{ flex: 1 }}>See Details</Link>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleApply(r._id)}>Apply Now</button>
                                </div>
                            </div>
                        ))}
                        {filteredRooms.length === 0 && <p style={{ textAlign: "center", width: "100%" }}>No rooms match your search.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="card" style={{ maxWidth: "600px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h3>My Profile</h3>
                        {!isEditingProfile && <button className="btn btn-outline" onClick={() => setIsEditingProfile(true)}>Edit</button>}
                    </div>

                    {isEditingProfile ? (
                        <form onSubmit={handleUpdateProfile}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Name</label>
                                <input className="form-control" value={editForm.name || ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Phone</label>
                                <input className="form-control" value={editForm.phone || ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Occupation</label>
                                <input className="form-control" value={editForm.occupation || ""} onChange={e => setEditForm({ ...editForm, occupation: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Monthly Income</label>
                                <input className="form-control" value={editForm.monthlyIncome || ""} onChange={e => setEditForm({ ...editForm, monthlyIncome: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Current Address</label>
                                <input className="form-control" value={editForm.address || ""} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Profile Photo URL</label>
                                <input className="form-control" value={editForm.profilePhoto || ""} onChange={e => setEditForm({ ...editForm, profilePhoto: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Bio / Description</label>
                                <textarea className="form-control" rows="3" value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button className="btn btn-primary">Save Changes</button>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                                {user.profilePhoto ? (
                                    <img src={user.profilePhoto} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "1rem" }} />
                                ) : (
                                    <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#ddd", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>No Photo</div>
                                )}
                                {user.description && <p style={{ fontStyle: "italic", color: "var(--color-text-light)" }}>"{user.description}"</p>}
                            </div>
                            <div style={{ display: "grid", gap: "0.5rem" }}>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone || "Not set"}</p>
                                <p><strong>Occupation:</strong> {user.occupation || "Not set"}</p>
                                <p><strong>Monthly Income:</strong> ₹{user.monthlyIncome || 0}</p>
                                <p><strong>Address:</strong> {user.address || "Not set"}</p>
                            </div>
                        </div>

                    )}
                </div>
            )
            }

            {
                activeTab === 'my_apps' && (
                    <div className="card">
                        <h3>Application Status</h3>
                        <div className="table-wrapper">
                            <table className="table">
                                <thead><tr><th>Property</th><th>Room</th><th>Status</th><th>Owner Contact</th></tr></thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app._id}>
                                            <td>{app.room?.property?.title}</td>
                                            <td>{app.room?.roomNumber}</td>
                                            <td>
                                                <span className={`badge ${app.status === 'Approved' ? 'badge-paid' : app.status === 'Rejected' ? 'badge-overdue' : 'badge-pending'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td>
                                                {app.room?.property?.owner ? (
                                                    <div style={{ fontSize: "0.9rem" }}>
                                                        <div>{app.room.property.owner.name}</div>
                                                        <div style={{ color: "#666" }}>{app.room.property.owner.phone}</div>
                                                    </div>
                                                ) : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                    {applications.length === 0 && <tr><td colSpan="4">No applications submitted.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TenantDashboard;
