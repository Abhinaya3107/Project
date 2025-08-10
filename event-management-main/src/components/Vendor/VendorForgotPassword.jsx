import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/vendors/vendor/forgot-password/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.exists) {
        localStorage.setItem("resetEmail", email);
        alert("Email found. Redirecting to reset form...");
        navigate("/vendor/reset-password"); // ✅ Correct path
      } else {
        alert("You are not registered.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Forgot Password</h2>
      <form className="w-25 mx-auto" onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
};

export default VendorForgotPassword;