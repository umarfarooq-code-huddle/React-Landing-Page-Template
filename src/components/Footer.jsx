import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer" style={{backgroundColor:'#000', color:'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
      <p style={{fontWeight: 'bold'}}>&copy; 2025 Grant Your Request <span style={{color:'#3498db'}}>Foundation</span></p>
      <div>
        <Link style={{color:'white',  marginRight: '10px',textDecoration:'underline'}} to="/terms-and-conditions" className="footer-link">
          Terms and Conditions
        </Link>
        <span style={{color: 'white', marginRight: '10px'}}>|</span>
        <Link style={{color:'white',  textDecoration:'underline'}} to="/privacy-policy" className="footer-link">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
