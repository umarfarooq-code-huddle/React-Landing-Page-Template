import React from "react";
import { useDeviceSelectors } from "react-device-detect";

const MissionStatement = () => {
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  return (
    <div
      style={{

        height:'145vh',
        justifyContent:'center',
        display:'flex',
        flexDirection:'column',
      }}
    >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent:'space-between',
        alignItems: "center",
        width: "100%",
        padding: isMobile ? "20px" : "0vw",
        fontFamily:'Rockwell, serif',
        color: "#fff",
    
   
        height:'135vh'
      }}
    >
      {/* Mission Statement Section */}
      <div
        style={{
          textAlign: "left", // Ensures left alignment
          width: isMobile ? "100%" : "90%",
          
          alignItems:'center',
          justifyContent:'center',



        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#222", // Dark grey for "Mission"
            marginBottom: "5px",
            fontFamily:'Rockwell, serif'
          }}
        >
          <span style={{ color: "#222", fontWeight: "600" }}>Mission</span>{" "}
          <span style={{ color: "#3498db", fontWeight: "600" }}>Statement</span>
        </h1>
        {/* Underline */}
        <div
          style={{
            width: "120px",
            height: "4px",
            backgroundColor: "#3498db",
            marginBottom: "15px",
            
          }}
        ></div>

        {/* Quote Section */}
        <blockquote
          style={{
            fontStyle: "italic",
            fontSize: "22px",
            color: "black", // Grey quote color
            fontWeight: "600",
            fontFamily:'Rockwell, serif',
            lineHeight: "1.4",
          }}
        >
          <span style={{ fontSize: "28px" , 
            fontFamily:'Rockwell, serif'
          
          }}>“</span>
          Empowering People to Increase <br />
          Their Quality of Life
          <span style={{ fontSize: "28px", fontWeight: "bold" }}>”</span>
        </blockquote>

        {/* Description */}
        <p
          style={{
            fontSize: "22px",
            lineHeight: "1.6",
            color:'gray',
             // Light grey text
                  textAlign:'center',
                 
                  marginTop: "10px",
                  fontFamily:'Rockwell-Italic, serif'

                  }}
                >
                  The Grant Your Request Foundation was established with the mission of{" "}
                  <span style={{ fontWeight: "600" }}>
                  “Empowering People to Increase Their Quality of Life”
                  </span>
                  . Our Automated Grant Selection System aligns perfectly with this
                  vision, providing a user-friendly, automated platform that ensures
                  everyone has an equal opportunity to receive financial assistance
                  quickly.
                </p>
                </div>

                {/* Blue Circle with Downwards Arrow */}
                <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#3498db",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
                >
              <i className="fa fa-arrow-down" />
                </div>

                {/* Video Section */}
      <div
        style={{
          position: "relative",
          width: isMobile ? "90%" : "800px",
          height: isMobile ? "200px" : "450px",
          borderRadius: "10px",
          overflow: "hidden",

        }}
      >
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/PchWz1hs-6I"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            borderRadius: "10px",
            border: "none",
          }}
        ></iframe>
      </div>
    </div>
    </div>
  );
};

export default MissionStatement;
