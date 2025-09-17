import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/variables.css';
import '../styles/forms.css';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: formData.email,
          fullname: {
            firstname: formData.firstname,
            lastname: formData.lastname
          },
          password: formData.password
        },
        { withCredentials: true }
      );

      console.log("Registration response:", res.data);

      if (res.data.message === "User registered successfully") {
  navigate("/");
} else {
  alert(res.data.message || "Registration failed");
}

    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname" className="form-label">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              className="form-input"
              placeholder="Enter your first name"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              className="form-input"
              placeholder="Enter your last name"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Create Account
          </button>
        </form>
        <Link to="/login" className="auth-link">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
