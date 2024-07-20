import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };
  return (
    <section className="hero-section d-flex justify-content-center align-items-center">
      <div className="section-overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-12 mb-5 mb-lg-0">
            <div className="hero-section-text mt-5">
            <h6 className="text-white">Interested in understanding your own health condition?</h6>
            <h1 className="hero-title text-white mt-4 mb-4">SympDoctor: <br /> The ultimate solution.</h1>
              <a href="/login" className="custom-btn custom-border-btn btn">Browse Diseases</a>
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <form className="custom-form hero-form" action="#" method="get" role="form">
              <h3 className="text-white mb-3">Find Your Health Condition</h3>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="bi-Calendar custom-icon"></i></span>
                    <input type="text" name="job-title" id="job-title" className="form-control" placeholder="Enter Symptoms" required />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon2"><i className="bi custom-icon"></i></span>
                    <input type="text" name="job-location" id="job-location" className="form-control" placeholder="Symptom Duration" required />
                  </div>
                </div>
                <div className="col-lg-12 col-12">
                  
                <button onClick={handleClick} type="submit" className="form-control">Check Symptoms</button>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-wrap align-items-center mt-4 mt-lg-0">
                    <span className="text-white mb-lg-0 mb-md-0 me-2">Popular diseases:</span>
                    <div>
                      <a href="/login" className="badge">Common Cold</a>
                      <a href="/login" className="badge">Asthma</a>
                      <a href="/login" className="badge">Bronchitis</a>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;