import React from "react";
import { useNavigate } from "react-router-dom";
// import logo from "../../public/img/landingAssets/black.jpg"; // Importing the logo

export const Navigation = (props) => {
  const navigate = useNavigate()



  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top" style={{backgroundColor:'#000', color:'white'}}>
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            style={{color:'white'}}
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
          
          </button>
          {/* Logo and Title */}
          <a className="navbar-brand page-scroll" href="/" style={{color:'white'}}>
          {/* <img
            src={"https://i.ibb.co/rHP6zz7/black.jpg"}
            alt="Logo"
            style={{ height: "60px", marginRight: "10px",marginTop:"-20px", verticalAlign: "middle" }}
          />{" "} */}
            {props.data ? props.data.title : "Grant Your Wish Foundation"}
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="/#about" className="page-scroll" style={{color:'white'}}>
                About us
              </a>
            </li>
            <li>
              <a href="/#features" className="page-scroll"
              style={{color:'white'}}>
                Our Process
              </a>
            </li>

            <li onClick={()=>{navigate("/news-feed")}} className="page-scroll">
            <a  className="page-scroll"
            style={{color:'white'}}>
               News Feed
              </a>
            </li>

            <li onClick={()=>{navigate("/draw-schedule")}} className="page-scroll">
            <a  className="page-scroll" style={{color:'white'}}>
              Drawing Schedule
              </a>
            </li>
            {/* Uncomment or add more links if needed */}
          </ul>
        </div>
      </div>
    </nav>
  );
};
