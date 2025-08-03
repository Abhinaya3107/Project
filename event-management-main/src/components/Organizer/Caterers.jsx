import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";
import AddCateors from "./AddCateors";
import UpdateCatererModal from "./UpdateCatererModal";
import "bootstrap/dist/css/bootstrap.min.css";

const Caterers = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCaterer, setSelectedCaterer] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch caterers from backend
  const fetchCaterers = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/vendors/category/Caterer")
      .then((res) => {
        setCaterers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCaterers();
  }, []);

  // Delete caterer handler
  const handleDelete = async (catererId) => {
    if (!window.confirm("Are you sure you want to delete this caterer?"))
      return;

    try {
      await axios.delete(`http://localhost:8080/api/vendors/${catererId}`);
      setCaterers((prev) =>
        prev.filter((caterer) => caterer.vid !== catererId)
      );
    } catch (error) {
      alert("Failed to delete caterer. Please try again.");
    }
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchCaterers(); // fetch all
      } else {
        axios
          .get(
            `http://localhost:8080/api/vendors/search?category=Caterer&term=${searchTerm}`
          )
          .then((res) => setCaterers(res.data))
          .catch((err) => {
            console.error("Search failed", err);
            setError("Search failed");
          });
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounce); // cleanup on each keystroke
  }, [searchTerm]);

  const displayedCaterers = showAvailableOnly
    ? caterers.filter((caterer) => caterer.status === "active")
    : caterers;

  return (
    <>
      <OrgNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="content w-100 p-3">
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Caterers</h4>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search caterers..."
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
              <AddCateors show={showModal} onHide={() => setShowModal(false)} />
            </div>
          </div>

          {loading ? (
            <div>Loading caterers...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <table className="table table-hover table-bordered">
              <thead className="table-secondary text-center">
                <tr>
                  <th>Sr. No</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Business</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {displayedCaterers.map((caterer, index) => (
                  <tr key={caterer.vid}>
                    <td>{index + 1}</td>
                    <td>{`${caterer.firstName}`}</td>
                    <td>{`${caterer.lastName}`}</td>
                    <td>{caterer.businessName}</td>
                    <td>{caterer.mobile}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          caterer.status === "active" ? "success" : "danger"
                        }`}
                      >
                        {caterer.status}
                      </span>
                    </td>
                    <td>
                      {/* Uncomment for edit functionality
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => {
                          setSelectedCaterer(caterer);
                          setShowUpdateModal(true);
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(caterer.vid)}
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
        <UpdateCatererModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          caterer={selectedCaterer}
        />
      </div>
    </>
  );
};

export default Caterers;
