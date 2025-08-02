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
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobileNumber ||
      !formData.address ||
      !formData.organizationName ||
      !formData.password
    ) {
      alert("Please fill in all fields.");
      return;
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
        const data = await response.json(); // ✅ Parse JSON response
        alert(`Organizer ${data.firstName} registered successfully!`);
        navigate("/organizer-signin"); // ✅ Redirect after success
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Organizer Sign Up</h2>
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
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          maxLength="8"
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
