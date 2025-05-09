import React from "react";
import { useNavigate } from "react-router-dom";
// import logo from "../../public/img/landingAssets/black.jpg"; // Importing the logo

export const Navigation = (props) => {
  const navigate = useNavigate()



  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top" style={{backgroundColor:'#000', color:'white', zIndex: 100}}>
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            style={{color:'white', fontFamily:'Rockwell, sarif'}}
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
          
          </button>
  

                <a className="navbar-brand page-scroll" href="/" style={{color:'white', fontFamily:'Rockwell, sarif'}}>
                {props.data ? (
                  <>
                  {props.data.title}
                  </>
                ) : (
                  "Grant Your Request Foundation"
                )}
                </a>{" "}
              </div>

              <div
                className="collapse navbar-collapse"
                id="bs-example-navbar-collapse-1"
              >
                <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="/#about" className="page-scroll" style={{color:'white', fontFamily:'Rockwell, sarif'}}>
                  About us
                  </a>
                </li>
                <li>
                  <a href="/#process" className="page-scroll"
                  style={{color:'white', fontFamily:'Rockwell, sarif'}}>
                  Our Process
                  </a>
                </li>

                <li onClick={()=>{navigate("/news-feed")}} className="page-scroll">
            <a  className="page-scroll"
            style={{color:'white', fontFamily:'Rockwell, sarif'}}>
               News Feed
              </a>
            </li>

            <li onClick={()=>{navigate("/draw-schedule")}} className="page-scroll">
            <a  className="page-scroll" style={{color:'white', fontFamily:'Rockwell, sarif'}}>
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
