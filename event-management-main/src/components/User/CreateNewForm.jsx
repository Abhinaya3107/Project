// src/components/CreateEventForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateEventForm = () => {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    organizer: "",
    dateTime: "",
    venueId: "",
    capacity: "",
    budget: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/venues")
      .then((response) => {
        setVenues(response.data);
      })
      .catch((error) => {
        console.error("Error fetching venues:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example user ID (you may get this from context, auth, etc.)
    const userId = 1;

    const eventPayload = {
      eventName: formData.eventName,
      venue: { id: formData.venueId }, // link venue by ID
      dateTime: formData.dateTime,
      capacity: formData.capacity,
      budget: formData.budget,
      description: formData.description,
      user: { id: userId },
    };

    axios
      .post(`http://localhost:8080/api/events?userId=${userId}`, eventPayload)
      .then((res) => {
        alert("Event created successfully!");
        setFormData({});
      })
      .catch((err) => {
        console.error("Event creation failed:", err);
      });
  };

  return (
    <div className="container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Organizer:</label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Venue:</label>
          <select
            name="venueId"
            value={formData.venueId || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={formData.budget || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventForm;
