import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
   const navigate=useNavigate()
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

    // Combine firstName + lastName into fullName for backend
    const payload = {
      fullName: formData.firstName + " " + formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    axios
      .post("http://localhost:3000/api/auth/user/register", payload,{
        withCredentials:true
      })
      .then((res) => {
        console.log(res.data);
        navigate("/user/login")
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  };

  return (
    <div className="form-container">
      <div className="form-title">User Registration</div>
      <form onSubmit={handleSubmit}>
        {/* First + Last Name side by side */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              className="form-input"
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Enter your email"
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
            autoComplete="new-password"
          />
        </div>

        {/* Submit button */}
        <button className="form-btn" type="submit">
          Register
        </button>

        <Link className="form-link" to="/user/login">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default UserRegister;
