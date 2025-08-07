import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNav from "./UserNav";
import UpdateEventModal from "./UpdateEventModal";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      alert("Please log in to view your bookings.");
      navigate("/user-signin");
      return;
    }

    fetch(`http://localhost:8080/api/events/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [userId, navigate]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setEditData({ ...booking }); // Clone to avoid direct state mutation
    setShowUpdateModal(true);
  };

  const handleDeleteBooking = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this event?");
      if (!confirmDelete) return;

      const response = await fetch(`http://localhost:8080/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== id));
        alert("Event deleted successfully.");
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdateBooking = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings((prevBookings) =>
          prevBookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
        );
        setShowUpdateModal(false);
        alert("Booking updated successfully");
      } else {
        alert("Failed to update booking");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("An error occurred while updating the booking");
    }
  };

  const handleOpenPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  return (
    <>
      <UserNav />
      <div className="container mt-4">
        <h6 className="text-start mb-2">My Bookings</h6>
        <hr />
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow">
            <thead className="table-primary">
              <tr>
                <th>Sr No</th>
                <th>Event Name</th>
                <th>Organizer</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Budget</th>
                <th>Action</th>
               
              </tr>
            </thead>
            <tbody>
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{index + 1}</td>
                    <td>{booking.eventName}</td>
                    <td>{booking.organizer?.organizationName || "N/A"}</td>
                    <td>{new Date(booking.dateTime).toLocaleString()}</td>
                    <td>{booking.venue}</td>
                    <td>Rs {booking.budget}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleViewBooking(booking)}
                      >
                        Update
                      </button>
                      {booking.paymentStatus !== "Paid" && (
                        <button
                          className="btn bg-warning btn-sm me-2"
                          onClick={() => handleOpenPaymentModal(booking)}
                        >
                          Pay
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Delete
                      </button>
                        <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <UpdateEventModal
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          editData={editData}
          handleEditChange={handleEditChange}
          handleUpdateBooking={handleUpdateBooking}
        />
        <PaymentModal
          show={showPaymentModal}
          handleClose={() => setShowPaymentModal(false)}
          selectedBooking={selectedBooking}
        />
      </div>
    </>
  );
};

export default UserBookings;
