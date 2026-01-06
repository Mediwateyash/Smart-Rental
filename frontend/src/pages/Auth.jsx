
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// Helper to save token/user
const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        email: "", password: "", name: "", role: "tenant",
        phone: "", address: "", occupation: "", monthlyIncome: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const url = isLogin
                ? "/auth/login"
                : "/auth/register";

            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : formData;

            const { data } = await api.post(url, payload);
            saveAuth(data.token, data.user);

            const roleRoutes = { admin: "/admin", owner: "/owner", tenant: "/tenant" };
            navigate(roleRoutes[data.user.role] || "/");
            // window.location.reload(); // Removed to prevent 404s on Vercel
        } catch (err) {
            setError(err.response?.data?.msg || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page page-center auth-bg">
            <div className="auth-card">
                {/* Header Toggle */}
                <div className="auth-header">
                    <button
                        className={`auth-toggle ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-toggle ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                <div className="auth-body">
                    <h2 className="auth-title">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="auth-subtitle">
                        {isLogin ? "Enter your credentials to access your account." : "Join us to find or list your rental property."}
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="role-selector">
                                <label className={`role-option ${formData.role === 'tenant' ? 'selected' : ''}`}>
                                    <input type="radio" name="role" value="tenant" checked={formData.role === 'tenant'} onChange={handleChange} />
                                    <span>Tenant</span>
                                </label>
                                <label className={`role-option ${formData.role === 'owner' ? 'selected' : ''}`}>
                                    <input type="radio" name="role" value="owner" checked={formData.role === 'owner'} onChange={handleChange} />
                                    <span>Owner</span>
                                </label>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="input-group">
                                <input type="text" name="name" className="auth-input" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                            </div>
                        )}

                        <div className="input-group">
                            <input type="email" name="email" className="auth-input" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <input type="password" name="password" className="auth-input" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        </div>

                        {!isLogin && formData.role === 'tenant' && (
                            <div className="extra-fields fade-in">
                                <div className="input-row">
                                    <input type="text" name="phone" className="auth-input" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                                    <input type="text" name="occupation" className="auth-input" placeholder="Occupation" value={formData.occupation} onChange={handleChange} />
                                </div>
                                <div className="input-row">
                                    <input type="number" name="monthlyIncome" className="auth-input" placeholder="Income" value={formData.monthlyIncome} onChange={handleChange} />
                                    <input type="text" name="address" className="auth-input" placeholder="City/Address" value={formData.address} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
