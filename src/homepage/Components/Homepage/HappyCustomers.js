import React, { useContext, useState, useEffect } from 'react';
//import './js/owl.carousel.min.js';
import profilePhotoMale from '../../images/avatar/male.png';
import profilePhotoFemale from '../../images/avatar/female.png';

const ReviewsSection = () => {
  const token = localStorage.getItem('token');  // Retrieve the token from local storage
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      fetchApplications();
    
  }, []);
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/getuserbyid/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/feedback/getfeedbacksforhomepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
       
      });
      if (response.ok) {
        const data = await response.json();
        const applicationsWithUserData = await Promise.all(data['applications'].map(async (app) => {
          const applicantData = await fetchUserById(app.poster);
          return { ...app, applicantData };
        }));
        setApplications(applicationsWithUserData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching pending diseases:', error);
      setLoading(false);
    }
  };

  return (
    <section className="reviews-section section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12">
            <h2 className="text-center mb-5">Latest FeedBacks</h2>

            <div className="owl-carousel owl-theme reviews-carousel">
            {applications.map((disease, index) => (
              <div className="reviews-thumb">
              <div className="reviews-info d-flex align-items-center">
                <img
                  src={profilePhotoFemale}
                  className="avatar-image img-fluid"
                  alt="Susan L"
                />

                <div className="d-flex align-items-center justify-content-between flex-wrap w-100 ms-3">
                  <p className="mb-0">
                    <strong>{disease.applicantData?.first_name} </strong>
                    <small>{disease.applicantData?.role}</small>
                  </p>
                  <div className="reviews-icons">
                      {Array.from({ length: disease.stars }, (_, index) => (
                        <i className="bi-star-fill" key={index}></i>
                      ))}
                  </div>
                </div>
              </div>

              <div className="reviews-body">
                <img src="images/left-quote.png" className="quote-icon img-fluid" alt="Quote Icon" />

                <h4 className="reviews-title">
                  {disease.feedback_text}
                </h4>
              </div>
            </div>
                  
                    ))}

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;