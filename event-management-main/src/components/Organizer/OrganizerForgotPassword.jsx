import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrganizerForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // ✅ Basic email format validation
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/organizers/forgot-password/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const result = await response.json();
      if (result.exists) {
        localStorage.setItem("resetEmail", trimmedEmail);
        toast.success("Email found. Proceeding to reset...");
        setTimeout(() => navigate("/organizer/reset-password"), 1500);
      } else {
        toast.error("You are not registered.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
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
          autoFocus
        />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Checking..." : "Submit"}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default OrganizerForgotPassword;