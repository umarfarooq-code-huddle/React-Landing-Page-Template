import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Navigation } from "../components/navigation";
import JsonData from "../data/data.json";

const AdminAddNews = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const newsCollection = collection(db, "news");

      await addDoc(newsCollection, {
        title,
        content,
        link: link || null, // Optional link
        date: new Date().toISOString(),
      });
      alert("News article added successfully!");
      setTitle("");
      setContent("");
      setLink("");
    } catch (error) {
      console.error("Error adding news:", error);
      alert("Failed to add news.");
    }
  };

  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
            <Navigation data={landingPageData.App} />
      <h1 style={{marginTop: '10vh'}}>Add News</h1>
      <form onSubmit={handleAddNews} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          maxLength={50}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          maxLength={1000}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        ></textarea>
        <input
          type="url"
          placeholder="Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
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
          Add News
        </button>
      </form>
    </div>
  );
};

export default AdminAddNews;
