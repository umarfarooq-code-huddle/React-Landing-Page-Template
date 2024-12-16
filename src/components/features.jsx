import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { auth,db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";


export const Features = (props) => {
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step being completed
  const [modalStep, setModalStep] = useState(null); // Tracks which modal is open


  const [termsLink, setTermsLink] = useState(""); // Link fetched from Firebase


  useEffect(() => {
    // Fetch Terms and Conditions link from Firebase
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


  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/youtube.readonly');

    
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result)

      if (result.user) {
        handleCompleteStep(1)


        const accessToken = result._tokenResponse.oauthAccessToken;
        window.localstorage.setItem("access_token",accessToken)

      }


    })
  }
  const renderModalContent = () => {
    switch (modalStep) {
      case 0:
        return (
          <>
            <h2>Terms & Conditions</h2>
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "5px",
                maxWidth: "800px",
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
            <h2>Subscribe to our Rumble Channel</h2>
            <p>
              To proceed, please subscribe to our Rumble channel. Once subscribed, click "Continue".
            </p>
            <br/>
            <a href="https://rumble.com/c/c-6750781" target="_blank" rel="noopener noreferrer">
            https://rumble.com/c/c-6750781  
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
            <h2>Subscribe to our YouTube Channel</h2>
            <p>
              To proceed, please subscribe to our YouTube channel. Once subscribed, click "Continue".
            </p>
            <a
              href="https://www.youtube.com/@GrantYourWishFoundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.youtube.com/@GrantYourWishFoundation
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
            <h2>Navigate to Application</h2>
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
    <div>
      <div id="features" className="text-center" style={{ background: "#faf0e6", height: "auto" }}>
        <div className="container">
          <div className="col-md-10 col-md-offset-1 section-title">
            <h2>Our Process</h2>
          </div>
          <div className="features-container">
            {props.data
              ? props.data.map((d, i) => (
                <div
                  key={`${d.title}-${i}`}
                  className={`feature-item ${i <= currentStep ? "active" : "inactive"}`}
                  style={{
                    opacity: i <= currentStep ? 1 : 0.5,
                    pointerEvents: i === currentStep ? "auto" : "none",
                  }}
                  onClick={() => handleImageClick(i)}
                >
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <img src={d.icon} style={d.imgStyle} alt={`Step ${i + 1}`} />
                </div>
              ))
              : "Loading..."}
          </div>
        </div>
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
              padding: "20px",
              borderRadius: "5px",
              maxWidth: "800px",
              maxHeight: "80vh",
              overflowY: "scroll",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};
