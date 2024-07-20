import React from 'react';
import sympDoctor from '../../images/avatar/doctor.png';
import superDoctor from '../../images/avatar/superdoctor.png';

const JobSection = () => {
  return (
    <section className="job-section job-featured-section section-padding" id="job-section">
      <div className="container">
        <div className="row">

          <div className="col-lg-6 col-12 text-center mx-auto mb-4">
            <h2>Featured Jobs</h2>
            <p><strong>Over 200 medical professionals </strong> have joined our community. Whether you're a seasoned healthcare provider or an aspiring SuperDoctor, SympDoctor offers a platform to connect with patients and enhance your practice. Apply now and be part of a transformative healthcare experience.</p>
          </div>

          <div style={{marginTop:'5%'}}>
            <div className="job-thumb d-flex">
              <div className="job-image-wrap bg-white shadow-lg">
                <img src={sympDoctor} className="job-image img-fluid" alt="" />
              </div>
              <div className="job-body d-flex flex-wrap flex-auto align-items-center ms-4">
                <div className="mb-3">
                  <h4 className="job-title mb-lg-0">
                    <a href="/login" className="job-title-link">SympDoctor</a>
                  </h4>
                  <div className="d-flex flex-wrap align-items-center">
                    <p className="job-location mb-0">
                      <i className="custom-icon bi-geo-alt me-1"></i>
                      Sfax, Tunisia
                    </p>    
                    <div className="d-flex">
                      <p className="mb-0">
                        <button className="badge badge-level">Available</button>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="job-section-btn-wrap">
                  <a href="/login" className="custom-btn btn">Apply now</a>
                </div>
              </div>
            </div>

            <div className="job-thumb d-flex">
              <div className="job-image-wrap bg-white shadow-lg">
                <img src={superDoctor} className="job-image img-fluid" alt="" />
              </div>
              <div className="job-body d-flex flex-wrap flex-auto align-items-center ms-4">
                <div className="mb-3">
                  <h4 className="job-title mb-lg-0">
                    <a href="/login" className="job-title-link">SuperDoctor</a>
                  </h4>
                  <div className="d-flex flex-wrap align-items-center">
                    <p className="job-location mb-0">
                      <i className="custom-icon bi-geo-alt me-1"></i>
                      Sfax, Tunisia
                    </p>
                    <div className="d-flex">
                      <p className="mb-0">
                        <button className="badge badge-level">Available</button>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="job-section-btn-wrap">
                  <a href="/login" className="custom-btn btn">Apply now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSection;