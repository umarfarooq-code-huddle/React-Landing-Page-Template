import React from "react";

export const MissionStatement = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '200px',
        margin: '0 auto',
        textAlign: 'center',
        height:'90vh',
        width:'100%',
        backgroundColor: '#faf0e6',
        // backgroundColor: 'red',

      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 'bold',marginBottom: '16px' }}>
        {props?.data?.title}
      </h1>
      <p style={{ fontSize: '17px', lineHeight: '1.6', fontStyle:'italic' }}>
        {props?.data?.text}
      </p>
    </div>
  );
};
