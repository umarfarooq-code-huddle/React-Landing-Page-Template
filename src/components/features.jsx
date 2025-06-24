import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import bg from "../assets/landingAssets/bg.png";
import { useDeviceSelectors } from "react-device-detect";


export const Features = (props) => {
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step being completed
  const [modalStep, setModalStep] = useState(null); // Tracks which modal is open


  const [termsLink, setTermsLink] = useState(""); // Link fetched from Firebase



  const navigate = useNavigate()
  const handleImageClick = (index) => {
    console.log("Here I am")
    if (index === currentStep) {
      setModalStep(index); // Open the modal for the clicked step
    }
  };

  const handleCompleteStep = () => {
    setCurrentStep((prevStep) => prevStep + 1); // Unlock the next step
    setModalStep(null); // Close the modal
  };

  const handleNavigateToApplication = () => {
    navigate("/Application");
  };


  useEffect(() => {
    const fetchTermsLink = async () => {
      try {
        const docRef = doc(db, "settings", "terms-and-conditions");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTermsLink(docSnap.data().link);
        } else {
          console.error("Terms and Conditions document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching Terms and Conditions link:", error);
      }
    };

    fetchTermsLink();
  }, []);


  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  // todo: check if it can be done with code instead of react device detect
  const { isMobile } = selectors;

  const renderModalContent = () => {
    switch (modalStep) {
      case 0:
        return (
          <>
             <h1 style={{fontVariantCaps:'normal !important', fontSize:'32px', fontWeight:'bold', color:'#000'}}>Terms & Conditions</h1>
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "5px",
                maxHeight: "80vh",
                overflowY: "hidden",
                textAlign: "left",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <iframe
                src={termsLink}
                style={{
                  width: "100%",
                  height: "600px",
                  border: "none",
                }}
                title="Terms & Conditions"
              ></iframe>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  margin: "5px",
                }}
                onClick={handleCompleteStep}
              >
                Accept Terms and Continue
              </button>
            </div>
          </>
        );


      case 2:
        return (
          <>
             <h1 style={{fontVariantCaps:'normal !important', fontSize:'32px', fontWeight:'bold', color:'#000'}}>Support our Rumble Channel</h1>
            <p>
            Please visit our Rumble channel and consider following to help us grow our community and help fund future grants.

            <br />
            Once you visit our channel you can return and continue to the next step
            </p>
            <br />
            <a href="https://rumble.com/c/c-7450456" target="_blank" rel="noopener noreferrer">
            https://rumble.com/c/c-7450456
            </a>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  margin: "5px",
                }}
                onClick={handleCompleteStep}
              >
                Continue
              </button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h1 style={{fontVariantCaps:'normal !important', fontSize:'32px', fontWeight:'bold', color:'#000'}}>Support Our 
            YouTube Channel</h1>
            <p>
            Please visit our YouTube channel and consider subscribing to help us grow our community and help fund future grants
            <br/>
            Once you visit our channel you can return and continue to the next step
            </p>
            <a
              href="https://www.youtube.com/@GrantYourRequestFoundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.youtube.com/@GrantYourRequestFoundation
            </a>
            <br />
            <button
              style={{
                padding: "10px 20px",
                background: "#FF0000",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                margin: "10px",
              }}
              onClick={handleCompleteStep}
            >
              Continue
            </button>

          </>
        );
      case 3:
        return (
          <>
             <h1 style={{fontVariantCaps:'normal !important', fontSize:'32px', fontWeight:'bold', color:'#000'}}>Navigate to Application</h1>
            <p>All steps are complete! Click the button below to proceed to the application form.</p>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  margin: "5px",
                }}
                onClick={handleNavigateToApplication}
              >
                Go to Application
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="process"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: "8vh",
        padding: isMobile ? "20px" : "0vw",
        fontFamily: "Rockwell, serif",
        color: "#000",
        textAlign: "left",
      }}
    >
      {/* Process Section */}
      <div
        style={{
          width: isMobile ? "100%" : "90%",
          height: "auto",
          paddingTop: "40px",
          paddingBottom: "30px",
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
          <span style={{ color: "#222", fontWeight: "600" }}>Our</span>{" "}
          <span style={{ color: "#3498db", fontWeight: "600", }}>
            Process
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

        {/* Instruction Text */}
        <p
          style={{
            fontSize: "20px",
            fontStyle: "italic",
            textAlign: "center",
            color: "#555",
            marginBottom: "5vh",
            fontWeight:"bold",
          }}
        >
          Click the Icons Below to Start Your Application
        </p>

        {/* Steps Container */}
        <div
          className="features-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // gap: isMobile ? "5vw" : "5vw",
            textAlign: "center",
          }}
        >
          {props.data
            ? props.data.map((d, i) => (
                <div
                  key={`${d.title}-${i}`}
                  className={`feature-item ${i <= currentStep ? "active" : "inactive"}`}
                  style={{
                  
                    pointerEvents: i === currentStep ? "auto" : "none",
                  }}
                  onClick={() => handleImageClick(i)}
                >
                  <h3
                    style={{
                      fontSize: "30px",
                      color: i === currentStep ? "#007BFF" : "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Step {i + 1}
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",

                      fontWeight: i === currentStep ? "bold" : "normal",
                      color: i === currentStep ? "black" : "grey",

                    }}
                  >
                    {d.text1}
                    <br />

                  </p>

                  {/* Step Icons */}
                  <img
                    src={d.icon}
                    style={{
                      width: "auto",
                      height: "50px",
            
                    }}
                    alt={`Step ${i + 1}`}
                  />
                </div>
              ))
            : "Loading..."}
        </div>

        {/* Terms & Conditions Button */}
       
      </div>

      {/* Modal */}
      {modalStep !== null && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "5px",
              maxWidth: isMobile ? "95%" : "1200px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",

              
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              margin: "30px",
            }}
          >
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};
