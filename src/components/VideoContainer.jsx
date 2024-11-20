import React from "react";

export const VideoContainer = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        margin: '0 auto',
        textAlign: 'center',
        height: '70%',
        width: '100%',
        backgroundColor: '#faf0e6',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="video-container">
        <iframe
          width="560"
          height="400"
          src="https://www.youtube.com/embed/MPRohprqYO8"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="intro-video"
        ></iframe>
      </div>
    </div>
  );
};
