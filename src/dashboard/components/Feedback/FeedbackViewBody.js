import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Link, useParams } from 'react-router-dom';
import './css/style.css';
import profilePhotoMale from '../../assets/img/male.png';
import profilePhotoFemale from '../../assets/img/female.png';

const FeedbackViewBody = () => {
  const { feedbackId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message


  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user) {
      getApplicationById();
    }
  }, [user]);

  const getApplicationById = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/getfeedbackbyid/${feedbackId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setApplication(userData);
        const user1 = await fetchUserById(userData.poster);
        setApplicant(user1);
        setLoading(false);
      } else {
        //window.location.href = `/dashboard/feedback/list`;
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      window.location.href = `/dashboard/feedback/list`;
    }
  };

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
        window.location.href = `/dashboard/feedback/list`;
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
    
  
  const acceptApplication = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/acceptfeedback/${application.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        window.location.href = `/dashboard/feedback/list/${application.id}`;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Set the error message in the state
      }
    } catch (error) {
      setErrorMessage('An error occured while doing this operation. Please try later.');
    }
  };
  const declineApplication = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/declinefeedback/${application.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (response.ok) {
        window.location.href = `/dashboard/feedback/list/${application.id}`;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Set the error message in the state
      }
    } catch (error) {
      setErrorMessage('An error occured while doing this operation. Please try later.');

    }
  };

  if (!user || loading) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let profilePhoto;
  if (!user.photo)
    profilePhoto = user.gender === 'Male' ? profilePhotoMale : profilePhotoFemale;

  const handleRejectClick = () => {
    setShowTextarea(true);
  };

  const handleCancelClick = () => {
    setShowTextarea(false);
    setRejectReason('');
  };

  const handleReasonChange = (e) => {
    setRejectReason(e.target.value);
  };

  const handleSubmitClick = () => {
    declineApplication();
    // Submit the reject reason logic here
    setShowTextarea(false);
  };
  const handleAcceptClick= ()=>{
    acceptApplication();
  }

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px', padding: '20px' }}>
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center' }}>Application status</h2>
          </div>
          <div className="col-md-12">
            <h6 style={{ textAlign: 'center' }}>{application.status}</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
          {errorMessage && ( // Conditionally render the error message
                            <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                              {errorMessage}
                            </div>
                          )}
            <div className="panel-body text-center">
              {!user.photo && (
                <img
                  src={profilePhoto}
                  style={{ width: '200px', height: '200px' }}
                  className="img-circle profile-avatar"
                  alt="User avatar"
                />
              )}
              {user.photo && (
                <img
                  src={`http://localhost:5000/uploads/profilephoto/${user.photo}`}
                  style={{ width: '200px', height: '200px' }}
                  className="img-circle profile-avatar"
                  alt="User avatar"
                />
              )}
            </div>
            {applicant && (
              <div className="col-sm-10 text-center" style={{ marginLeft: '91px' }}>
                <Link to={`/dashboard/profile/${applicant.id}`}>
                  <p style={{ fontSize: 19, marginTop: -20 }}>
                    {applicant.first_name} {applicant.last_name}
                  </p>
                </Link>
              </div>
            )}
            {application && (
              <div className="col-sm-10 text-center" style={{ marginLeft: '91px' }}>
               
                  <p style={{ fontSize: 19, marginTop: -20 }}>{application.feedback_text}</p>
              
              </div>
            )}
            <div style={{ marginLeft: "395px" }}>
            {application.status ==="Pending" && (
              <React.Fragment>
              <button className='view-button' style={{ width: "100px" }} onClick={handleAcceptClick}>Accept</button>
              <button className='view-button' style={{ width: "100px" }} onClick={handleRejectClick}>Reject</button>
              </React.Fragment>
            )};
             {application.reason && (
              <React.Fragment>
                <div className="col-sm-10 text-center" style={{ marginLeft: '-138px' }}>
              <p>Reason of rejection : {application.reason}</p>
              </div>
              </React.Fragment>
            )};
            </div>
            {showTextarea && (
              <div className="overlay">
                <div className="textarea-container">
                  <textarea
                    value={rejectReason}
                    onChange={handleReasonChange}
                    placeholder="Enter the reason for rejection"
                    rows="4"
                    cols="50"
                  />
                  <div className="button-container">
                    <button className='view-button' onClick={handleCancelClick}>Cancel</button>
                    <button className='view-button'  style={{marginRight:'90px'}} onClick={handleSubmitClick}>Submit</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>  
  );
};

export default FeedbackViewBody;
