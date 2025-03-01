import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer" style={{backgroundColor:'#000', color:'white'}}>
      <p>&copy; 2025 Grant Your Request Foundation</p>
      <Link style={{color:'white'}} to="/terms-and-conditions" className="footer-link">
        Terms and Conditions
      </Link>
<br/>
      <Link style={{color:'white'}} to="/privacy-policy" className="footer-link">
        Privacy Policy
      </Link>
    </footer>
  );
};

export default Footer;
