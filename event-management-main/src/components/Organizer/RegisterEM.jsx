import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

const OrganizerSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    organizationName: "",
    category: "Wedding", // default value
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Simple validation
    for (let key in formData) {
      if (!formData[key]) {
        alert("Please fill in all fields.");
        return;
      }
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/organizers/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(`Organizer registered successfully! ID: ${data.id}`);
        navigate("/organizer-signin");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Organizer Sign Up</h2>
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
          placeholder="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, "");
            setFormData({
              ...formData,
              mobileNumber: onlyNumbers.slice(0, 10),
            });
          }}
          required
        />
        <textarea
          className="form-control mb-3"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Organization Name"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          required
        />

        {/* Category dropdown restricted to Photography or Caterer */}
        <select
          className="form-control mb-3"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="Wedding">Wedding</option>
          <option value="Party">Party</option>
          <option value="Corporate">Corporate</option>
        </select>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          maxLength="12"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-success w-100 mt-3 mb-4">Sign Up</button>
        <Link to="/organizer-signin" className="d-flex justify-content-center">
          Already have an account? Sign In
        </Link>
      </form>
    </div>
  );
};

export default OrganizerSignUp;
