import React, { useState, useEffect } from "react";
import axios from "axios";
import EventRequestModal from "./EventRequestModal";
import "bootstrap/dist/css/bootstrap.min.css";
import OrgNavbar from "./OrgNavBar";
import Sidebar from "./Sidebar";

function EventRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/events/summary");
      console.log("Fetched requests:", response.data); // Debug log
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching event requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (request, status) => {
    try {
      if (!request || !request.id) {
        console.error("Invalid request or missing ID:", request);
        return;
      }

      console.log("Updating:", request.id, "to", status);

      await axios.put(
        `http://localhost:8080/api/events/${request.id}/status?status=${status}`
      );

      await fetchRequests();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Status update failed.");
    }
  };

  const acceptRequest = (id) => {
    if (!id) {
      console.error("acceptRequest called with invalid id:", id);
      return;
    }

    const request = requests.find((req) => req.id === id);
    if (request) {
      handleStatusUpdate(request, "APPROVED");
    } else {
      console.error("Request not found for id:", id);
    }
  };

  const rejectRequest = (id) => {
    if (!id) {
      console.error("rejectRequest called with invalid id:", id);
      return;
    }

    const request = requests.find((req) => req.id === id);
    if (request) {
      handleStatusUpdate(request, "REJECTED");
    } else {
      console.error("Request not found for id:", id);
    }
  };

  const handleAccept = (request) => {
    if (!request || !request.id) {
      console.error("handleAccept called with invalid request:", request);
      return;
    }
    acceptRequest(request.id);
  };

  const handleReject = (request) => {
    if (!request || !request.id) {
      console.error("handleReject called with invalid request:", request);
      return;
    }
    rejectRequest(request.id);
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <>
      <OrgNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-5">
          <h3 className="mb-4">Event Requests</h3>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Sr. No</th>
                <th>User Name</th>
                <th>Event Type</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests
                .filter((request) => request && request.id) // Skip invalid entries
                .map((request, index) => (
                  <tr key={request.id}>
                    <td>{index + 1}</td>
                    <td>{request.username}</td>
                    <td>{request.eventName}</td>
                    <td>{request.dateTime}</td>
                    <td>{request.venue}</td>
                    <td>₹{request.budget}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleAccept(request)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleReject(request)}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleView(request)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {selectedRequest && (
            <EventRequestModal
              show={showModal}
              onHide={handleCloseModal}
              request={selectedRequest}
              handleStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default EventRequests;
