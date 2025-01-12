import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import "./styles/TermsAndConditions.module.css"; // Optional styling
import { db } from "../utils/firebase";
import JsonData from "../data/data.json";
import { Navigation } from "../components/navigation";


const PrivacyPolicy = () => {
  const [termsLink, setTermsLink] = useState("");



  useEffect(() => {
    const fetchTermsLink = async () => {
      try {
        const docRef = doc(db, "settings", "privacy-policy");
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


   const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
      setLandingPageData(JsonData);
    }, []);

  return (
    <>
      <Navigation data = {landingPageData.App}/>

      <div className="terms-and-conditions">
        {termsLink ? (
          <iframe
            src={termsLink}
            width="100%"
            height="110%"
            title="Terms and Conditions"
            style={{ border: "none" }}
          ></iframe>
        ) : (
          <p>Loading Privacy Policy...</p>
        )}
      </div>
    </>

  );
};

export default PrivacyPolicy;
