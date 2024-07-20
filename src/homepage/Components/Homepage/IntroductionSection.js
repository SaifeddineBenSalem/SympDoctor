import React from 'react';
import Doctors from '../../images/male.png'

const IntroductionSection = () => {
  return (
    <section style={{marginTop:'10%'}}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-12">
            <div className="custom-text-block custom-border-radius-start">
              <h2 className="text-white mb-3">Discover SympDoctor, your gateway to expert healthcare advice and career opportunities.</h2>
              <p className="text-white">Whether you're seeking medical guidance or looking to join our community as a healthcare professional, SympDoctor connects you with personalized solutions and career paths tailored to your needs. Join us in making a positive impact on global health</p>
              <div className="d-flex mt-4"> 
                <div className="counter-thumb">    
                </div> 
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="video-thumb">
              <img src={Doctors} className="about-image custom-border-radius-end img-fluid" alt="People working as team in a company" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;