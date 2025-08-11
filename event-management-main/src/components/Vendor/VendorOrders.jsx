import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import VendorNav from "./VendorNav";
import VendorSidebar from "./VendorSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function VendorOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const vendorId = localStorage.getItem("vendorId"); // stored at login
    if (!vendorId) {
      setError("No vendor ID found in localStorage");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/vendors/${vendorId}/vendor-events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch vendor events: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVendorOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter based on search term
  const filteredOrders = vendorOrders.filter(
    (order) =>
      order.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dateTime?.includes(searchTerm)
  );

  return (
    <>
      <VendorNav />
      <div className="d-flex">
        <VendorSidebar />
        <div className="content w-100 p-3">
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
            <h4 className="h5">Vendor Events</h4>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search events..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <p>Loading vendor events...</p>}
          {error && <div className="alert alert-danger">Error: {error}</div>}

          {!loading && !error && (
            <table className="table table-hover table-bordered">
              <thead className="table-secondary text-center">
                <tr>
                  <th>Sr. No</th>
                  <th>Event Name</th>
                  <th>Date & Time</th>
                  <th>Capacity</th>
                  <th>Budget</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{order.eventName}</td>
                      <td>{new Date(order.dateTime).toLocaleString()}</td>
                      <td>{order.capacity}</td>
                      <td>{order.budget}</td>
                      <td>{order.venue}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No events found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default VendorOrders;
