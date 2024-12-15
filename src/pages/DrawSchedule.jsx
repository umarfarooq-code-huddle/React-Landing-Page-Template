import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "./styles/drawSchedule.module.css";

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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Draw Schedule</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Draw Title</th>
            <th>Draw Date</th>
            <th>Draw Amount</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>{schedule.title}</td>
              <td>{new Date(schedule.drawDate).toLocaleDateString()}</td>
              <td>{schedule.drawAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrawSchedule;
