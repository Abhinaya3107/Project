import React from "react";
import { Modal, Button } from "react-bootstrap";

function EventRequestModal({ show, onHide, request, handleStatusUpdate }) {
  if (!request) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Event Request Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>User Name:</strong> {request.user?.username || request.username}</p>
        <p><strong>Event Name:</strong> {request.eventName}</p>
        <p><strong>Date & Time:</strong> {request.dateTime}</p>
        <p><strong>Venue:</strong> {request.venue}</p>
        <p><strong>Budget:</strong> ₹{request.budget}</p>
        <p><strong>Status:</strong> {request.status}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={() => handleStatusUpdate(request, "APPROVED")}
          disabled={request.status !== "PENDING"}
        >
          Accept
        </Button>
        <Button
          variant="danger"
          onClick={() => handleStatusUpdate(request, "REJECTED")}
          disabled={request.status !== "PENDING"}
        >
          Reject
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventRequestModal;
