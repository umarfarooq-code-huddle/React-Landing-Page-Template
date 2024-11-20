import React from "react";

export const Features = (props) => {
  return (
    <div id="features" className="text-center" style={{background:'#faf0e6', height:'70%'}}>
      <div className="container" >
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Our Process</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3">
                  {" "}
             
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>

                  <img src={d.icon} style={d.imgStyle} alt="rumble-logo" border="0"></img>

                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
