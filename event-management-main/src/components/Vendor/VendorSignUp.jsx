import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

const VendorSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    category: " ",
    categoryName:" ",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile ||
      !formData.category ||
      !formData.categoryName ||
      !formData.password
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/vendors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const message = await response.text();

      if (response.ok) {
        alert(`${message}`);
        navigate("/vendor-signin");
      } else {
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Vendor Sign Up</h2>
      <form className="w-25 mx-auto" onSubmit={handleSignUp}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          className="form-control mb-3"
          placeholder="Mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <select
          className="form-control mb-3"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Caterer">Caterer</option>
          <option value="Venue">Venue</option>
          <option value="Photography">Photography</option>
        </select>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Category Name"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100 mt-3 mb-4">Sign Up</button>
        <Link to="/user-signin" className="d-flex justify-content-center">
          Already have an account? Sign In
        </Link>
      </form>
    </div>
  );
};

export default VendorSignUp;
