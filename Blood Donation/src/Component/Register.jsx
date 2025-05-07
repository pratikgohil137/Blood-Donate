import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { FaTint } from "react-icons/fa";
import "../Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(mobile)) newErrors.mobile = "Mobile number should be 10 digits";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data = await register({ name, email, mobile, password });
      setMessage({ type: "success", text: "Registration Successful" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-section">
          <div className="auth-header">
            <img
              src="/blood-drop-svgrepo-com.svg"
              alt="Blood Donation"
              className="auth-logo"
              style={{ width: '50px', height: '50px', marginBottom: '15px' }}
            />
            <h2>Create Account</h2>
            <p>Please fill in your details to register</p>
          </div>

          {message && (
            <div className={`${message.type}-alert`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "error-input" : ""}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "error-input" : ""}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={errors.mobile ? "error-input" : ""}
                placeholder="Enter your 10-digit mobile number"
                maxLength={10}
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "error-input" : ""}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "error-input" : ""}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="login-link">
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-content">
          <div className="auth-features">
            <div className="auth-feature-card">
              <div className="feature-icon">
                <FaTint />
              </div>
              <h3>Save Lives</h3>
              <p>Your donation can save up to three lives. Join thousands of donors and make a difference today.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
