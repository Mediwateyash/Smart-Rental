
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const { data } = await api.get(`/rooms/${id}`);
                setRoom(data);
                if (data.property?.coverImage) {
                    setSelectedImage(data.property.coverImage);
                } else if (data.property?.images?.length > 0) {
                    setSelectedImage(data.property.images[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleApply = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to apply.");
            navigate("/auth");
            return;
        }

        if (!confirm("Are you sure you want to apply for this room?")) return;

        try {
            await api.post("/applications", { roomId: id }, {
                // headers: { Authorization: `Bearer ${token}` } // Interceptor handles this
            });
            alert("Application Sent Successfully! The owner will be notified.");
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || err.message || "Application Failed";
            alert("Application Failed: " + msg);
        }
    };

    if (loading) return <div className="page-center">Loading...</div>;
    if (!room) return <div className="page-center">Property not found.</div>;

    const { property, roomNumber, rent, status } = room;

    return (
        <div className="page">
            <div className="detail-container">
                {/* Image Gallery */}
                <div className="gallery-section">
                    <div className="main-image-wrapper">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Main" className="main-image" />
                        ) : (
                            <div className="placeholder-image">No Image Available</div>
                        )}
                    </div>
                    {property.images && property.images.length > 0 && (
                        <div className="thumbnail-list">
                            {property.coverImage && (
                                <img
                                    src={property.coverImage}
                                    className={`thumbnail ${selectedImage === property.coverImage ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(property.coverImage)}
                                    alt="Cover"
                                />
                            )}
                            {property.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(img)}
                                    alt={`View ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                {/* Details */}
                <div className="info-section">
                    <div className="info-header">
                        <div>
                            <h1 className="property-title">{property.title}</h1>
                            <p className="property-address">{property.address}, {property.city}</p>
                        </div>
                        <span className={`badge ${status === 'Vacant' ? 'badge-paid' : 'badge-overdue'}`}>{status}</span>
                    </div>

                    <div className="price-tag">
                        ₹{rent}<span className="per-month">/month</span>
                    </div>

                    <div className="specs-grid">
                        <div className="spec-item">
                            <span className="spec-label">Bedrooms</span>
                            <span className="spec-value">{property.bedrooms}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Bathrooms</span>
                            <span className="spec-value">{property.bathrooms}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Room No</span>
                            <span className="spec-value">{roomNumber}</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <h3>Amenities</h3>
                    <div className="amenities-list">
                        {property.amenities && property.amenities.length > 0 ? (
                            property.amenities.flatMap(am =>
                                // Handle if amenities are stored as comma-separated string or array
                                typeof am === 'string' && am.includes(',') ? am.split(',') : am
                            ).map((am, idx) => (
                                <span key={idx} className="amenity-tag">{am.trim()}</span>
                            ))
                        ) : (
                            <p className="text-muted">No amenities listed.</p>
                        )}
                    </div>

                    <div className="divider"></div>

                    <h3>Owner Details</h3>
                    <div className="owner-card">
                        <div className="owner-avatar">
                            {property.owner?.profilePhoto ? (
                                <img src={property.owner.profilePhoto} alt={property.owner.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            ) : (
                                property.owner?.name?.[0]?.toUpperCase()
                            )}
                        </div>
                        <div>
                            <p className="owner-name">{property.owner?.name}</p>
                            <p className="owner-contact">{property.owner?.phone || "No contact info"}</p>
                            <p className="owner-email">{property.owner?.email}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                        <button
                            className="btn btn-primary apply-btn"
                            onClick={handleApply}
                            disabled={status !== 'Vacant'}
                            style={{ flex: 1 }}
                        >
                            {status === 'Vacant' ? 'Apply Now' : 'Not Available'}
                        </button>

                        <Link to="/tenant" className="btn btn-outline back-btn" style={{ flex: 1, textAlign: "center" }}>
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
