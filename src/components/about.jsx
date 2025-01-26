import React from "react";

export const About = (props) => {
  return (
    <div id="about" style={{
      backgroundColor: '#fff',
      height: '90vh',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '10vh',
      paddingLeft: '20vw',
      paddingRight: '20vw'
    }}>
      <div id="innerabout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'white' }}>
        <div className="about-text">
          <h1 style={{ color: '#000', fontSize: '58px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'left', fontVariantCaps: 'normal' }}>
            {props?.data?.title}
          </h1>
          <p style={{ textAlign: 'justify', fontSize: '24px' }}>{props.data ? props.data.paragraph : "loading..."}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'white', fontSize: '16px', marginTop: '5vh' , width:'100%'}}>
        
        <div className="col-lg-6 col-sm-6 col-xs-12">
          <ul>
            {props.data
              ? props.data.Why.map((d, i) => (
                <li key={`${d}-${i}`}><span style={{ color: 'green' }}>&#10003;</span> {d}</li>
              ))
              : "loading"}
          </ul>
        </div>

        <div className="col-lg-6 col-sm-6 col-xs-12">
          <ul>
            {props.data
              ? props.data.Why2.map((d, i) => (
                <li key={`${d}-${i}`}><span style={{ color: 'green' }}>&#10003;</span> {d}</li>
              ))
              : "loading"}
          </ul>
        </div>
              </div>
      </div>
    </div>
  );
};
