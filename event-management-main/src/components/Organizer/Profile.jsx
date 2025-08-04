import Sidebar from "./Sidebar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import OrgNavbar from "./OrgNavbar";
import defaultProfileImg from "../../assets/profile.png";

const Profile = () => {
  const [formData, setFormData] = useState({
  profileImage: null,
  previewImage: defaultProfileImg,// ✅ fixed
  firstName: "",
  lastName: "",
  mobileNumber: "",
  email: "",
  address: "",
  organizationName: ""
});

  const organizerId = localStorage.getItem("organizerId"); //  Organizer ID from login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/organizers/profile/${organizerId}`);
         if (response.ok) {
                  const data = await response.json();
                  setFormData({
  profileImage: data.profileImage || null,
  previewImage: data.profileImage
    ? `data:image/jpeg;base64,${data.profileImage}`
    : defaultProfileImg,
  firstName: data.firstName || "",
  lastName: data.lastName || "",
  mobileNumber: data.mobileNumber || "",
  email: data.email || "",
  address: data.address || "",
  organizationName: data.organizationName || ""
});

                } else {
                  console.error("Failed to fetch organizer profile.");
                }
              } catch (err) {
                console.error("Error fetching organizer profile:", err);
              }
            };
        
            if (organizerId) {
              fetchProfile();
            }
          }, [organizerId]);
      

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData((prev) => ({
      ...prev,
      profileImage: file, // actual file to send to backend
      previewImage: URL.createObjectURL(file) // used for preview
    }));
  }
};

  // ✅ Submit updated profile
 const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedForm = new FormData();
  updatedForm.append("firstName", formData.firstName);
  updatedForm.append("lastName", formData.lastName);
  updatedForm.append("mobile", formData.mobileNumber);
  updatedForm.append("address", formData.address);
  updatedForm.append("organizationName", formData.organizationName);

  // Only append image if user selected a new file
  if (formData.profileImage instanceof File) {
    updatedForm.append("profileImage", formData.profileImage);
  }

  try {
    const response = await fetch(`http://localhost:8080/api/organizers/profile/${organizerId}`, {
      method: "PUT",
      body: updatedForm, // no headers for FormData
    });

    const message = await response.text();
    if (response.ok) {
      alert("Profile updated successfully!");
    } else {
      alert(`Update failed: ${message}`);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Server error while updating profile.");
  }
};

  return (
    <>
      <OrgNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="content w-100 p-3">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Organizer Profile</h4>
          </div>

          <div className="row px-4">
            <div className="col-md-4 d-flex flex-column align-items-center">
            <img src={formData.previewImage} className="rounded-circle mb-3" width="150" alt="Profile" />
              <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
            </div>

            <div className="col-md-8">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} disabled />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" name="mobileNumber" className="form-control" value={formData.mobileNumber} onChange={handleChange} maxLength="10" required />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Organization Name</label>
                    <input type="text" name="businessName" className="form-control" value={formData.organizationName} onChange={handleChange} required />
                  </div>

          
                </div>
                <button type="submit" className="btn btn-success w-100">Update Profile</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
