import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNav from "./UserNav";
import profleImg from "../../assets/profile.png";
import QuickActionDashboard from "./QuickActionDashboard";

const organizers = [
  { id: 1, name: "John Doe", category: "Wedding", img: profleImg },
  { id: 2, name: "Jane Smith", category: "Corporate", img: profleImg },
  { id: 3, name: "Mike Johnson", category: "Party", img: profleImg },
];

const UserHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const filteredOrganizers = organizers.filter((org) =>
    (org.name.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === "") &&
    (category === "All" || org.category === category)
  );

  return (
    <>
      <UserNav />

      {/* Hero Section */}
      <div className="bg-primary text-white text-center py-5">
        <h1>Find Event Organizers Near You</h1>
        <p className="lead">
          Search for the best event planners to make your event memorable!
        </p>
        <div className="d-flex justify-content-center mt-4">
          <input
            type="text"
            className="form-control w-50 me-2"
            placeholder="Search event organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-warning">Search</button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container text-center mt-5">
        <h2 className="mb-4">Event Organizers</h2>
        <div className="d-flex justify-content-center gap-3 mb-4">
          {["All", "Wedding", "Corporate", "Party"].map((cat) => (
            <button
              key={cat}
              className={`btn ${category === cat ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Organizer Cards */}
        <div className="row">
          {filteredOrganizers.map((org) => (
            <div key={org.id} className="col-md-4 mb-4">
              <div className="card text-center p-3 shadow">
                <img
                  src={org.img}
                  alt="Profile"
                  className="mx-auto d-block rounded-circle mb-3"
                  width="80"
                />
                <h5>{org.name}</h5>
                <p className="text-muted">{org.category}</p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-outline-primary">View</button>
                  <button className="btn btn-success">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Section */}
      <div className="container mt-5">
        <QuickActionDashboard />
      </div>
    </>
  );
};

export default UserHome;
