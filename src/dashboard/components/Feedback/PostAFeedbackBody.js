import React, { useState,useContext,useRef,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';

import './css/style.css';

const FeedbackForm = () => {
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
  const [doneMessage, setDoneMessage] = useState(''); // Add state for error message
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const token = localStorage.getItem('token');  // Retrieve the token from local storage
  const { user, loading } = useContext(UserContext);
 

  const postAFeedback = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({feedbackOfUser: feedback,ratingOfUser:rating }),
      });
  
      if (response.ok) {
        setDoneMessage("Your feedback has been submitted and is currently awaiting approval from our administration team.")
        setErrorMessage('');
      } else {
        const errorData = await response.json(); // Parse the response body
        setErrorMessage(errorData.message); // Set the error message in the state
        setDoneMessage('');
      }
    } catch (error) {
      console.error('Error posting the feedback:', error);
      setErrorMessage('An error occurred while posting the feedback.'); // Set a generic error message
      setDoneMessage('');
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback:', feedback);
    setFeedback(feedback);
    setRating(rating);
    console.log('Rating:', rating);
    postAFeedback();
    // Add your form submission logic here
  };

  if (!user) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>SympDoctor Dashboard</h2>
              <h5>Loading user data...</h5>
              {/* You can add a spinner or loading indicator here */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px' }} >
        {errorMessage && ( // Conditionally render the error message
                            <div className="alert alert-danger" style={{ marginTop: '10px',fontSize:"15px" }}>
                              {errorMessage}
                            </div>
                          )}
               {doneMessage && ( // Conditionally render the error message
                            <div className="alert alert-success" style={{ marginTop: '10px',fontSize:"15px" }}>
                              {doneMessage}
                            </div>
                          )}
      <div className="row">
        
        <div className="container-fluid py-5 bg-light">
          
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center">Post your feedback</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="feedback">Feedback:</label>
                    <textarea
                      id="feedback"
                      className="form-control"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows="4"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating:</label>
                    <div className="star-rating">
                      {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                          <button
                            type="button"
                            key={index}
                            className={index <= rating ? 'on' : 'off'}
                            onClick={() => setRating(index)}
                          >
                            <span className="star">&#9733;</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block mt-4">
                    Submit
                  </button>
                </form>
                <div className="text-center mt-4">
                  <Link to="/dashboard/feedback/list" className="btn btn-secondary">
                    View list of feedbacks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default FeedbackForm;