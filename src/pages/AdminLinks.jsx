import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLinks = () => {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px 0',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Admin Panel</h2>
      <button onClick={() => navigate('/admin-add-news')} style={buttonStyle}>Add News</button>
      <button onClick={() => navigate('/admin-add-draw')} style={buttonStyle}>Add Draw Schedule</button>
      <button onClick={() => navigate('/admin-add-terms-link')} style={buttonStyle}>Add Terms and Conditions Link</button>
      <button onClick={() => navigate('/admin-add-privacy-link')} style={buttonStyle}>Add Privacy Policy Link</button>
      <button onClick={() => navigate('/applications')} style={buttonStyle}>Applications</button>
    </div>
  );
};

export default AdminLinks;
