import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/App.css";
import axios from "axios";

function UserLogin() {
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
      .post("http://localhost:3000/api/auth/user/login", formData, {
        withCredentials: true, // ✅ cookies allow hone ke liye
      })
      .then((res) => {
        console.log("Login Success:", res.data);
        navigate("/"); // ✅ successful login ke baad redirect
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  };

  return (
    <div className="form-container">
      <div className="form-title">User Login</div>
      <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
          />
        </div>

        {/* Submit button */}
        <button className="form-btn" type="submit">
          Login
        </button>

        <Link className="form-link" to="/user/register">
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
}

export default UserLogin;

// 2️⃣ name="password" क्या है और "password" क्यों लिखा है?
// <input name="password" ... />


// हर input field को पहचानने के लिए name attribute use होता है।

// जब तुम handleChange function में e.target.name लेते हो, तो वही name बताता है कि कौन सा field बदला है।

// इसलिए यहाँ name="password" दिया गया है ताकि React को पता चले कि ये password वाला field है।

// अगर तुम name="email" लिखते तो ये email field बन जाता।


// 🔹 1. Controlled Component (React control करता है)

// Input की value हमेशा React state से आती है।

// मतलब जो भी तुम box में लिखोगे, वो पहले state में जाएगा → फिर state से वापस input box में आएगा।

// 👉 Flow:

// User ने "12345" लिखा।

// onChange={handleChange} चला → state (formData.password) update हो गई "12345" से।

// क्योंकि value={formData.password} है → input box में वही "12345" दिखा।

// ⚡ फायदा: React के पास हमेशा latest value रहती है, इसलिए validation, API भेजना, clear करना सब आसान हो जाता है।