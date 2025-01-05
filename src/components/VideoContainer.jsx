import React from "react";
import {useDeviceSelectors} from "react-device-detect"

export const VideoContainer = (props) => {

  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  // todo: check if it can be done with code instead of react device detect
  const { isMobile } = selectors;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        margin: '0 auto',
        marginTop:isMobile ? '200px':'auto',
        textAlign: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: '#faf0e6',

      }}
    >
      <div className="video-container">
        {isMobile ? <iframe

          src="https://www.youtube.com/embed/6xffbCOqv8w"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="intro-video"
        ></iframe>:
        <iframe
        width="650"
        height="450 "
        src="https://www.youtube.com/embed/6xffbCOqv8w"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="intro-video"
      ></iframe>}
      </div>
    </div>
  );
};
