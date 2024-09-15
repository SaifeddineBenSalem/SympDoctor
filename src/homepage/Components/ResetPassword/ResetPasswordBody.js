import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordBody = () => {
  const [stage, setStage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous error message
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/users/getuserbyemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error occurred');
      }

      const user = await response.json();
      setUserEmail(data.email);
      setUserData(user);
      setStage(2);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'User does not exist');
    }
  };

  const handleSecurityQuestionSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous error message
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/users/verifysecurityquestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, question: data.security_question, answer: data.answer }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error occurred');
      }

      setStage(3);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Security question or answer is incorrect');
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous error message
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error occurred');
      }

      alert('Password reset successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Error resetting password');
    }
  };

  return (
    <section className="hero-section d-flex justify-content-center align-items-center">
      <div className="section-overlay"></div>
      <div className="container" style={{ width: '600px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-12 col-12">
            <form className="custom-form hero-form" onSubmit={stage === 1 ? handleEmailSubmit : stage === 2 ? handleSecurityQuestionSubmit : handlePasswordSubmit} method="post">
              <h3 className="text-white mb-3 text-center">{stage === 1 ? 'Reset Password' : stage === 2 ? 'Security Question' : 'Set New Password'}</h3>
              {errorMessage && (
                <div
                  id="error-message"
                  className="col-12"
                  style={{
                    color: 'white',
                    backgroundColor: 'red',
                    fontSize: '16px',
                    marginTop: '20px',
                    marginBottom: '20px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: '1px solid #d9534f',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    background: 'linear-gradient(45deg, red, darkred)',
                    textAlign: 'center',
                  }}
                >
                  {errorMessage}
                </div>
              )}
              {stage === 1 && (
                <>
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi-person custom-icon"></i></span>
                    <input type="text" name="email" id="email" className="form-control" placeholder="Email or Username" required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Next</button>
                </>
              )}
              {stage === 2 && (
                <>
                  <div className="input-group mb-3">
                    <select id="security_question" name="security_question" className="form-select" required>
                      <option value="">Select security question</option>
                      <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                      <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                      <option value="What is the name of the street you grew up on?">What is the name of the street you grew up on?</option>
                      <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                      <option value="What was your first car?">What was your first car?</option>
                      <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                      <option value="What is your favorite food?">What is your favorite food?</option>
                      <option value="In what city were you born?">In what city were you born?</option>
                      <option value="What is your favorite movie?">What is your favorite movie?</option>
                      <option value="What is your best friend's name?">What is your best friend's name?</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type="text" name="answer" id="answer" className="form-control" placeholder="Answer" required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Next</button>
                </>
              )}
              {stage === 3 && (
                <>
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type="password" name="password" id="password" className="form-control" placeholder="New Password" required />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" placeholder="Confirm Password" required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordBody;
