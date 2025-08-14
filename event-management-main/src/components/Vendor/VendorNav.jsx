import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../../assets/profile.png"; // Fallback profile image

const VendorNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const vendorName = localStorage.getItem("vendorEmail") || "Vendor";
  const vendorProfilePic = localStorage.getItem("vendorProfilePic") || profileImg;

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/vendor-signin");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        {/* Left Side: Vendor Portal */}
        <h1 className="h4 mb-0">Vendor Portal</h1>

        {/* Right Corner: Profile Image & Dropdown */}
        <div className="ms-auto position-relative">
          <button
            className="btn d-flex align-items-center"
            onClick={toggleDropdown}
            style={{ background: "none", border: "none" }}
          >
            <img
              src={profileImg}
              alt="Profile"
              className="rounded-circle"
              width="32"
              height="32"
            />
            <span className="ms-2">{vendorName}</span>
          </button>

          {dropdownOpen && (
            <ul
              className="dropdown-menu dropdown-menu-end show mt-2"
              style={{ position: "absolute", right: 0 }}
            >
              <li>
                <Link className="dropdown-item" to="/My-Dashboard/profile" onClick={() => setDropdownOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default VendorNav;
