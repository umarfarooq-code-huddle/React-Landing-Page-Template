import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "./styles/newsFeed.module.css";
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
        // Sort news by date (desc)
        newsList.sort((a, b) => new Date(b.date) - new Date(a.date));
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


  return (
    <>
    <Navigation data = {landingPageData.App}/>
    <div className={styles.container}>
      <h1 className={styles.heading}>News Feed</h1>
      <div className={styles.newsGrid}>
        {news.map((article) => (
          <div
            key={article.id}
            className={styles.card}
            onClick={() => article.link && window.open(article.link, "_blank")}
            title={article.link ? `Go to link: ${article.link}` : ""}
            style={{ cursor: article.link ? "pointer" : "default" }}
          >
            <h2 className={styles.cardTitle}>{article.title}</h2>
            <p className={styles.cardContent}>{article.content}</p>
            <small className={styles.cardDate}>
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
