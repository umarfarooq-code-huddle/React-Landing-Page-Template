import React from "react";
import logo from "../assets/landingAssets/image.png";
import bg from "../assets/landingAssets/bg.png";

export const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        marginTop:'10vh',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        textAlign: "center",
        
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(36px,42px,48px)",
          fontWeight: "normal",
          color: "#111",
          fontFamily: "Rockwell, serif",
          lineHeight: "1.2",
        }}
      >
        Bringing Hope Through <br /><span style={{ color: "#3498db  " }}>Blockchain</span> Powered Grants
      </h1>
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "clamp(250px,25vw, 500px)",
          height: "auto",
          objectFit: "contain",
          marginTop: "3vh",
        }}
      />
    </div>
  );
};