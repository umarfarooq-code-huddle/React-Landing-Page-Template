import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Grant Your Wish Foundation</p>
      <Link to="/terms-and-conditions" className="footer-link">
        Terms and Conditions
      </Link>
<br/>
      <Link to="/privacy-policy" className="footer-link">
        Privacy Policy
      </Link>
    </footer>
  );
};

export default Footer;
