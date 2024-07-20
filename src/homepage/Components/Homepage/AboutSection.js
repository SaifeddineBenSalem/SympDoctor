import React from 'react';
import '../../images/professional-asian-businesswoman-gray-blazer.jpg';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="row">

          <div className="col-lg-3 col-12">
            <div className="about-image-wrap custom-border-radius-start">
              <img 
                src="./images/professional-asian-businesswoman-gray-blazer.jpg" 
                className="about-image custom-border-radius-start img-fluid" 
                alt="" 
              />

              <div className="about-info">
                <h4 className="text-white mb-0 me-2">Julia Ward</h4>
                <p className="text-white mb-0">Investor</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-12">
            <div className="custom-text-block">
              <h2 className="text-white mb-2">Introduction Gotto</h2>
              <p className="text-white">
                Gotto Job is a free website template for job portals. This layout is based on Bootstrap 5 CSS framework. Thank you for visiting 
                <a href="https://www.tooplate.com" target="_parent">Tooplate website</a>. Images are from 
                <a href="https://www.freepik.com/" target="_blank">FreePik</a> website.
              </p>
              <div className="custom-border-btn-wrap d-flex align-items-center mt-5">
                <a href="about.html" className="custom-btn custom-border-btn btn me-4">Get to know us</a>
                <a href="#job-section" className="custom-link smoothscroll">Explore Jobs</a>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-12">
            <div className="instagram-block">
              <img 
                src="images/horizontal-shot-happy-mixed-race-females.jpg" 
                className="about-image custom-border-radius-end img-fluid" 
                alt="" 
              />

              <div className="instagram-block-text">
                <a href="https://instagram.com/" className="custom-btn btn">
                  <i className="bi-instagram"></i>
                  @Gotto
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;