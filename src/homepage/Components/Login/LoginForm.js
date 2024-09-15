import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm1 = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate directly

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const { token } = await response.json();

      // Store the token in localStorage or sessionStorage
      localStorage.setItem('token', token); // You can also use sessionStorage for session-only storage

     // alert('Logged in successfully');
     window.location.reload();
      } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Error logging in');
    }
  };
  return (
    <section className="hero-section d-flex justify-content-center align-items-center">
      <div className="section-overlay"></div>
      <div className="container" style={{width:'1000px'}}>
  <div className="row justify-content-center">
    <div className="col-lg-6 col-12">
      <form className="custom-form hero-form" onSubmit={handleSubmit} method="post" role="form">
        <h3 className="text-white mb-3 text-center">Login</h3>
        {errorMessage && (
                <div
          id="error-message"
          className="col-12"
          style={{
            color: 'white', // Text color
            backgroundColor: 'red', // Background color
            fontSize: '18px',
            marginTop: '20px',
            marginBottom: '20px',
            padding: '15px 20px', // Increased padding for a more spacious look
            borderRadius: '8px', // More pronounced rounded corners
            border: '1px solid #d9534f', // Darker border for contrast
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // More prominent shadow
            background: 'linear-gradient(45deg, red, darkred)', // Gradient background
            transition: 'transform 0.2s, box-shadow 0.2s', // Smooth animation on hover
            ':hover': {
              transform: 'scale(1.05)', // Slight scaling on hover
              boxShadow: '0 6px 12px rgba(0,0,0,0.3)', // Increased shadow on hover
            },
          }}
        >
          {errorMessage}
        </div>
        )}

        <div className="row">
          <div className="col-lg-12 col-md-12 col-12 mb-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1"><i className="bi-person custom-icon"></i></span>
              <input type="text" name="username" id="username" className="form-control" placeholder="Email or Username" required />
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-12 mb-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon2"><i className="bi bi-lock"></i></span>
              <input type="password" name="password" id="password" className="form-control" placeholder="Password" required />
            </div>
          </div>
          <div className="col-lg-12 col-12 mb-3">
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </div>
          <div className="col-lg-12 col-12">
            <div className="d-flex justify-content-between align-items-center mt-4">
              <a href="/register" className="text-white mb-0">Register</a>
              <a href="/resetpassword" className="text-white mb-0">Reset password</a>
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

export default LoginForm1;
