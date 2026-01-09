
import React, { useState, useEffect } from "react";
import api from "../api/axios";

const OwnerDashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [properties, setProperties] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [applications, setApplications] = useState([]); // Owner applications
    const [activeTab, setActiveTab] = useState("properties");

    const [newProp, setNewProp] = useState({ title: "", address: "", city: "", rent: 0, bedrooms: 1, bathrooms: 1, coverImage: "", images: "", amenities: "" });
    const [newRoom, setNewRoom] = useState({ propertyId: "", roomNumber: "", rent: 0 });
    const [editingProp, setEditingProp] = useState(null); // For edit modal
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchProperties();
        fetchRooms();
        fetchApplications();
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/users/profile");
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
        } catch (err) { console.error(err); }
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

    const fetchProperties = async () => {
        try {
            const userId = user.id || user._id;
            const { data } = await api.get(`/properties?owner=${userId}`);
            setProperties(data);
        } catch (err) { console.error(err); }
    };

    const fetchRooms = async () => {
        try {
            // Filter rooms by current owner
            const userId = user.id || user._id;
            const { data } = await api.get(`/rooms?owner=${userId}`);
            setRooms(data);
        } catch (err) { console.error(err); }
    };

    const fetchApplications = async () => {
        try {
            const { data } = await api.get("/applications");
            setApplications(data);
        } catch (err) { console.error(err); }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newProp,
                images: newProp.images.split(",").map(s => s.trim()).filter(s => s),
                amenities: newProp.amenities.split(",").map(s => s.trim()).filter(s => s)
            };
            await api.post("/properties", payload);
            alert("Property Added Successfully!");
            setNewProp({ title: "", address: "", city: "", rent: 0, bedrooms: 1, bathrooms: 1, coverImage: "", images: "", amenities: "" });
            fetchProperties();
        } catch (err) {
            console.error(err);
            alert("Failed to add property: " + (err.response?.data?.msg || err.message));
        }
    };

    const handleEditProperty = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...editingProp,
                images: typeof editingProp.images === 'string' ? editingProp.images.split(",").map(s => s.trim()) : editingProp.images,
                amenities: typeof editingProp.amenities === 'string' ? editingProp.amenities.split(",").map(s => s.trim()) : editingProp.amenities
            };
            await api.put(`/properties/${editingProp._id}`, payload);
            alert("Property Updated!");
            setEditingProp(null);
            fetchProperties();
        } catch (err) { console.error(err); }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post("/rooms", newRoom);
            alert("Room Added!");
            setNewRoom({ propertyId: "", roomNumber: "", rent: 0 });
            fetchRooms();
        } catch (err) { console.error(err); }
    };

    const handleAppStatus = async (id, status) => {
        try {
            await api.put(`/applications/${id}/status`, { status });
            fetchApplications();
            fetchRooms(); // Update occupancy
            alert(`Application ${status}`);
        } catch (err) { console.error(err); }
    }

    const handleDeleteProperty = async (id) => {
        if (!window.confirm("Are you sure? This will also delete all rooms associated with this property.")) return;
        try {
            await api.delete(`/properties/${id}`);
            alert("Property Deleted");
            fetchProperties();
        } catch (err) { console.error(err); alert("Failed to delete property"); }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm("Delete this room?")) return;
        try {
            await api.delete(`/rooms/${id}`);
            alert("Room Deleted");
            fetchRooms();
        } catch (err) { console.error(err); alert("Failed to delete room"); }
    };

    return (
        <div className="page">
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title">Owner Dashboard</h1>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <button className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("properties")}>Properties</button>
                <button className={`btn ${activeTab === 'rooms' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("rooms")}>Rooms</button>
                <button className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab("applications")}>Applications</button>
                <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setActiveTab("profile"); setEditForm(user); }}>My Profile</button>
            </div>

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
                                <p><strong>Address:</strong> {user.address || "Not set"}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "properties" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                        <h3 style={{ marginBottom: "1rem" }}>Your Properties</h3>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {properties.map(p => (
                                <div key={p._id} className="card">
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <h4>{p.title}</h4>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button className="btn btn-outline" style={{ padding: "0.2rem 0.6rem", fontSize: "0.8rem" }} onClick={() => setEditingProp(p)}>Edit</button>
                                            <button className="btn btn-outline" style={{ padding: "0.2rem 0.6rem", fontSize: "0.8rem", borderColor: "red", color: "red" }} onClick={() => handleDeleteProperty(p._id)}>Delete</button>
                                        </div>
                                    </div>
                                    <p className="text-muted">{p.address}, {p.city}</p>
                                    {p.amenities?.length > 0 && <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Features: {p.amenities.join(", ")}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: "1rem" }}>{editingProp ? "Edit Property" : "Add New Property"}</h3>
                        <form onSubmit={editingProp ? handleEditProperty : handleAddProperty}>
                            {/* Reusing form logic for edit needs careful state management, keeping it simple here */}
                            <input className="form-control" style={{ marginBottom: "0.5rem" }} placeholder="Title"
                                value={editingProp ? editingProp.title : newProp.title}
                                onChange={e => editingProp ? setEditingProp({ ...editingProp, title: e.target.value }) : setNewProp({ ...newProp, title: e.target.value })} required />

                            <input className="form-control" style={{ marginBottom: "0.5rem" }} placeholder="Address"
                                value={editingProp ? editingProp.address : newProp.address}
                                onChange={e => editingProp ? setEditingProp({ ...editingProp, address: e.target.value }) : setNewProp({ ...newProp, address: e.target.value })} required />

                            <input className="form-control" style={{ marginBottom: "0.5rem" }} placeholder="City"
                                value={editingProp ? editingProp.city : newProp.city}
                                onChange={e => editingProp ? setEditingProp({ ...editingProp, city: e.target.value }) : setNewProp({ ...newProp, city: e.target.value })} required />

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <input className="form-control" type="number" style={{ marginBottom: "0.5rem" }} placeholder="Bedrooms"
                                    value={editingProp ? editingProp.bedrooms : newProp.bedrooms}
                                    onChange={e => editingProp ? setEditingProp({ ...editingProp, bedrooms: e.target.value }) : setNewProp({ ...newProp, bedrooms: e.target.value })} />

                                <input className="form-control" type="number" style={{ marginBottom: "0.5rem" }} placeholder="Bathrooms"
                                    value={editingProp ? editingProp.bathrooms : newProp.bathrooms}
                                    onChange={e => editingProp ? setEditingProp({ ...editingProp, bathrooms: e.target.value }) : setNewProp({ ...newProp, bathrooms: e.target.value })} />
                            </div>

                            <input className="form-control" type="number" style={{ marginBottom: "0.5rem" }} placeholder="Base Rent"
                                value={editingProp ? editingProp.rent : newProp.rent}
                                onChange={e => editingProp ? setEditingProp({ ...editingProp, rent: e.target.value }) : setNewProp({ ...newProp, rent: e.target.value })} required />

                            <input className="form-control" style={{ marginBottom: "0.5rem" }} placeholder="Cover Image URL (Hero Image)"
                                value={editingProp ? (editingProp.coverImage || "") : newProp.coverImage}
                                onChange={e => editingProp ? setEditingProp({ ...editingProp, coverImage: e.target.value }) : setNewProp({ ...newProp, coverImage: e.target.value })} />

                            <input className="form-control" style={{ marginBottom: "0.5rem" }} placeholder="Additional Image URLs (comma separated)"
                                value={editingProp ? (Array.isArray(editingProp.images) ? editingProp.images.join(",") : editingProp.images) : newProp.images}
                                onChange={e => editingProp ? setEditingProp({ ...editingProp, images: e.target.value }) : setNewProp({ ...newProp, images: e.target.value })} />

                            <input className="form-control" style={{ marginBottom: "1rem" }} placeholder="Amenities (Pool, Gym...)"
                                value={editingProp ? (Array.isArray(editingProp.amenities) ? editingProp.amenities.join(",") : editingProp.amenities) : newProp.amenities}
                                onChange={e => editingProp ? setEditingProp({ ...editingProp, amenities: e.target.value }) : setNewProp({ ...newProp, amenities: e.target.value })} />

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button className="btn btn-primary">{editingProp ? "Update" : "Add Property"}</button>
                                {editingProp && <button type="button" className="btn btn-outline" onClick={() => setEditingProp(null)}>Cancel</button>}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === "rooms" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                        <h3 style={{ marginBottom: "1rem" }}>Rooms</h3>
                        <div className="table-wrapper">
                            <table className="table">
                                <thead><tr><th>Property</th><th>Room</th><th>Status</th><th>Tenant</th><th>Action</th></tr></thead>
                                <tbody>
                                    {rooms.map(r => (
                                        <tr key={r._id}>
                                            <td>{r.property?.title || "Unknown"}</td>
                                            <td>{r.roomNumber}</td>
                                            <td>{r.status}</td>
                                            <td>{r.currentTenant ? r.currentTenant.name : '-'}</td>
                                            <td>
                                                <button className="btn btn-outline" style={{ padding: "0.2rem 0.6rem", fontSize: "0.8rem", color: "red", borderColor: "red" }} onClick={() => handleDeleteRoom(r._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: "1rem" }}>Add Room</h3>
                        <form onSubmit={handleAddRoom}>
                            <select className="form-control" style={{ marginBottom: "0.5rem" }} value={newRoom.propertyId} onChange={e => setNewRoom({ ...newRoom, propertyId: e.target.value })} required>
                                <option value="">Select Property</option>
                                {properties.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                            </select>
                            <input className="form-control" style={{ marginBottom: "0.5rem" }} placeholder="Room Number" value={newRoom.roomNumber} onChange={e => setNewRoom({ ...newRoom, roomNumber: e.target.value })} required />
                            <input className="form-control" type="number" style={{ marginBottom: "1rem" }} placeholder="Rent" value={newRoom.rent} onChange={e => setNewRoom({ ...newRoom, rent: e.target.value })} required />
                            <button className="btn btn-primary">Add Room</button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="table-wrapper">
                    <h3 style={{ margin: "1rem" }}>Applications Review</h3>
                    <table className="table">
                        <thead><tr><th>Tenant</th><th>Income</th><th>Room</th><th>Status</th><th>Reason</th><th>Action</th></tr></thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td>{app.tenant?.name}</td>
                                    <td>{app.tenant?.monthlyIncome}</td>
                                    <td>{app.room?.roomNumber}</td>
                                    <td>{app.status}</td>
                                    <td>{app.cancellationReason || "-"}</td>
                                    <td>
                                        {app.status === 'Pending' && (
                                            <>
                                                <button className="btn btn-primary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", marginRight: "0.5rem" }} onClick={() => handleAppStatus(app._id, "Approved")}>Accept</button>
                                                <button className="btn btn-outline" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", color: "red", borderColor: "red" }} onClick={() => handleAppStatus(app._id, "Rejected")}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && <tr><td colSpan="6">No applications.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default OwnerDashboard;
