import React from "react";
import logo from "../assets/landingAssets/image.png";
import { useDeviceSelectors } from "react-device-detect";

export const Header = () => {

  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  // todo: check if it can be done with code instead of react device detect
  const { isMobile } = selectors;

  if(isMobile){
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent:'center',
          height: '100vh',
          backgroundColor: '#faf0e6', // Optional: Set a background color
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '40vw',
            height: 'auto',
            objectFit: 'contain',
            borderRadius:'30%',
          }}
        />
      </div>
    );
  }else{

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          backgroundColor: '#faf0e6', // Optional: Set a background color
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '30vw',
            height: 'auto',
            objectFit: 'contain',
            borderRadius:'30%',
            marginTop:'40vh'
          }}
        />
      </div>
    );
  }
};
