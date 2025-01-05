import React from "react";

export const MissionStatement = (props) => {
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
        height:'50%',
        width:'100%',
        backgroundColor: '#faf0e6',

      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 'bold',marginBottom: '16px' }}>
        {props?.data?.title}
      </h1>
      <p style={{ fontSize: '20px', lineHeight: '1.6', fontStyle:'italic' }}>
        {props?.data?.text}
      </p>
    </div>
  );
};
