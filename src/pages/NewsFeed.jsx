import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import JsonData from "../data/data.json";
import { Navigation } from "../components/navigation";

const NewsFeed = () => {
  const [news, setNews] = useState([]);

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

  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

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
      fontSize: "5rem",
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
  };

  return (
    <>
      <Navigation data={landingPageData.App} />
      <div style={styles.container}>
        <h1 style={styles.heading}>News Feed</h1>
        <div style={styles.newsGrid}>
          {news.map((article) => (
            <div
              key={article.id}
              style={styles.card}
              onClick={() => article.link && window.open(article.link, "_blank")}
              title={article.link ? `Go to link: ${article.link}` : ""}
            >
              <div style={{display: "flex", alignItems: "center"}}>
                <h2 style={styles.cardTitle}>{article.title}</h2>
                {article.pinned && (
                  <span style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    marginLeft: "10px"
                  }}>
                    Pinned
                  </span>
                )}
              </div>
              <p style={styles.cardContent}>{article.content}</p>
              <small style={styles.cardDate}>
                Published on: {new Date(article.date).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsFeed;
