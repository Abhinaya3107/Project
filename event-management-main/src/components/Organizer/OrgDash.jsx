import "bootstrap/dist/css/bootstrap.min.css";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

const eventActions = [
  { text: "All Events", link: "/Dashboard/events", icon: "fas fa-calendar" },
  { text: "Events in Progress", link: "/Dashboard/events?status=In Progress", icon: "fas fa-play-circle" },
  { text: "Upcoming Events", link: "/Dashboard/events?status=Upcoming", icon: "fas fa-calendar-alt" },
];

const OrgDash = () => {
  const [dateTime, setDateTime] = useState("");
  const [eventCount, setEventCount] = useState(0);
  const [venueCount, setVenueCount] = useState(0);
  const [catererCount, setCatererCount] = useState(0);
  const [photographerCount, setPhotographerCount] = useState(0);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      setDateTime(now.toLocaleString("en-US", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
   axios.get("http://localhost:8080/api/events/events/count")
  .then(res => setEventCount(res.data))
  .catch(err => console.error("Error fetching event count", err));


    axios.get("http://localhost:8080/api/vendors/count?category=Caterer")
    .then(res => setCatererCount(res.data))
    .catch(err => console.error("Error fetching caterer count", err));

    axios.get("http://localhost:8080/api/vendors/count?category=Photography")
      .then(res => setPhotographerCount(res.data))
      .catch(err => console.error("Error fetching photographers", err));

      axios.get("http://localhost:8080/api/vendors/count?category=Venue")
      .then(res => setVenueCount(res.data))
      .catch(err => console.error("Error fetching Venue", err));
  }, []);

  return (
    <>
      
      <div className="d-flex">
        <Sidebar />
        <div className="w-100 p-3">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h6 className="text-start mb-2">Dashboard</h6>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary  d-flex align-items-center gap-1"
                >
                  <i className="fas fa-calendar-check me-1"></i>
                  {dateTime}
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Event Requests */}
            <div className="col-md-4 col-xl-3">
              <div className="card bg-c-blue order-card">
                <div className="card-block">
                  <h6 className="m-b-20">Event Requests</h6>
                  <h2 className="text-end">
                    <i className="fa fa-calendar f-left mt-2"></i>
                    <span>{eventCount}</span>
                  </h2>
                  <p className="m-b-0">Completed Events<span className="f-right">---</span></p>
                </div>
              </div>
            </div>

          
            {/* Caterers */}
            <div className="col-md-4 col-xl-3">
              <div className="card bg-c-yellow order-card">
                <div className="card-block">
                  <h6 className="m-b-20">Caterers</h6>
                  <h2 className="text-end">
                    <i className="fa fa-utensils mt-2 f-left"></i>
                    <span>{catererCount}</span>
                  </h2>
                  <p className="m-b-0">Available Caterers<span className="f-right">---</span></p>
                </div>
              </div>
            </div>

            {/* Photographers */}
            <div className="col-md-4 col-xl-3">
              <div className="card bg-c-pink order-card">
                <div className="card-block">
                  <h6 className="m-b-20">Photographers</h6>
                  <h2 className="text-end">
                    <i className="fa fa-camera mt-2 f-left"></i>
                    <span>{photographerCount}</span>
                  </h2>
                  <p className="m-b-0">Available<span className="f-right">---</span></p>
                </div>
              </div>
            </div>
          </div>

          <h6 className="text-start mb-2">Quick Dashboard</h6>
          <hr />
          <div className="row g-3">
            {eventActions.map((action, index) => (
              <div key={index} className="col-md-4">
                <Link to={action.link} className="text-decoration-none">
                  <div className="card text-center shadow-lg p-3">
                    <i className={`${action.icon} fa-2x text-primary mb-3`}></i>
                    <h6 className="fw-bold">{action.text}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default OrgDash;
