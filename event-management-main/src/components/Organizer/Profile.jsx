import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import profileImg from "../Organizer/img/profile.png";

const Profile = () => {
  const [formData, setFormData] = useState({
    em_firstname: "",
    em_lastname: "",
    em_email: "",
    em_mobile: "",
    em_profileimg: profileImg,
    em_address: "",
    org_name: "",
  });

  const [loading, setLoading] = useState(true);
  const organizerId = localStorage.getItem("organizerId"); // ✅ Organizer ID from login

  //   // ✅ Fetch profile data from backend

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          //`http://localhost:8080/api/organizers/${organizerId}`
          `http://localhost:8080/api/organizers/${organizerId}/profile`
        );
        const data = response.data;

        setFormData({
          em_firstname: data.firstName,
          em_lastname: data.lastName,
          em_email: data.email,
          em_mobile: data.mobileNumber,
          em_profileimg: data.profileImage
            ? `data:image/jpeg;base64,${data.profileImage}`
            : profileImg,
          em_address: data.address,
          org_name: data.organizationName,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile data!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [organizerId]);

  //   useEffect(() => {
  //     const fetchProfile = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:8080/api/organizers/${organizerId}`
  //         );
  //         const data = response.data;

  //         setFormData({
  //           em_firstname: data.firstName,
  //           em_lastname: data.lastName,
  //           em_email: data.email,
  //           em_mobile: data.mobileNumber,
  //           em_profileimg: data.profileImage
  //             ? `data:image/jpeg;base64,${data.profileImage}`
  //             : profileImg,
  //           em_address: data.address,
  //           org_name: data.organizationName
  //         });
  //       } catch (error) {
  //         console.error("Error fetching profile:", error);
  //         alert("Failed to load profile data!");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchProfile();
  //   }, [organizerId]);

  //   // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle image upload (instant preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, em_profileimg: file });
    }
  };

  // ✅ Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.em_firstname);
      formDataToSend.append("lastName", formData.em_lastname);
      formDataToSend.append("mobileNumber", formData.em_mobile);
      formDataToSend.append("address", formData.em_address);
      formDataToSend.append("organizationName", formData.org_name);

      if (formData.em_profileimg instanceof File) {
        formDataToSend.append("profileImage", formData.em_profileimg);
      }

      await axios.put(
        `http://localhost:8080/api/organizers/${organizerId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <>
      <OrgNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="content w-100 p-3">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Profile</h4>
          </div>

          <div className="row px-4">
            {/* Profile Image Section */}
            <div className="col-md-4 d-flex flex-column align-items-center">
              <img
                src={
                  formData.em_profileimg instanceof File
                    ? URL.createObjectURL(formData.em_profileimg)
                    : formData.em_profileimg
                }
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

            {/* User Info Section */}
            <div className="col-md-8">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* First Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="em_firstname"
                      className="form-control"
                      value={formData.em_firstname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="em_lastname"
                      className="form-control"
                      value={formData.em_lastname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email (Non-editable) */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="em_email"
                      className="form-control"
                      value={formData.em_email}
                      disabled
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      name="em_mobile"
                      className="form-control"
                      value={formData.em_mobile}
                      onChange={handleChange}
                      maxLength="10"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      name="em_address"
                      className="form-control"
                      value={formData.em_address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* Organization Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      name="org_name"
                      className="form-control"
                      value={formData.org_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Update Button */}
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

export default Profile;
