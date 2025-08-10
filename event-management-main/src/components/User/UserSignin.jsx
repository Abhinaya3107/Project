import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

const UserSignin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.message === "Login successful!") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userId", result.user.id); // ✅ Set userId directly
        localStorage.setItem("userEmail", result.user.email);

        navigate("/index");
      } else {
        alert(result.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Signin error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Sign In</h2>
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
        <Link to="/Uforgot-password" className="d-block mb-2">
          Forgot Password?
        </Link>
        <button className="btn btn-primary w-100 mt-2 mb-4">Sign In</button>
        <Link to="/user-signup" className="d-flex justify-content-center">
          Don't have an account? Sign Up
        </Link>
      </form>
    </div>
  );
};

export default UserSignin;