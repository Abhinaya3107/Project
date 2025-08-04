import React, { useState, useEffect } from "react";
import axios from "axios";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";
//import AddVenue from "./AddVenueModal";
import UpdateVenueModal from "./UpdateVenueOwnerModal";
import "bootstrap/dist/css/bootstrap.min.css";

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch venues from backend
  const fetchVenues = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/vendors/category/Venue")
      .then((res) => {
        setVenues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // Delete venue handler
  const handleDelete = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/vendors/${venueId}`);
      setVenues((prev) => prev.filter((venue) => venue.vid !== venueId));
    } catch (error) {
      alert("Failed to delete venue. Please try again.");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchVenues();
      } else {
        axios
          .get(
            `http://localhost:8080/api/vendors/search?category=Venue&term=${searchTerm}`
          )
          .then((res) => setVenues(res.data))
          .catch((err) => {
            console.error("Search failed", err);
            setError("Search failed");
          });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const displayedVenues = showAvailableOnly
    ? venues.filter((venue) => venue.status === "active")
    : venues;

  return (
    <>
      <OrgNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="content w-100 p-3">
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Venues</h4>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search venues..."
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
              {/* <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
                Add Venue
              </button>
              <AddVenue show={showModal} onHide={() => setShowModal(false)} /> */}
            </div>
          </div>

          {loading ? (
            <div>Loading venues...</div>
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
                {displayedVenues.map((venue, index) => (
                  <tr key={venue.vid}>
                    <td>{index + 1}</td>
                    <td>{venue.firstName}</td>
                    <td>{venue.lastName}</td>
                    <td>{venue.businessName}</td>
                    <td>{venue.mobile}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          venue.status === "active" ? "success" : "danger"
                        }`}
                      >
                        {venue.status}
                      </span>
                    </td>
                    <td>
                      {/* Uncomment to enable update */}
                      {/* <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => {
                          setSelectedVenue(venue);
                          setShowUpdateModal(true);
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button> */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(venue.vid)}
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

        <UpdateVenueModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          venue={selectedVenue}
        />
      </div>
    </>
  );
};

export default Venues;
