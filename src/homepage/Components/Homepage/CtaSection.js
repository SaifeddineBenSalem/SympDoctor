import React from 'react';

const CtaSection = () => {
  return (
    <section className="cta-section">
      <div className="section-overlay"></div>

      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-10">
            <h2 className="text-white mb-2">Over 10k opening jobs</h2>
            <p className="text-white">
              If you are looking for free HTML templates, you may visit Tooplate website. If you need a collection of free templates, you can visit Too CSS website.
            </p>
          </div>

          <div className="col-lg-4 col-12 ms-auto">
            <div className="custom-border-btn-wrap d-flex align-items-center mt-lg-4 mt-2">
              <a href="#" className="custom-btn custom-border-btn btn me-4">Create an account</a>
              <a href="#" className="custom-link">Post a job</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;