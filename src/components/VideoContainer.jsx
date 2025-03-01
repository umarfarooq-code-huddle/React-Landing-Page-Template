import React from "react";
import {useDeviceSelectors} from "react-device-detect"
import bg from "../assets/landingAssets/bg.png";

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
 

        marginTop:isMobile ? '100px':'auto',
        textAlign: 'center',
        height: '80vh',
   
        width: '100%',


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
        width="750"
        height="500 "
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
