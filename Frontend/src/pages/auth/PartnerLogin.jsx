import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/App.css";
import axios from "axios";

function PartnerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/api/auth/food-partner/login", formData, {
        withCredentials: true, // cookies/session ke liye
      })
      .then((res) => {
        console.log("Login success:", res.data);
        navigate("/create-Food"); // login ke baad homepage ya dashboard pe redirect
      })
      .catch((err) => {
        console.error("Login error:", err.response?.data || err.message);
      });
  };

  return (
    <div className="form-container">
      <div className="form-title">Food Partner Login</div>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>

        {/* Submit button */}
        <button className="form-btn" type="submit">
          Login
        </button>

        <Link className="form-link" to="/food-partner/register">
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
}

export default PartnerLogin;
