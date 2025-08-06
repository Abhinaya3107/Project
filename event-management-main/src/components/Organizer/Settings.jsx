// import React, { useState } from "react";
// import axios from "axios"; // ✅ Import axios
// import OrgNavbar from "./OrgNavBar";
// import Sidebar from "./Sidebar";

// const Settings = () => {
//   const organizerId = localStorage.getItem("organizerId"); // ✅ Fix missing ID

//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("danger");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.newPassword !== formData.confirmPassword) {
//       setMessage("New passwords do not match!");
//       setMessageType("danger");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `http://localhost:8080/organizers/${organizerId}/change-password`,
//         {
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword,
//         }
//       );

//       setMessage(response.data);
//       setMessageType("success");
//     } catch (error) {
//   if (error.response && error.response.data) {
//     const errData = error.response.data;
//     const errorMsg = errData.message || "Something went wrong.";
//     setMessage(errorMsg);  // ✅ Set only the message string
//   } else {
//     setMessage("An error occurred while changing the password.");
//   }
//   setMessageType("danger");
// }
//   };

//   return (
//     <>
//       <OrgNavbar />
//       <div className="d-flex">
//         <Sidebar />
//         <div className="w-100 p-3">
//           <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
//             <h4 className="h5">Update Password</h4>
//           </div>

//           <form onSubmit={handleSubmit} className="p-4 w-75 mx-auto text-start">
//             <div className="mb-3">
//               <label className="form-label">Current Password</label>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 className="form-control"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">New Password</label>
//               <input
//                 type="password"
//                 name="newPassword"
//                 className="form-control"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Confirm New Password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 className="form-control"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button type="submit" className="btn btn-success w-100">
//               Change Password
//             </button>

//             {message && (
//                <p className={`mt-3 text-${messageType}`}>{message}</p>
//             )}
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Settings;
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";

const OrganizerSettings = () => {
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

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setMessage("All fields are required!");
      setMessageType("danger");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New password and confirm password do not match!");
      setMessageType("danger");
      return;
    }

    if (formData.newPassword.length < 6 || formData.newPassword.length > 8) {
      setMessage("Password must be between 6 and 8 characters.");
      setMessageType("danger");
      return;
    }

    // Retrieve organizer from localStorage
    const organizerData = localStorage.getItem("organizer");
    if (!organizerData) {
      setMessage("Organizer not found in localStorage.");
      setMessageType("danger");
      return;
    }

    const organizer = JSON.parse(organizerData);
    const organizerId = organizer?.id;

    if (!organizerId) {
      setMessage("Organizer ID missing.");
      setMessageType("danger");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/organizers/${organizerId}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const result = await response.text();

      if (response.ok) {
        setMessage(result || "Password updated successfully!");
        setMessageType("success");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(result || "Failed to update password.");
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Password update failed", error);
      setMessage("Server error. Please try again later.");
      setMessageType("danger");
    }
  };

  return (
    <>
      <OrgNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-4">
          <div className="card shadow-lg p-4 w-75 mx-auto">
            <h3 className="text-center mb-3">Change Organizer Password</h3>

            {message && (
              <p className={`text-center text-${messageType}`}>{message}</p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizerSettings;
