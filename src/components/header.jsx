import React from "react";
import logo from "../assets/landingAssets/image.png";

export const Header = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        backgroundColor: '#faf0e6', // Optional: Set a background color
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: '30vw',
          height: 'auto',
          objectFit: 'contain',
          borderRadius:'30%',
          marginTop:'40vh'
        }}
      />
    </div>
  );
};
