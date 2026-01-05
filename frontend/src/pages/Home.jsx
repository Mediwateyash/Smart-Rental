
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Home = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Fetch some sample rooms for display
        api.get("/rooms")
            .then(res => setRooms(res.data.filter(r => r.status === 'Vacant').slice(0, 6))) // Show up to 6
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="page">
            {/* New Hero Section */}
            <section className="hero-new">
                <div>
                    <h1 className="hero-title">
                        Discover Your Ideal <span className="hero-highlight">Living Space</span>
                    </h1>
                    <p>
                        Experience the comfort of finding a home that fits your lifestyle.
                        Smart Rental Management connects you with premium properties and reliable owners seamlessly.
                    </p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Link to="/tenant" className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem" }}>Find a Home</Link>
                        <Link to="/auth" className="btn btn-outline" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem" }}>Join Now</Link>
                    </div>
                </div>
                <div>
                    {/* Enhanced Hero Image */}
                    <div className="hero-image-box"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Why Choose Us?</h2>
                    <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>We provide a seamless experience for both tenants and property owners.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                    <div className="card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏡</div>
                        <h3 style={{ marginBottom: "1rem" }}>Verified Listings</h3>
                        <p className="text-muted">Every property is verified to ensure you get exactly what you see.</p>
                    </div>
                    <div className="card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚡</div>
                        <h3 style={{ marginBottom: "1rem" }}>Instant Process</h3>
                        <p className="text-muted">Apply to properties instantly and track your application status in real-time.</p>
                    </div>
                    <div className="card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛡️</div>
                        <h3 style={{ marginBottom: "1rem" }}>Secure & Reliable</h3>
                        <p className="text-muted">Direct communication with owners and secure lease management.</p>
                    </div>
                </div>
            </section>

            {/* Listings Section */}
            <section className="section" style={{ marginBottom: "6rem", marginTop: "4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h2>Featured Properties</h2>
                    <Link to="/tenant" className="btn btn-outline">View All</Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
                    {rooms.length > 0 ? rooms.map(room => (
                        <div key={room._id} className="card" style={{ padding: "0", display: "flex", flexDirection: "column" }}>
                            <div style={{
                                height: "200px",
                                background: "#e5e7eb",
                                backgroundImage: `url(${room.property?.coverImage || room.property?.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}>
                                <div style={{ padding: "1rem" }}>
                                    <span className="badge badge-paid" style={{ backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.9)" }}>Vacant</span>
                                </div>
                            </div>
                            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                                <h4 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{room.property?.title}</h4>
                                <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>{room.property?.city}</p>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                                    <div>
                                        <span style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Rent</span>
                                        <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-primary)" }}>₹{room.rent}<small style={{ fontSize: "0.8rem", fontWeight: "normal" }}>/mo</small></span>
                                    </div>
                                    <Link to={`/room-details/${room._id}`} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>See Details</Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p>No rooms currently available to show.</p>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ marginTop: "4rem", borderTop: "1px solid var(--color-border)", padding: "3rem 0", textAlign: "center", color: "var(--color-text-muted)" }}>
                <h3 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>Smart Rental Management</h3>
                <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
