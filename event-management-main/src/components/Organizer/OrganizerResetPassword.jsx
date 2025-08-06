import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrganizerResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      toast.warn("Session expired. Please start again.");
      navigate("/organizer/forgot-password");
    }
  }, [email, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 64) {
      toast.warn("Password must be between 8 to 64 characters.");
      return;
    }

    try {
      // ✅ Check if email exists before resetting
      const emailCheckResponse = await fetch("http://localhost:8080/api/organizers/forgot-password/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const emailCheckResult = await emailCheckResponse.json();
      if (!emailCheckResponse.ok || !emailCheckResult.exists) {
        toast.error("You are not registered.");
        return;
      }

      // ✅ Proceed with password reset
      const response = await fetch("http://localhost:8080/api/organizers/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Password reset successful.");
        localStorage.removeItem("resetEmail");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/organizer-signin"), 2000);
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Server error. Try again later.");
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
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default OrganizerResetPassword;