import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNav from "./UserNav";
import profileImg from "../../assets/profile.png"; // default profile image

const UserProfile = () => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setFormData({
      profile_image: profileImg,
      firstname: user.firstName,
      lastname: user.lastName,
      mobile: user.mobile,
      email: user.email,
      address: user.address,
      created_at: user.createdAt || "", // fallback for missing keys
    });
  } else {
    console.warn("No user found in localStorage.");
  }
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profile_image: imageUrl });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser.id;

    const payload = {
      firstName: formData.firstname,
      lastName: formData.lastname,
      mobile: formData.mobile,
      address: formData.address,
    };

    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();

      // ✅ Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(result.user));

      alert("Profile updated successfully!");
    } else {
      alert("Failed to update profile");
    }
  } catch (error) {
    console.error("Update failed:", error);
    alert("Server error while updating profile.");
  }
};


  if (!formData) {
    return (
      <>
        <UserNav />
        <div className="text-center mt-5">
          <h4>Loading profile...</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNav />
      <div className="container mt-4">
        <div className="card shadow-lg p-4">
          <div className="row mt-3">
            <div className="col-md-4 d-flex flex-column align-items-center">
              <img src={formData.profile_image} className="rounded-circle mb-3" width="150" alt="Profile" />
              <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
            </div>

            <div className="col-md-8">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" name="firstname" className="form-control" value={formData.firstname} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="lastname" className="form-control" value={formData.lastname} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} disabled />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" name="mobile" className="form-control" value={formData.mobile} onChange={handleChange} maxLength="10" required />
                  </div>


                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Registration</label>
                    <input type="date" name="created_at" className="form-control" value={formData.created_at} disabled />
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

export default UserProfile;
