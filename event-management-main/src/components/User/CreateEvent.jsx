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
    organizerId: "",
    venue: "",
  });

  const [organizers, setOrganizers] = useState([]);
  const [venues, setVenues] = useState([]);

  // Fetch organizers and venues on mount
  useEffect(() => {
    // Fetch organizers
    fetch("http://localhost:8080/api/organizers")
      .then((res) => res.json())
      .then((data) => {
        setOrganizers(data);
      })
      .catch((err) => console.error("Error fetching organizers:", err));

    // Fetch venues
    fetch("http://localhost:8080/api/venues")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
      })
      .catch((err) => console.error("Error fetching venues:", err));
  }, []);

  // Handle field updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
      budget: parseInt(formData.budget),
      organizer: {
        id: parseInt(formData.organizerId),
      },
    };
    delete payload.organizerId;

    try {
      const response = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Event created successfully");
      } else {
        alert("Failed to create event");
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  return (
    <>
      <UserNav />
      <div className="container w-75 mt-4">
        <h6 className="text-start mb-2">Create New Event</h6>
        <hr />
        <div className="p-2">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Event Name */}
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

              {/* Date & Time */}
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

              {/* Organizer Dropdown */}
              {/* Organizer Dropdown */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Organizer</label>
                <select
                  className="form-select"
                  name="organizerId"
                  value={formData.organizerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Organizer</option>
                  {organizers.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.organizationName} {/* match field from backend */}
                    </option>
                  ))}
                </select>
              </div>

              {/* Venue Dropdown */}
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
                  {venues.map((v, idx) => (
                    <option key={idx} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Capacity */}
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

              {/* Budget */}
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

              {/* Description */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Describe Your Event</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100">
              Create Event
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
