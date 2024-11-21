import React, { useState } from "react";

export const Features = (props) => {
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step being completed
  const [modalStep, setModalStep] = useState(null); // Tracks which modal is open

  const handleImageClick = (index) => {
    if (index === currentStep) {
      setModalStep(index); // Open the modal for the clicked step
    }
  };

  const handleCompleteStep = () => {
    setCurrentStep((prevStep) => prevStep + 1); // Unlock the next step
    setModalStep(null); // Close the modal
  };

  const handleNavigateToApplication = () => {
    window.location.href = "/Application";
  };

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
              overflowY: "scroll",
              textAlign: "left",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* <h2 style={{ textAlign: "center" }}>Terms & Conditions</h2> */}
            <div>
              <p>
                This Terms of Use agreement governs your use of our website and the Automated Grant Submission System.  
                By accessing or using our website to submit an application for a grant, you must agree to and comply with these terms. 
              </p>
              <h3>Our Mission</h3>
              <p>
                Our mission is to build an online Humanitarian Community to help people with financial hardship through our YouTube & Rumble Social Media channels.  
                You must be an active subscriber/follower to both channels to be eligible to have your wish submitted to our foundation through our automated system.
              </p>
              <h3>Requirements for Participation</h3>
              <ul>
                <li>All applicants must be 18 years old to apply for a grant.</li>
                <li>All applicants must provide supporting documents for identification and verification of the specific financial need requested.</li>
                <li>
                  Use a valid Google email that is linked and verified as subscribed to our YouTube channel.  
                  The use of our system can only be accessed in areas where YouTube is available.
                </li>
                <li>Have a Rumble account username and be a verified follower of our channel.</li>
                <li>Submit a video testimonial of how this Grant has helped you and your application experience with a minimum length of 2 minutes.</li>
                <li>
                  Have a validated digital wallet account in your name with either Uphold or Coinbase to receive the grant funding with our designated digital asset.
                </li>
              </ul>
              <h3>Grant Application Process</h3>
              <ul>
                <li>
                  <strong>Eligibility:</strong> Our grants are available to individuals meeting specific eligibility criteria outlined in our grant guidelines.
                </li>
                <li>
                  <strong>Application Submission:</strong> You agree to provide accurate and complete information when submitting a grant application.
                </li>
                <li>
                  <strong>Grant Approval Decisions:</strong> Our foundation reserves the right to approve or reject your wish application at its sole discretion.
                </li>
              </ul>
              <h3>Donations</h3>
              <p>
                If you choose to make a donation to our foundation, you agree to provide accurate and current payment information.
                All donations must be made to our digital wallet in a USDC or RLUSD stablecoin and are non-refundable.
              </p>
              <h3>Limitation of Liability</h3>
              <p>
                Our foundation and its affiliates, directors, officers, employees, and agents shall not be liable for any direct, indirect, incidental, special, or consequential damages
                arising out of or in any way connected with your use of our website or services.
              </p>
            </div>
           
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
            <a href="https://rumble.com/c/c-6750781" target="_blank" rel="noopener noreferrer">
              <button
                style={{
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  margin: "10px",
                }}
              >
                Go to Rumble Channel
              </button>
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
              <button
                style={{
                  padding: "10px 20px",
                  background: "#FF0000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  margin: "10px",
                }}
              >
                Go to YouTube Channel
              </button>
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
    <div id="features" className="text-center" style={{ background: "#faf0e6", height: "70%" }}>
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Our Process</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div
                  key={`${d.title}-${i}`}
                  className="col-xs-6 col-md-3"
                  style={{
                    opacity: i <= currentStep ? 1 : 0.5,
                    pointerEvents: i === currentStep ? "auto" : "none", // Allow interaction only for the current step
                  }}
                  onClick={() => handleImageClick(i)} // Open modal for current step
                >
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <img src={d.icon} style={d.imgStyle} alt={`Step ${i + 1}`} border="0" />
                </div>
              ))
            : "Loading..."}
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
