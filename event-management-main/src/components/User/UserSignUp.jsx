import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";



const UserSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 🔴 For inline errors
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error

    // Basic client-side validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
  const response = await fetch("http://localhost:8080/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    navigate("/user-signin");
  } else if (response.status === 400) {
    const errorData = await response.json();
    // Assume it's a field-level validation error (like Spring Boot's @Valid)
    const fieldErrors = {};
    if (Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err) => {
        fieldErrors[err.field] = err.defaultMessage;
      });
    } else if (errorData.field && errorData.defaultMessage) {
      fieldErrors[errorData.field] = errorData.defaultMessage;
    }
    setErrors(fieldErrors);
  } else {
    setErrorMessage("Unexpected error occurred.");
  }
} catch (error) {
  console.error("Signup error:", error);
  setErrorMessage("Server error. Please try again later.");
}
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Sign Up</h2>
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
          className={`form-control mb-1 ${errors.mobile ? "is-invalid" : ""}`}
          placeholder="Mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
        {errors.mobile && (
          <div className="text-danger mb-2" style={{ fontSize: "0.9rem" }}>
            {errors.mobile}
          </div>
        )}

        <div className="input-group mb-3">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>

        {/* 🔴 Inline error message display */}
        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}

        <button className="btn btn-primary w-100 mt-3 mb-4">Sign Up</button>
        <Link to="/user-signin" className="d-flex justify-content-center">
          Already have an account? Sign In
        </Link>
      </form>
    </div>
  );
};

export default UserSignUp;
