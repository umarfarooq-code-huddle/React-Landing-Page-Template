import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import "./styles/TermsAndConditions.module.css"; // Optional styling
import { db } from "../utils/firebase";

const TermsAndConditions = () => {
  const [termsLink, setTermsLink] = useState("");

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

  return (
    <div className="terms-and-conditions">
      {termsLink ? (
        <iframe
          src={termsLink}
          width="100%"
          height="600px"
          title="Terms and Conditions"
          style={{ border: "none" }}
        ></iframe>
      ) : (
        <p>Loading Terms and Conditions...</p>
      )}
    </div>
  );
};

export default TermsAndConditions;
