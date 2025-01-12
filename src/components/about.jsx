import React from "react";

export const About = (props) => {
  return (
    <div id="about" style={{
      backgroundColor:'#faf0e6',
      height:'80vh',
      display:'flex',
      paddingTop:'40vh',
      justifyContent:'center',


    
    }}>
         
          <div id="innerabout" className="col-xs-12 col-md-6" style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
            <div className="about-text" style={{}}>
              <h2>About Us</h2>
              <p>{props.data ? props.data.paragraph : "loading..."}</p>
              <h3>Why Choose Us?</h3>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};
