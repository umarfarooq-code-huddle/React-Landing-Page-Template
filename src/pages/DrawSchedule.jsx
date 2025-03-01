import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import JsonData from "../data/data.json";
import { Navigation } from "../components/navigation";

const DrawSchedule = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedulesCollection = collection(db, "drawSchedules");
        const schedulesSnapshot = await getDocs(schedulesCollection);
        const schedulesList = schedulesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchedules(schedulesList);
      } catch (error) {
        console.error("Error fetching draw schedules:", error);
      }
    };

    fetchSchedules();
  }, []);


  const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
      setLandingPageData(JsonData);
    }, []);

  const containerStyle = {
    padding: "20px",
    marginTop: "10vh",
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "Rockwell, serif",


  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontFamily: "Rockwell, serif",

  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#251b1b",
    color: "wheat",
  };

  const evenRowStyle = {
    backgroundColor: "#f9f9f9",
  };

  return (
    <>
      <Navigation data={landingPageData.App} />
      <div style={containerStyle}>
        <h1 style={headingStyle}>Draw Schedule</h1>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Draw Title</th>
              <th style={thStyle}>Draw Date</th>
              <th style={thStyle}>Draw Amount</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={schedule.id} style={index % 2 === 0 ? evenRowStyle : {}}>
                <td style={thTdStyle}>{schedule.title}</td>
                <td style={thTdStyle}>{new Date(schedule.drawDate).toLocaleDateString()}</td>
                <td style={thTdStyle}>{schedule.drawAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DrawSchedule;
