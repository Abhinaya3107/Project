import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getCurrentMonth = () => new Date().getMonth() + 1;

function EventDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [editData, setEditData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [eventsData, setEventsData] = useState([]);

    // ✅ New handleSelectEvent function
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setEditData({
            name: event.eventName,
            date: event.dateTime?.split("T")[0] || "",
            venue: event.venue,
            status: event.status,
            capacity: event.capacity,
            photographer: event.vendors?.find(v => v.type === "Photographer")?.name || "",
            caterer: event.vendors?.find(v => v.type === "Caterer")?.name || "",
            budget: event.budget
        });
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/events")
            .then((res) => res.json())
            .then((data) => {
                setEventsData(data);
            })
            .catch((err) => console.error("Error fetching events:", err));
    }, []);

    useEffect(() => {
        const updatedEvents = eventsData.map(event => ({
            ...event,
            status: event.dateTime?.split("T")[0] === getTodayDate() ? "In Progress" : "Upcoming",
        }));

        const monthFilteredEvents = updatedEvents.filter(event =>
            new Date(event.dateTime).getMonth() + 1 === parseInt(selectedMonth)
        );

        setFilteredEvents(status
            ? monthFilteredEvents.filter(event => event.status === status)
            : monthFilteredEvents
        );

        // setSelectedEvent(null);
    }, [eventsData, status, selectedMonth]);

    return (
        <>
            <OrgNavbar />
            <div className="d-flex">
                <Sidebar />
                <div className="content w-100 p-3">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                        <h6 className="text-start mb-2">{status ? `${status} Events` : "All Events"}</h6>

                        <div className="btn-toolbar mb-2 mb-md-0">
                            <div className="btn-group me-2">
                                <select className="form-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                    {[...Array(12)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {new Date(2025, index, 1).toLocaleString("default", { month: "long" })}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="btn-group me-2">
                                <button
                                    className={`btn btn-sm ${status === "Upcoming" ? "btn-warning" : "btn-outline-warning"}`}
                                    onClick={() => navigate('/Dashboard/events?status=Upcoming')}
                                >
                                    Upcoming Events
                                </button>
                                <button
                                    className={`btn btn-sm ${status === "In Progress" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => navigate('/Dashboard/events?status=In Progress')}
                                >
                                    In Progress Events
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Event List */}
                        <div className="col-md-4">
                            <div className="list-group shadow" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                                    <button
                                        key={event.id}
                                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${selectedEvent?.id === event.id ? "active" : ""}`}
                                        onClick={() => handleSelectEvent(event)}
                                    >
                                        <div className="d-flex flex-column">
                                            <strong>{event.eventName}</strong>
                                            <small>{event.dateTime?.split("T")[0]}</small>
                                            <span className={`badge ${event.status === "In Progress" ? "bg-primary" : "bg-warning"} mt-1`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </button>
                                )) : <p className="text-center text-muted">No events found for {status} in {new Date(2025, selectedMonth - 1, 1).toLocaleString("default", { month: "long" })}</p>}
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="col-md-8">
                            <div className="card shadow p-3">
                                {selectedEvent ? (
                                    <>
                                        <h4 className="fw-bold">{editData.name}</h4>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Event Name</label>
                                                <input type="text" className="form-control" value={editData.name} disabled />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Date</label>
                                                <input type="date" className="form-control" value={editData.date} disabled />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Venue</label>
                                                <input type="text" className="form-control" value={editData.venue} disabled />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Status</label>
                                                <input type="text" className="form-control" value={editData.status} disabled />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Capacity</label>
                                                <input type="text" className="form-control" value={editData.capacity} disabled />
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-md-12">
                                                <h5 className="fw-bold">Vendor Information</h5>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Photographer</label>
                                                <input type="text" className="form-control" value={editData.photographer} disabled />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Caterer</label>
                                                <input type="text" className="form-control" value={editData.caterer} disabled />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Budget</label>
                                                <input type="number" className="form-control" value={editData.budget} disabled />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-muted">Select an event to view details</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EventDetails;
