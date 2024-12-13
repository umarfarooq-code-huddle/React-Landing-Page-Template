import React from "react";
import logo from "../assets/landingAssets/image.png";

export const Header = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#faf0e6', // Optional: Set a background color
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: '50vw',
          height: 'auto',
          objectFit: 'contain',
          borderRadius:'30%'
        }}
      />
    </div>
  );
};
