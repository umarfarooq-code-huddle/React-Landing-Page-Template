import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const AdminAddDrawSchedule = () => {
  const [title, setTitle] = useState("");
  const [drawDate, setDrawDate] = useState("");
  const [drawAmount, setDrawAmount] = useState("");

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const schedulesCollection = collection(db, "drawSchedules");
      await addDoc(schedulesCollection, {
        title,
        drawDate,
        drawAmount :drawAmount,
      });
      alert("Draw schedule added successfully!");
      setTitle("");
      setDrawDate("");
    } catch (error) {
      console.error("Error adding draw schedule:", error);
      alert("Failed to add draw schedule.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Draw Schedule</h1>
      <form
        onSubmit={handleAddSchedule}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <input
          type="text"
          placeholder="Draw Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <input
          type="date"
          placeholder="Draw Date"
          value={drawDate}
          onChange={(e) => setDrawDate(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        
        <input
          type="number"
          placeholder="Draw Amount"
          value={drawAmount}
          onChange={(e) => setDrawAmount(e.target.value)}
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
          Add Schedule
        </button>
      </form>
    </div>
  );
};

export default AdminAddDrawSchedule;
