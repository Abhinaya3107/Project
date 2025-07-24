import React from "react";
import HeroSection from "../components/HeroSection";
import Organizers from "../components/Organizers";
import NavBar from "./NavBar";
const Home = () => {
  return (
    <>
      <HeroSection className="mt-5" />
      <Organizers />
      {/* About Us Section at the very bottom */}
      <div className="container mt-5 mb-5">
        <div className="card shadow p-4 bg-light">
          <h4 className="mb-3">About Our Event Management Platform</h4>
          <p>
            Welcome to our event management platform! We specialize in connecting users with the best organizers for weddings,
            corporate functions, concerts, and private parties. Whether you need help with planning, execution, or just finding the right vendors —
            we’ve got you covered.
          </p>
          <p>
            Our mission is to simplify event planning by offering a curated list of experienced professionals. We help ensure your event runs smoothly
            and is remembered for all the right reasons. From elegant weddings to energetic concerts, find the right people, all in one place.
          </p>
        </div>
      </div>
      {/* Contact Us Section */}
      <div className="container mb-5">
        <div className="card shadow p-4 bg-white">
          <h4 className="mb-3">Contact Us</h4>
          <p><strong>Address:</strong> 123 Event Avenue, Celebration City, India</p>
          <p><strong>Contact Number:</strong> +91 98765 43210</p>
          <p><strong>Email:</strong> info@eventplatform.com</p>
        </div>
      </div>
    </>
  );
};

export default Home;
