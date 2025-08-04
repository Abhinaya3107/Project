import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNav from "./UserNav";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    dateTime: "",
    capacity: "",
    budget: "",
    description: "",
    venue: "",
  });

  const [venues, setVenues] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/venues");
      const data = await res.json();
      setVenues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch venues", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
      budget: parseInt(formData.budget),
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/events?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("✅ Event created successfully!");
        setFormData({
          eventName: "",
          dateTime: "",
          capacity: "",
          budget: "",
          description: "",
          venue: "",
        });
      } else {
        const errorMsg = await response.text();
        alert(`❌ Failed to create event: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("❌ Network error. Please try again.");
    }
  };

  return (
    <>
      <UserNav />
      <div className="container w-75 mt-4">
        <h4 className="mb-3">Create New Event</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Event Name</label>
              <input
                type="text"
                className="form-control"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Venue</label>
              <select
                className="form-select"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
              >
                <option value="">Select Venue</option>
                {venues.length > 0 ? (
                  venues.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading venues...</option>
                )}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-control"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Budget</label>
              <input
                type="number"
                className="form-control"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Event Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create Event
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
