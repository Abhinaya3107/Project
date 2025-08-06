import React from "react";
import { useState } from "react";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";
const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match!");
      setMessageType("danger");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/organizers/${id}/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      setMessage(response.data); // "Password updated successfully"
      setMessageType("success");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data); // "Current password is incorrect", etc.
      } else {
        setMessage("An error occurred while changing the password.");
      }
      setMessageType("danger");
    }
  };

  return (
    <>
      <OrgNavbar /> {/* Always Visible */}
      <div className="d-flex ">
        <Sidebar /> {/* Always Visible */}
        <div className=" w-100  p-3">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Update Password</h4>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group w-100 me-2"></div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4  w-75 mx-auto  text-start"
          >
            {/* Current Password */}
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm New Password */}
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-success w-100">
              Change Password
            </button>

            {/* Message Display */}
            {message && <p className="mt-3 text-danger">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
