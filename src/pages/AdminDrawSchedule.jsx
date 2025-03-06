import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import JsonData from "../data/data.json";
import { Navigation } from "../components/navigation";
import { Modal, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const styles = {
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "Rockwell, serif",
    transition: "background-color 0.3s ease",
  },
  deleteButtonHover: {
    backgroundColor: "#ff1a1a",
  },
};

const AdminDrawSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const navigate = useNavigate()

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

  const handleDeleteClick = (id) => {
    setSelectedScheduleId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "drawSchedules", selectedScheduleId));
      setSchedules(schedules.filter((schedule) => schedule.id !== selectedScheduleId));
      setModalOpen(false);
      setSelectedScheduleId(null);
    } catch (error) {
      console.error("Error deleting draw schedule:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedScheduleId(null);
  };

  const navigateToAddDraw = () => {
    navigate('/admin-add-draw')
  };

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
      <Modal open={modalOpen} onClose={closeModal}>
        <div style={{ 
          padding: "20px", 
          background: "white", 
          borderRadius: "10px", 
          textAlign: "center", 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)" 
        }}>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this draw schedule?</p>
          <Button variant="contained" color="secondary" onClick={confirmDelete}>Yes</Button>
          <Button variant="contained" onClick={closeModal}>No</Button>
        </div>
      </Modal>
      <div style={containerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>

        <h1 style={headingStyle}>Draw Schedule</h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={navigateToAddDraw}>
          Add Draw
        </Button>
      </div>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Draw Title</th>
              <th style={thStyle}>Draw Date</th>
              <th style={thStyle}>Draw Amount</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={schedule.id} style={index % 2 === 0 ? evenRowStyle : {}}>
                <td style={thTdStyle}>{schedule.title}</td>
                <td style={thTdStyle}>{new Date(schedule.drawDate).toLocaleDateString()}</td>
                <td style={thTdStyle}>{schedule.drawAmount}</td>
                <td style={thTdStyle}>
                  <button
                    style={{
                      ...styles.deleteButton,
                      ...(hovered === schedule.id ? styles.deleteButtonHover : {}),
                    }}
                    onMouseEnter={() => setHovered(schedule.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(schedule.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDrawSchedule
