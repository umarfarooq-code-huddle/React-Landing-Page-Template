import React from "react";
import { useDeviceSelectors } from "react-device-detect";

export const About = (props) => {
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  return (
    <div
      id="about"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop:'8vh',
        marginTop:'5vh',
        height:'auto',
        padding: isMobile ? "20px" : "0vw",
        fontFamily: "Rockwell, serif",
        color: "#000",



        textAlign: "left",
      }}
    >
      {/* About Section */}
      <div
        style={{
          width: isMobile ? "100%" : "90%",
   
     

        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#222",
            marginBottom: "5px",
          }}
        >
          <span style={{ color: "#222", fontWeight: "600" }}>
            {props?.data?.title?.split(" ")[0]}
          </span>{" "}
          <span style={{ color: "#3498db", fontWeight: "600" }}>
            {props?.data?.title?.split(" ")[1]}
          </span>
        </h1>

        {/* Underline */}
        <div
          style={{
            width: "120px",
            height: "4px",
            backgroundColor: "#3498db",
            marginBottom: "5vh",
          }}
        ></div>

        {/* Description */}
        <p
          style={{
            fontSize: "22px",
            lineHeight: "1.6",
            fontStyle: "italic",
            fontFamily: "Rockwell, serif",
            textAlign:'center',
            color: "#121212",
          }}
        >
          {props?.data?.paragraph || "loading..."}
        </p>

        {/* Bullet Points Section */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            marginTop: "4vh",
            width: "100%",
            maxWidth: "1100px",
            justifyContent: "center",
            gap: "5%",
            margin: "4vh auto 0",
          }}
        >
          {/* First Column */}
          <ul style={{ 
            width: isMobile ? "100%" : "55%", 
            listStyle: "none", 
            paddingLeft: 0,
            display: "inline-block",
            margin: "0 auto"
          }}>
            {props.data
              ? props.data.Why.map((d, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "18px",
                      fontFamily: "Rockwell, serif",
                      color: "#333",
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                        fontSize: "20px",
                        marginRight: "8px",
                        minWidth: "20px",
                      }}
                    >
                      ✔
                    </span>
                    <span style={{ flex: 1 }}>{d}</span>
                  </li>
                ))
              : "loading..."}
          </ul>

          {/* Second Column */}
          <ul style={{ 
            width: isMobile ? "100%" : "55%", 
            listStyle: "none", 
            paddingLeft: 0,
            display: "inline-block",
            margin: "0 auto"
          }}>
            {props.data
              ? props.data.Why2.map((d, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "18px",
                      fontFamily: "Rockwell, serif",
                      color: "#333",
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                        fontSize: "20px",
                        marginRight: "8px",
                        minWidth: "20px",
                      }}
                    >
                      ✔
                    </span>
                    <span style={{ flex: 1 }}>{d}</span>
                  </li>
                ))
              : "loading..."}
          </ul>
        </div>
      </div>
    </div>
  );
};
