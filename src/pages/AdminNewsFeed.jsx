import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import JsonData from "../data/data.json";
import { Navigation } from "../components/navigation";
import { Delete, PushPin } from "@mui/icons-material";
import { Modal, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminNewsFeed = () => {
  const [news, setNews] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const navigate = useNavigate();

//navigateToAddNews
  const navigateToAddNews = () => {
    navigate("/admin-add-news");
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsCollection = collection(db, "news");
        const newsSnapshot = await getDocs(newsCollection);
        const newsList = newsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort news by pinned status first, then by date (desc)
        newsList.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.date) - new Date(a.date);
        });
        setNews(newsList);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const deleteNews = async (id) => {
    try {
      await deleteDoc(doc(db, "news", id));
      setNews(news.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedNewsId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "news", selectedNewsId));
      setNews(news.filter((article) => article.id !== selectedNewsId));
      setModalOpen(false);
      setSelectedNewsId(null);
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNewsId(null);
  };

  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const togglePin = async (id, currentPinnedStatus) => {
    try {
      await updateDoc(doc(db, "news", id), {
        pinned: !currentPinnedStatus
      });
      setNews(news.map(article => 
        article.id === id 
          ? { ...article, pinned: !currentPinnedStatus }
          : article
      ));
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
      minHeight: "100vh",
      marginTop: "10vh",
      fontFamily: "Rockwell, serif",
    },
    heading: {
      textAlign: "center",

      fontWeight: "bold",
      marginBottom: "40px",
      color: "#333",
      fontFamily: "Rockwell, serif",
    },
    newsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
    },
    card: {
      background: "linear-gradient(135deg, #fff, #f1f1f1)",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, boxShadow 0.3s ease",
      cursor: "pointer",
      overflow: "hidden",
    },
    cardHover: {
      transform: "scale(1.05)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    },
    cardTitle: {
      fontSize: "2rem",
      fontWeight: "600",
      color: "#333",
      fontFamily: "Rockwell, serif",
      marginBottom: "10px",
    },
    cardContent: {
      fontSize: "1rem",
      color: "#666",
      textAlign: "justify",
      lineHeight: "1.6",
      marginBottom: "20px",
      fontFamily: "Rockwell, serif",
    },
    cardDate: {
      fontSize: "0.9rem",
      color: "#999",
    },
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
    pinButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontFamily: "Rockwell, serif",
      transition: "background-color 0.3s ease",
      marginRight: "10px",
    },
    pinButtonHover: {
      backgroundColor: "#45a049",
    },
    pinnedBadge: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "0.8rem",
      marginLeft: "10px",
    },
  };

  return (
    <>
      <Navigation data={landingPageData.App} />
      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>

        <h1 style={styles.heading}>News Feed</h1>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={navigateToAddNews}>
          Add News
        </Button>
      </div>
        </div>
        <div style={styles.newsGrid}>
          {news.map((article) => (  
            <div
              key={article.id}
              style={styles.card}
              onClick={() => article.link && window.open(article.link, "_blank")}
              title={article.link ? `Go to link: ${article.link}` : ""}
            >
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                  <h2 style={styles.cardTitle}>{article.title}</h2>
                  {article.pinned && <span style={styles.pinnedBadge}>Pinned</span>}
                </div>
                <div>
                  <button
                    style={{
                      ...styles.pinButton,
                      ...(hovered === `pin-${article.id}` ? styles.pinButtonHover : {}),
                    }}
                    onMouseEnter={() => setHovered(`pin-${article.id}`)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(article.id, article.pinned);
                    }}
                  >
                    <PushPin style={{ transform: article.pinned ? 'rotate(45deg)' : 'none' }} />
                  </button>
                  <button
                    style={{
                      ...styles.deleteButton,
                      ...(hovered === article.id ? styles.deleteButtonHover : {}),
                    }}
                    onMouseEnter={() => setHovered(article.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(article.id);
                    }}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
              <p style={styles.cardContent}>{article.content}</p>
              <small style={styles.cardDate}>
                Published on: {new Date(article.date).toLocaleDateString()}
              </small>
              <br></br>
              
            </div>
          ))}
        </div>
      </div>
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
          <p>Are you sure you want to delete this news article?</p>
          <Button variant="contained" color="secondary" onClick={confirmDelete}>Yes</Button>
          <Button variant="contained" onClick={closeModal}>No</Button>
        </div>
      </Modal>
    </>
  );
};

export default AdminNewsFeed;
