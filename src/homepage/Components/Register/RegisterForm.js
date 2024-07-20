import React, { useState } from 'react';

const RegisterForm1 = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.text();
      if (response.status === 201) {
        alert('Registerd successfully');
        window.location.href = '/login';
      } else {
        setErrorMessage(result);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error logging in');
    }
  };

  return (
    <section className="hero-section d-flex justify-content-center align-items-center">
      <div className="section-overlay"></div>
      <div className="container">
  <div className="row justify-content-center">
    <div className="col-lg-8 col-md-10 col-12">
      <form className="custom-form hero-form" onSubmit={handleSubmit} method="post" role="form">
        <h3 className="text-white mb-4 text-center">Register</h3>
        <div id="error-message" className="text-center mb-3" style={{ color: 'darkred' }}>
          {errorMessage}
        </div>
        <div className="row gx-3">
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input type="text" name="firstName" id="firstName" className="form-control form-control-lg" placeholder="First Name" required />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input type="text" name="lastName" id="lastName" className="form-control form-control-lg" placeholder="Last Name" required />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-gender-ambiguous"></i></span>
              <select name="gender" id="gender" className="form-select form-select-lg" aria-label="Select Gender" style={{height:'34px'}} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-calendar3"></i></span>
              <input type="date" name="birthdate" id="birthdate" className="form-control form-control-lg" placeholder="Birthdate" required />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
              <select id="country" name="country" className="form-select form-select-lg" aria-label="Select Country" style={{height:'34px'}} required>
                <option value="">Select Country</option>
                {/* Option values here */}
              </select>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-badge"></i></span>
              <input type="text" name="username" id="username" className="form-control form-control-lg" placeholder="Username" required />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input type="email" name="email" id="email" className="form-control form-control-lg" placeholder="Email" required />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input type="password" name="password" id="password" className="form-control form-control-lg" placeholder="Password" required />
            </div>
          </div>
          <div className="col-12 mb-3">
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </div>
          <div className="col-12">
            <div className="text-center mb-3">
              <span className="text-white me-2">Already have an account?</span>
              <a href="/login" className="text-decoration-none text-white">Login here</a>
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

export default RegisterForm1;
