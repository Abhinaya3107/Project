import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";

const getTodayDate = () => new Date().toISOString().split("T")[0];

function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [editData, setEditData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [vendorOptions, setVendorOptions] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState({});

  const vendorTypes = ["Photography", "Caterer"];

  const fetchVendorOptions = () => {
    const fetches = vendorTypes.map((type) =>
      fetch(`http://localhost:8080/api/vendors/category-simple/${type}`)
        .then((res) => {
          console.log(`Response status for ${type}:`, res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log(`Fetched ${type} vendors:`, data);
          const formatted = data.map(vendor => ({
            id: vendor.vid,
            name: `${vendor.firstName} ${vendor.lastName}`,
            type: type
          }));
          console.log(`Formatted ${type} vendors:`, formatted);
          return { type, names: formatted };
        })
        .catch((err) => {
          console.error(`Error fetching ${type}:`, err);
          return { type, names: [] };
        })
    );

    Promise.all(fetches).then((results) => {
      const options = {};
      results.forEach(({ type, names }) => {
        options[type] = names;
      });
      console.log("Final vendor options:", options);
      setVendorOptions(options);
    });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log("Selected event:", event);

    // Initialize vendor mapping from existing event vendors
    // Since backend doesn't store vendor types, we'll map vendors by their category
    const vendorMap = {};
    if (event.vendors && Array.isArray(event.vendors)) {
      console.log("Event vendors:", event.vendors);
      event.vendors.forEach((vendor) => {
        // Map vendor by their category (Photography/Caterer)
        if (vendor.category) {
          const category = vendor.category;
          let mappedType = null;
          
          // Map database category to frontend type
          if (category === "Photography") {
            mappedType = "Photography";
          } else if (category === "Caterer") {
            mappedType = "Caterer";
          }
          
          if (mappedType) {
            vendorMap[mappedType] = vendor.vid;
            console.log(`Mapped ${mappedType} vendor:`, vendor.vid, vendor.firstName, vendor.lastName);
          }
        }
      });
    }

    console.log("Final vendor map:", vendorMap);

    setEditData({
      name: event.eventName,
      date: event.dateTime?.split("T")[0] || "",
      venue: event.venue,
      status: event.status,
      capacity: event.capacity,
      budget: event.budget,
    });

    setSelectedVendors(vendorMap);
    fetchVendorOptions();
  };

  const handleVendorSelection = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/events/upcoming-with-vendors")
      .then((res) => res.json())
      .then((data) => setEventsData(data))
      .catch((err) => console.error("Error fetching events:", err));
    
    // Test: Fetch all vendors to see what categories exist
    fetch("http://localhost:8080/api/vendors")
      .then((res) => res.json())
      .then((data) => {
        console.log("All vendors in database:", data);
        const categories = [...new Set(data.map(v => v.category))];
        console.log("Available categories:", categories);
      })
      .catch((err) => console.error("Error fetching all vendors:", err));
  }, []);

  useEffect(() => {
    const updatedEvents = eventsData
      .filter((event) => event.status === "APPROVED")
      .map((event) => {
        const eventDate = event.dateTime?.split("T")[0];
        const today = getTodayDate();
        return {
          ...event,
          computedStatus: eventDate === today ? "In Progress" : "Upcoming",
        };
      });

    let monthFilteredEvents = updatedEvents;
    if (selectedMonth) {
      monthFilteredEvents = updatedEvents.filter(
        (event) =>
          new Date(event.dateTime).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    const finalFiltered = status
      ? monthFilteredEvents.filter(
          (event) => event.computedStatus === status
        )
      : monthFilteredEvents;

    setFilteredEvents(finalFiltered);
  }, [eventsData, status, selectedMonth]);

  const handleSaveChanges = () => {
    if (!selectedEvent || !editData) return;
    setSaving(true);

    console.log("Current selectedVendors:", selectedVendors);

    // Create vendors array with proper structure - just vid values as expected by backend
    const vendorsArray = Object.values(selectedVendors)
      .filter(vid => vid && vid !== "")
      .map(vid => ({
        vid: parseInt(vid)
      }));

    console.log("Vendors array being sent:", vendorsArray);

    const updatedEvent = {
      ...selectedEvent,
      eventName: editData.name,
      dateTime: editData.date + "T00:00:00",
      venue: editData.venue,
      status: editData.status,
      capacity: editData.capacity,
      budget: editData.budget,
      vendors: vendorsArray
    };

    console.log("Sending payload:", updatedEvent);

    fetch(`http://localhost:8080/api/events/assign-vendors/${selectedEvent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save event");
        return res.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
        setEventsData((prev) =>
          prev.map((e) => (e.id === data.id ? data : e))
        );
        alert("Event updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving event.");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content w-100 p-3">
        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
          <h6>{status ? `${status} Events` : "All Events"}</h6>
          <div className="btn-toolbar mb-2 mb-md-0">
            <select
              className="form-select me-2"
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {[...Array(12)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {new Date(2025, index, 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
            <button
              className={`btn btn-sm ${
                status === "Upcoming" ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => navigate("/Dashboard/events?status=Upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`btn btn-sm ms-2 ${
                status === "In Progress" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => navigate("/Dashboard/events?status=In Progress")}
            >
              In Progress
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="list-group shadow" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between ${
                      selectedEvent?.id === event.id ? "active" : ""
                    }`}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div>
                      <strong>{event.eventName}</strong>
                      <small>{event.dateTime?.split("T")[0]}</small>
                      <span
                        className={`badge ${
                          event.computedStatus === "In Progress"
                            ? "bg-primary"
                            : "bg-warning"
                        } mt-1`}
                      >
                        {event.computedStatus}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-muted">No events found.</p>
              )}
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow p-3">
              {selectedEvent ? (
                <>
                  <h4>{editData.name}</h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Event Name</label>
                      <input className="form-control" value={editData.name} disabled />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date</label>
                      <input className="form-control" value={editData.date} disabled />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Venue</label>
                      <input className="form-control" value={editData.venue} disabled />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <input className="form-control" value={editData.status} disabled />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Capacity</label>
                      <input className="form-control" value={editData.capacity} disabled />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-12">
                      <h5 className="fw-bold">Vendor Assignment</h5>
                    </div>
                                    {Object.entries(vendorOptions).map(([type, vendors]) => {
                      console.log(`Rendering dropdown for ${type}:`, vendors);
                      console.log(`Selected vendor for ${type}:`, selectedVendors[type]);
                      return (
                        <div className="col-md-6 mb-3" key={type}>
                          <label className="form-label">{type}</label>
                          <select
                            className="form-select"
                            value={selectedVendors[type] || ""} // handle per type selection
                            onChange={(e) => {
                              const selectedId = parseInt(e.target.value);
                              console.log(`Selected ${type} vendor:`, selectedId);
                              setSelectedVendors((prev) => ({
                                ...prev,
                                [type]: selectedId, // set selected vendor for this type
                              }));
                            }}
                          >
                            <option value="">Select {type}</option>
                            {vendors
                              .filter((vendor) => vendor && vendor.id !== undefined && vendor.id !== null)
                              .map((vendor) => (
                                <option key={vendor.id} value={vendor.id}>
                                  {vendor.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      );
                    })}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Budget</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.budget}
                        disabled
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-success mt-3"
                    onClick={handleSaveChanges}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <p className="text-muted text-center">Select an event to view details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
