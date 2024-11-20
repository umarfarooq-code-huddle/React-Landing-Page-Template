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
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
        {props?.data?.title}
      </h1>
      <p style={{ fontSize: '24px', lineHeight: '1.6' }}>
        {props?.data?.text}
      </p>
    </div>
  );
};
