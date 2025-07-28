import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateEventModal = ({ show, handleClose, editData, handleEditChange, handleUpdateBooking }) => {
  if (!editData) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Event Name</Form.Label>
            <Form.Control name="eventName" value={editData.eventName} onChange={handleEditChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control type="datetime-local" name="dateTime" value={editData.dateTime} onChange={handleEditChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Venue</Form.Label>
            <Form.Control name="venue" value={editData.venue} onChange={handleEditChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Budget</Form.Label>
            <Form.Control type="number" name="budget" value={editData.budget} onChange={handleEditChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Capacity</Form.Label>
            <Form.Control type="number" name="capacity" value={editData.capacity} onChange={handleEditChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2} name="description" value={editData.description} onChange={handleEditChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleUpdateBooking}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateEventModal;
