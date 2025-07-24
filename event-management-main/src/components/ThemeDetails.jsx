import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import weddingImage from "../assets/wedding.jpg";
import corporateImage from "../assets/corporate.jpg";
import socialEventImage from "../assets/socialevent.jpg";
import birthdayPartyImage from "../assets/birthday.jpg";

const themeData = {
  "Royal Wedding": {
    image: weddingImage,
    info: "Experience the grandeur of a royal wedding with elegant decor, regal colors, and a majestic atmosphere. Perfect for couples who want their special day to feel like a fairytale!"
  },
  "Corporate Gala": {
    image: corporateImage,
    info: "Host a sophisticated corporate gala with modern styling, professional ambiance, and seamless event management. Ideal for business celebrations, award nights, and networking events."
  },
  "Social Event": {
    image: socialEventImage,
    info: "Bring people together for memorable social events, from reunions to community gatherings. Enjoy vibrant themes, engaging activities, and a welcoming environment."
  },
  "Birthday Party": {
    image: birthdayPartyImage,
    info: "Celebrate birthdays in style! From kids' parties to milestone birthdays, enjoy creative decorations, fun games, and delicious treats for all ages."
  }
};

const ThemeDetails = () => {
  const { themeName } = useParams();
  const navigate = useNavigate();
  const decodedThemeName = decodeURIComponent(themeName);
  const theme = themeData[decodedThemeName];

  if (!theme) {
    return (
      <div className="container mt-5 text-center">
        <h2>Theme Not Found</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4 text-center">
            <h1 className="display-5 mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#0d47a1' }}>{decodedThemeName}</h1>
            <img src={theme.image} alt={decodedThemeName} className="mb-4" style={{ maxWidth: '350px', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }} />
            <p className="lead" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.5rem', color: '#1565c0' }}>{theme.info}</p>
            <button className="btn btn-outline-primary mt-3" onClick={() => navigate(-1)}>Back to Themes</button>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Playfair+Display:wght@700&display=swap');
      `}</style>
    </div>
  );
};

export default ThemeDetails; 