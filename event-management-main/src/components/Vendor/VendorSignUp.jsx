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
    category: "",
    password: "",
    address: "",
    businessName: "",
  });

  // const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setProfileImage(e.target.files[0]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    for (let field in formData) {
      if (!formData[field]) {
        alert("Please fill in all fields.");
        return;
      }
    }

    const formPayload = new FormData();
    formPayload.append("firstName", formData.firstName);
    formPayload.append("lastName", formData.lastName);
    formPayload.append("email", formData.email);
    formPayload.append("mobile", formData.mobile);
    formPayload.append("category", formData.category);
    formPayload.append("categoryName", formData.category); // backend expects this too
    formPayload.append("password", formData.password);
    formPayload.append("address", formData.address);
    formPayload.append("businessName", formData.businessName);
    formPayload.append("status", "available"); // default value
    // if (profileImage) formPayload.append("profileImage", profileImage);

    try {
      const response = await fetch("http://localhost:8080/api/vendors/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  // ← required
      },
      body: JSON.stringify({
        ...formData,
        categoryName: formData.category, // include this if needed
        status: "available",             // include default fields manually
      }),
    });
      const message = await response.text();

      if (response.ok) {
        alert(message);
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
      <form className="w-50 mx-auto" onSubmit={handleSignUp}>
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
          placeholder="Business Name"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Address"
          name="address"
          value={formData.address}
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
