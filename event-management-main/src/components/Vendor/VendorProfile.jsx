import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import VendorNav from "./VendorNav";
import VendorSidebar from "./VendorSidebar";
import defaultProfileImg from "../../assets/profile.png";

const VendorProfile = () => {
  const [formData, setFormData] = useState({
    profileImage: null,          // raw file or backend filename
    previewImage: defaultProfileImg, // image URL or default
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    address: "",
    businessName: "",
    createdAt: ""
  });

  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/vendors/profile/${vendorId}`);
        if (response.ok) {
          const data = await response.json();

          setFormData({
            profileImage: data.profileImage || null,
            previewImage: data.profileImage
              ? `http://localhost:8080/uploads/${data.profileImage}`
              : defaultProfileImg,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            mobile: data.mobile || "",
            email: data.email || "",
            address: data.address || "",
            businessName: data.businessName || "",
            createdAt: data.createdAt || ""
          });
        } else {
          console.error("Failed to fetch vendor profile.");
        }
      } catch (err) {
        console.error("Error fetching vendor profile:", err);
      }
    };

    if (vendorId) {
      fetchVendorProfile();
    }
  }, [vendorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file, // actual file for backend
        previewImage: URL.createObjectURL(file) // preview in UI
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = new FormData();
    updatedForm.append("firstName", formData.firstName);
    updatedForm.append("lastName", formData.lastName);
    updatedForm.append("mobile", formData.mobile);
    updatedForm.append("address", formData.address);
    updatedForm.append("businessName", formData.businessName);

    if (formData.profileImage instanceof File) {
      updatedForm.append("profileImage", formData.profileImage);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/vendors/profile/${vendorId}`, {
        method: "PUT",
        body: updatedForm
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
      <VendorNav />
      <div className="d-flex">
        <VendorSidebar />
        <div className="content w-100 p-3">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Vendor Profile</h4>
          </div>

          <div className="row px-4">
            <div className="col-md-4 d-flex flex-column align-items-center">
              <img
                src={formData.previewImage}
                className="rounded-circle mb-3"
                width="150"
                height="150"
                alt="Profile"
              />
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            <div className="col-md-8">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      disabled
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      className="form-control"
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength="10"
                      required
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      className="form-control"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Registration</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.createdAt}
                      disabled
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success w-100">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorProfile;
