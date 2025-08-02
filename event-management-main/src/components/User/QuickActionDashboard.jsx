import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const quickActions = [
  { text: "Create Event", link: "/index/create-event", icon: "fas fa-calendar-plus" },
  { text: "View My Bookings", link: "/index/Bookings", icon: "fas fa-calendar-check" },
];

const QuickActionDashboard = () => {
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <h3 className="text-center mb-5">Quick Actions</h3>

      <div className="row justify-content-center g-4 w-100">
        {quickActions.map((action, index) => (
          <div key={index} className="col-lg-5 col-md-6 col-sm-8 d-flex justify-content-center">
            <Link to={action.link} className="text-decoration-none w-100">
              <div className="card text-center shadow-lg p-4 h-100" style={{ minWidth: "300px" }}>
                <i className={`${action.icon} fa-2x text-primary mb-3`}></i>
                <h5 className="fw-bold">{action.text}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionDashboard;
