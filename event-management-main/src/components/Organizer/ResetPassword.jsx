import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/organizers/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        localStorage.removeItem("resetEmail");
        navigate("/login");
      } else {
        alert(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Reset Password</h2>
      <form className="w-25 mx-auto" onSubmit={handleReset}>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="btn btn-success w-100">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
