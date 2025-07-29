import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNav from "./UserNav";
import profileImg from "../../assets/profile.png";

const UserProfile = () => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.email) {
      fetch(`http://localhost:8080/api/users/email/${storedUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            profile_image: profileImg,
            firstname: data.firstName,
            lastname: data.lastName,
            mobile: data.mobile,
            email: data.email,
            address: data.address,
            created_at: data.creationDate?.substring(0, 10), // format yyyy-mm-dd
          });
        })
        .catch((err) => console.error("Failed to load user data:", err));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    alert("Profile Updated Successfully!");
    // Optionally: Call PUT API to update user profile
  };

  if (!formData) return <div className="text-center mt-5">Loading profile...</div>;

  return (
    <>
      <UserNav />
      <div className="container mt-4">
        <div className="card shadow-lg p-4">
          <div className="row mt-3">
            <div className="col-md-4 d-flex flex-column align-items-center">
              <img
                src={formData.profile_image}
                className="rounded-circle mb-3"
                width="150"
                alt="Profile"
              />
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
                    <input type="email" className="form-control" value={formData.email} disabled />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" name="mobile" className="form-control" value={formData.mobile} onChange={handleChange} maxLength="10" required />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Registration</label>
                    <input type="date" className="form-control" value={formData.created_at} disabled />
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
