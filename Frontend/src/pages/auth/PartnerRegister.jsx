import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/App.css";
import axios from "axios";

function PartnerRegister() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    contactName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      name: formData.restaurantName,
      contactName: formData.contactName,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      password: formData.password,
    };

    axios
      .post("http://localhost:3000/api/auth/food-partner/register", payload, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/partner-login");
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  };

  return (
    <div className="form-container">
      <div className="form-title">Food Partner Registration</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Restaurant Name</label>
          <input
            className="form-input"
            type="text"
            name="restaurantName"
            placeholder="Enter restaurant name"
            value={formData.restaurantName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Name</label>
          <input
            className="form-input"
            type="text"
            name="contactName"
            placeholder="Enter contact name"
            value={formData.contactName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            className="form-input"
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            className="form-input"
            type="text"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="form-btn" type="submit">
          Register
        </button>

        <Link className="form-link" to="/food-partner/login">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default PartnerRegister;
