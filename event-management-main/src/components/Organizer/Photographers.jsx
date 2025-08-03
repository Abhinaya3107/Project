// import React, { useState } from "react";
// import OrgNavbar from "./OrgNavBar";
// import Sidebar from "./Sidebar";
// import "bootstrap/dist/css/bootstrap.min.css";

// import UpdatePhotographerModal from "./UpdatePhotographerModal";

// import AddVendorModal from "../AddVendorModal";

// const Photographers = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedPhotographer, setSelectedPhotographer] = useState(null);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showAvailableOnly, setShowAvailableOnly] = useState(false);
//   const [showCollaborateModal, setShowCollaborateModal] = useState(false); // ✅ State for AskToCollaborate modal
//   const [selectedCollaborator, setSelectedCollaborator] = useState(null); // ✅ Store selected collaborator

//   // Sample photographers data
//   const photographers = [
//     { id: 1, name: "John Doe", contact: "9876543210", sts: "available" },
//     { id: 2, name: "Jane Smith", contact: "8765432109", sts: "booked" },
//     { id: 3, name: "Alice Brown", contact: "7654321098", sts: "available" },
//   ];

//   const filteredPhotographers = photographers.filter(
//     (photographer) =>
//       photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       photographer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Apply "Available Only" Filter
//   const displayedPhotographers = showAvailableOnly
//     ? filteredPhotographers.filter(
//         (photographer) => photographer.sts === "available"
//       )
//     : filteredPhotographers;

//   return (
//     <>
//       <OrgNavbar />
//       <div className="d-flex">
//         <Sidebar />
//         <div className="content w-100 p-3">
//           <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
//             <h4 className="h5">Photographers</h4>
//             <div className="d-flex gap-2">
//               <input
//                 type="text"
//                 className="form-control me-2"
//                 placeholder="Search photographers..."
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button
//                 className={`btn btn-${
//                   showAvailableOnly ? "secondary" : "info"
//                 } btn-sm`}
//                 onClick={() => setShowAvailableOnly(!showAvailableOnly)}
//               >
//                 {showAvailableOnly ? "All" : "Available"}
//               </button>

//             </div>
//           </div>

//           <table className="table table-hover table-bordered">
//             <thead className="table-secondary text-center">
//               <tr>
//                 <th>Sr. No</th>
//                 <th>Name</th>
//                 <th>Contact</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {displayedPhotographers.map((photographer, index) => (
//                 <tr key={photographer.id}>
//                   <td>{index + 1}</td>
//                   <td>{photographer.name}</td>
//                   <td>{photographer.contact}</td>
//                   <td>
//                     <span
//                       className={`badge bg-${
//                         photographer.sts === "available" ? "success" : "danger"
//                       }`}
//                     >
//                       {photographer.sts}
//                     </span>
//                   </td>
//                   <td>

//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => alert("Delete function pending")}
//                     >
//                       <i className="bi bi-trash-fill"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </>
//   );
// };

// export default Photographers;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";
import AddVendorModal from "../AddVendorModal";
import UpdatePhotographerModal from "./UpdatePhotographerModal";
import "bootstrap/dist/css/bootstrap.min.css";

const Photographers = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch photographers from backend
  const fetchPhotographers = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/vendors/category/Photography")
      .then((res) => {
        setPhotographers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  // Delete photographer handler
  const handleDelete = async (photographerId) => {
    if (!window.confirm("Are you sure you want to delete this photographer?"))
      return;

    try {
      await axios.delete(`http://localhost:8080/api/vendors/${photographerId}`);
      setPhotographers((prev) =>
        prev.filter((photographer) => photographer.vid !== photographerId)
      );
    } catch (error) {
      alert("Failed to delete photographer. Please try again.");
    }
  };

  // Filter based on search term
  const filteredPhotographers = photographers.filter(
    (photographer) =>
      photographer.businessName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      photographer.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply "Available Only" filter (active = available)
  const displayedPhotographers = showAvailableOnly
    ? filteredPhotographers.filter(
        (photographer) => photographer.status === "active"
      )
    : filteredPhotographers;

  return (
    <>
      <OrgNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="content w-100 p-3">
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Photographers</h4>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search photographers..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className={`btn btn-${
                  showAvailableOnly ? "secondary" : "info"
                } btn-sm`}
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              >
                {showAvailableOnly ? "All" : "Active"}
              </button>
              <AddVendorModal
                show={showModal}
                onHide={() => setShowModal(false)}
                category="Photographer"
              />
            </div>
          </div>

          {loading ? (
            <div>Loading photographers...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <table className="table table-hover table-bordered">
              <thead className="table-secondary text-center">
                <tr>
                  <th>Sr. No</th>
                  <th>Name</th>
                  <th>Business</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {displayedPhotographers.map((photographer, index) => (
                  <tr key={photographer.vid}>
                    <td>{index + 1}</td>
                    <td>{`${photographer.firstName} ${photographer.lastName}`}</td>
                    <td>{photographer.businessName}</td>
                    <td>{photographer.mobile}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          photographer.status === "active"
                            ? "success"
                            : "danger"
                        }`}
                      >
                        {photographer.status}
                      </span>
                    </td>
                    <td>
                      {/* Uncomment for edit functionality
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => {
                          setSelectedPhotographer(photographer);
                          setShowUpdateModal(true);
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(photographer.vid)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Components */}
        <UpdatePhotographerModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          photographer={selectedPhotographer}
        />
      </div>
    </>
  );
};

export default Photographers;
