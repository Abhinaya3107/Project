import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

const OrganizerSignin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/organizers/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok && result.message === "Login successful!") {
        const organizer = result.organizer;

        if (organizer && organizer.id) {
          // ✅ Store relevant organizer info in localStorage
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("organizerId", organizer.id.toString());
          localStorage.setItem("organizerEmail", organizer.email);
          localStorage.setItem("organizer", JSON.stringify(organizer)); // optional: full object

          navigate("/dashboard");
        } else {
          alert("Organizer ID missing in response.");
        }
      } else {
        alert(result.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Signin error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Organizer Sign In</h2>
      <form className="w-25 mx-auto" onSubmit={handleSignin}>
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
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Link to="/forgot-password" className="d-block mb-2">
          Forgot Password?
        </Link>
        <button className="btn btn-success w-100 mt-2 mb-4">Sign In</button>
        <Link to="/register" className="d-flex justify-content-center">
          Don't have an account? Create
        </Link>
      </form>
    </div>
  );
};

export default OrganizerSignin;
