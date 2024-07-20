import React from 'react';
import emailjs from 'emailjs-com';
import footerLogo from '../../images/footerLogo.png';

import './css/ContactForm.css'; // Make sure to create this CSS file

const Footer = () => {
  function sendEmail(e) {
    e.preventDefault(); // Prevent page refresh

    emailjs.sendForm('service_09ivbq7', 'template_drdhcku', e.target,'iwpsYR0GjetoLk6Hq')
      .then((result) => {
        console.log(result.text);
        alert('Message sent successfully!');
      }, (error) => {
        console.log(error.text);
        alert('An error occurred, please try again later.');
      });

    // Optionally, reset the form fields after submission
    e.target.reset();
  }

  return (
    <footer className="site-footer">
      <div className="container d-flex justify-content-center">
        <div className="row w-100 justify-content-center">
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <div className="d-flex align-items-center mb-4">
              <img src={footerLogo} className="img-fluid logo-image" alt="Gotto Logo" />
              <div className="d-flex flex-column ml-3">
                <strong className="logo-text">CliniSys</strong>
                <small className="logo-slogan">The best</small>
              </div>
            </div>
            <p className="mb-2">
              <i className="custom-icon bi-globe me-1"></i>
              <a target="_blank" href="https://csys.com.tn/" className="site-footer-link">https://csys.com.tn/</a>
            </p>
            <p className="mb-2">
              <i className="custom-icon bi-telephone me-1"></i>
              <a href="tel: 24 231 400" className="site-footer-link">+216 24 231 400</a>
            </p>
            <p>
              <i className="custom-icon bi-envelope me-1"></i>
              <a href="mailto:soft@csys.com.tn" className="site-footer-link">soft@csys.com.tn</a>
            </p>
          </div>

          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <h2 style={{ marginLeft: "87px" }}>Contact Us</h2>
            <form onSubmit={sendEmail}>
              <div className="form-group">
                <label htmlFor="from_name">Full Name</label>
                <input type="text" id="from_name" name="from_name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="4" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-12 d-flex align-items-center">
              <p className="copyright-text"></p>
              <ul className="footer-menu d-flex">
                <li className="footer-menu-item"><a href="#" className="footer-menu-link"></a></li>
                <li className="footer-menu-item"><a href="#" className="footer-menu-link"></a></li>
              </ul>
            </div>
            <a className="back-top-icon bi-arrow-up smoothscroll d-flex justify-content-center align-items-center" href="#top"></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
