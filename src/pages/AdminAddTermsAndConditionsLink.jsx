import React, { useState } from "react";
import { db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminAddTermsAndConditionsLink = () => {
  const [TermsAndConditionsLink, setTermsAndConditionsLink] = useState("");
  const navigate = useNavigate();

  const handleAddTermsAndConditionsLink = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "settings", "terms-and-conditions");

      await setDoc(docRef, { link: TermsAndConditionsLink });
      alert("Terms And Conditions link added successfully!");
      setTermsAndConditionsLink("");
    } catch (error) {
      console.error("Error adding TermsAndConditions link:", error);
      alert("Failed to add TermsAndConditions link.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Terms and Conditions Link</h1>
      <button
        onClick={() => navigate("/admin-links")}
        style={{
          padding: "10px 20px",
          background: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Back to Admin Dashboard
      </button>
      <form onSubmit={handleAddTermsAndConditionsLink} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input
          type="url"
          placeholder="Terms And Conditions Link"
          value={TermsAndConditionsLink}
          onChange={(e) => setTermsAndConditionsLink(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        >
          Add Link
        </button>
      </form>
    </div>
  );
};

export default AdminAddTermsAndConditionsLink;
