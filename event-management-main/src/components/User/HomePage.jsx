import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import profileImage from "../../assets/profile.png";

import weddingImage from "../../assets/wedding.jpg";
import corporateImage from "../../assets/corporate.jpg";
import socialEventImage from "../../assets/socialevent.jpg";
import birthdayPartyImage from "../../assets/birthday.jpg";

import UserNav from "./UserNav";
import QuickActionDashboard from "./QuickActionDashboard";

const categories = ["All", "Wedding", "Corporate", "Party"];

const eventThemes = [
  { name: "Royal Wedding", image: weddingImage },
  { name: "Corporate Gala", image: corporateImage },
  { name: "Social Event", image: socialEventImage },
  { name: "Birthday Party", image: birthdayPartyImage },
];

const UserHome = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        setLoading(true);
        const endpoint =
          selectedCategory === "All"
            ? "http://localhost:8080/api/organizers"
            : `http://localhost:8080/api/organizers/category/${selectedCategory.toLowerCase()}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch organizers");

        const data = await response.json();
        setOrganizers(data);
      } catch (error) {
        console.error("Error fetching organizers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, [selectedCategory]);

  return (
    <>
      <UserNav />

      {/* Hero Section */}
      <div className="bg-primary text-white text-center py-5">
        <h1>Find Event Organizers Near You</h1>
        <p className="lead">
          Search for the best event planners to make your event memorable!
        </p>
      </div>

      {/* Category Filter */}
      <div className="container text-center mt-5">
        <h2 className="mb-4">Event Organizers</h2>
        <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Organizer Cards */}
        {loading ? (
          <p>Loading organizers...</p>
        ) : organizers.length === 0 ? (
          <p className="text-muted">No organizers found for this category.</p>
        ) : (
          <div className="row">
        {organizers.map((organizer) => (
          <div key={organizer.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-lg text-center">
              <div className="d-flex flex-column align-items-center p-3">
                <img
                  src={profileImage}
                  className="rounded-circle mb-3"
                  alt={`${organizer.firstName} ${organizer.lastName}`}
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <p><strong>Name:</strong> {organizer.firstName} {organizer.lastName}</p>
                <p><strong>Organization:</strong> {organizer.organizationName}</p>
                <p><strong>Email:</strong> {organizer.email}</p>
                <p><strong>Contact:</strong> {organizer.mobile}</p>
                <p><strong>Address:</strong> {organizer.address}</p>
                <p><strong>Category:</strong> {organizer.category}</p>
                 {/* Optional: Pass organizer ID to CreateEvent form */}
                  <Link to={`/index/create-event?organizerId=${organizer.id}`} className="btn btn-primary mt-2">
                    Book Now
                  </Link>

              </div>
            </div>
          </div>
        ))}
      </div>
        )}
      </div>

      {/* Quick Action Section */}
      <div className="container mt-5">
        <QuickActionDashboard />
      </div>
    </>
  );
};

export default UserHome;
