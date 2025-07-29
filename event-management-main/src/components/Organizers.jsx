import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import profileImage from "../assets/profile.png";

import weddingImage from "../assets/wedding.jpg";
import corporateImage from "../assets/corporate.jpg";
import socialEventImage from "../assets/socialevent.jpg";
import birthdayPartyImage from "../assets/birthday.jpg";

import { useLocation, Link } from "react-router-dom";
import UserNav from "./User/UserNav";

const categories = ["All", "Wedding", "Corporate", "Party"];

const eventThemes = [
  { name: "Royal Wedding", image: weddingImage },
  { name: "Corporate Gala", image: corporateImage },
  { name: "Social Event", image: socialEventImage },
  { name: "Birthday Party", image: birthdayPartyImage },
];

const Organizers = () => {
  const location = useLocation();
  const showNav = location.pathname === "/index/Organizers" || location.pathname === "/index/organizers";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const endpoint =
          selectedCategory === "All"
            ? "http://localhost:8080/api/organizers"
            : `http://localhost:8080/api/organizers/category/${selectedCategory}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        setOrganizers(data);
      } catch (error) {
        console.error("Error fetching organizers:", error);
      }
    };

    fetchOrganizers();
  }, [selectedCategory]);

  return (
    <>
      {showNav && <UserNav />}
      <section className="container mt-2">
        {!showNav && <h2 className="text-center mb-4">Event Organizers</h2>}

        {/* Category Selection */}
        <div className="text-center mb-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"} mx-2`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Organizer Cards */}
        <div className="row">
          {organizers.length > 0 ? (
            organizers.map((organizer) => (
              <div key={organizer.id} className="col-md-4 col-sm-6 mb-4">
                <div className="card shadow-lg text-center">
                  <div className="d-flex flex-column align-items-center p-3">
                    <img
                      src={profileImage}
                      className="rounded-circle mb-3"
                      alt={organizer.first_name}
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                    <h5 className="card-title">
                      {organizer.first_name} {organizer.last_name}
                    </h5>
                    <p className="card-text">
                      <strong>Email:</strong> {organizer.email}
                    </p>
                    <p className="card-text">
                      <strong>Contact:</strong> {organizer.mobile}
                    </p>
                    <p className="card-text">
                      <strong>Address:</strong> {organizer.address}
                    </p>
                    <p className="card-text">
                      <strong>Category:</strong> {organizer.category}
                    </p>
                    <button className="btn btn-primary mt-2">Book Now</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No organizers found.</p>
          )}
        </div>
      </section>

      {/* Event Themes Section */}
      <section className="container mt-5">
        <h2 className="text-center mb-4">Event Themes</h2>
        <div className="row justify-content-center">
          {eventThemes.map((theme) => (
            <div key={theme.name} className="col-md-3 col-sm-6 mb-4">
              <div
                className="theme-card card text-center h-100 border-0 shadow-sm"
                style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
              >
                <div
                  className="position-relative overflow-hidden"
                  style={{ borderRadius: "16px", height: "180px", background: "#f8f9fa" }}
                >
                  <img
                    src={theme.image}
                    alt={theme.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                    className="theme-img"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{theme.name}</h5>
                  <Link to={`/themes/${encodeURIComponent(theme.name)}`} className="btn btn-outline-primary mt-2">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .theme-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          border: 2px solid #0d6efd;
        }
        .theme-card:hover .theme-img {
          transform: scale(1.08) rotate(-2deg);
          filter: brightness(1.1);
        }
      `}</style>
    </>
  );
};

export default Organizers;
