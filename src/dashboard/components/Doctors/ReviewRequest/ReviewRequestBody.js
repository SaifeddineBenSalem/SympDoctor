import React, { useContext, useState, useEffect,useRef } from 'react';
import { UserContext } from '../../../UserContext';
import { Link, useParams } from 'react-router-dom';

const ReviewRequestBody = () => {
  const { diseaseId } = useParams();
  const [currentDisease, setCurrentPendingDisease] = useState(null);
  const { user, loading1 } = useContext(UserContext);
  const [pendingDiseases, setPendingDiseases] = useState({});
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState([]);
  
  const [alreadyHandler, setAlreadyHandler] = useState(false);
  const token = localStorage.getItem('token');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonBySuperDoctor, setRejectReasonBySuperDoctor] = useState('');

  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
  const errorRef = useRef(null); // Reference to the error message
  const [showTextarea, setShowTextarea] = useState(false);
  const [TextareaForSuperDoctor, setShowTextareaForSuperDoctor] = useState(false);

  

  useEffect(() => {
    if (errorMessage) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errorMessage]);
  
  useEffect(() => {
    fetchPendingDiseases();
  }, []);
  const fetchAlreadyHandler = () => {
    fetch('http://localhost:5000/api/diseases/verifydiseasehandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id,diseaseId: currentDisease.id }),
    })
      .then(response => response.json())
      .then(data => {
        setAlreadyHandler(data);
        console.log(alreadyHandler);
        
      })
      .catch(error => {
        console.error('Error fetching symptoms:', error);
        setLoading(false);
      });
  };
  const fetchSymptomsByDisease = (name) => {
    fetch('http://localhost:5000/api/diseases/getsymtompsbydiseasenamep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diseaseName: name }),
    })
      .then(response => response.json())
      .then(data => {
        const dataA = data.split(",");
        console.log(dataA);
        dataA[0] = dataA[0].slice(1);
        dataA[dataA.length - 1] = dataA[dataA.length - 1].substring(0, dataA[dataA.length - 1].length - 1);
        const newDataA = dataA.map(str => str.replace(/"/g, ''));
        console.log(newDataA);
        setSymptoms(newDataA);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching symptoms:', error);
        setLoading(false);
      });
  };
  const fetchSymptomsByDiseaseHandled = (name) => {
    fetch('http://localhost:5000/api/diseases/getsymtompsbydiseasenameh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diseaseName: name }),
    })
      .then(response => response.json())
      .then(data => {
        const dataA = data.split(",");
        dataA[0] = dataA[0].slice(1);
        dataA[dataA.length - 1] = dataA[dataA.length - 1].substring(0, dataA[dataA.length - 1].length - 1);
        const newDataA = dataA.map(str => str.replace(/"/g, ''));
        setSymptoms(newDataA);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching symptoms:', error);
        setLoading(false);
      });
  };
  const fetchPendingDiseases = () => {
    fetch('http://localhost:5000/api/diseases/getpendingdiseasebyid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diseaseIds: diseaseId }),
    })
      .then(response => response.json())
      .then(data => {
        setCurrentPendingDisease(data);
        console.log(data.status);
        if (data.status === "Pending" || data.status === "Rejected")
        fetchSymptomsByDisease(data.name);
        else
        fetchSymptomsByDiseaseHandled(data.name);
      //  fetchAlreadyHandler();
      })
      .catch(error => {
        console.error('Error fetching pending diseases:', error);
        setLoading(false);
      });
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/diseases/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ diseaseId: currentDisease.id,userId: user.id }),
      });
      if (response.ok) {
        window.location.href = `/dashboard/doctors/pending/review/${currentDisease.id}`;
      } else {
        const errorData = await response.json();
         // Set the error message in the state
         setErrorMessage(errorData.message);

      //  window.location.href = `/`;
      }
    } catch (error) {
      setErrorMessage('An error occured while doing this operation. Please try later.');
    }
  };

  
  const handleApproveSuperDoctor = () => {
    fetch('http://localhost:5000/api/diseases/superdoctoraccept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ diseaseId: currentDisease.id,userId: user.id }),
    })
      .then(response => response.json())
      .then(data => {
        window.location.href = `/dashboard/doctors/pending/review/${currentDisease.id}`;
        // Handle successful approval (e.g., show a message, update UI)
        console.log('Disease approved:', data);
      })
      .catch(error => {
        console.error('Error approving disease:', error);
      });
  };
  const handleCancelClickSuperDoctor = () => {
    setShowTextareaForSuperDoctor(false);
    setRejectReasonBySuperDoctor('');
  };
  const handleSubmitClickBySuperDoctor = () => {
    declineApplicationBySuperDoctor();
    // Submit the reject reason logic here
    setShowTextareaForSuperDoctor(false);
  }
  const handleReasonChangeBySuperDoctor = (e) => {
    setRejectReasonBySuperDoctor(e.target.value);
  };

  const handleCancelClick = () => {
    setShowTextarea(false);
    setRejectReason('');
  };
 
  
  const handleReasonChange = (e) => {
    setRejectReason(e.target.value);
  };
  const handleSubmitClick = () => {
    declineApplicationByDoctor();
    // Submit the reject reason logic here
    setShowTextarea(false);
  };
  
  const declineApplicationBySuperDoctor = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/diseases/disapprovebysuperdoctor/${currentDisease.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReasonBySuperDoctor }),
      });
      if (response.ok) {
        window.location.href = `/dashboard/doctors/pending/review/${currentDisease.id}`;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Set the error message in the state
      }
    } catch (error) {
      setErrorMessage('An error occured while doing this operation. Please try later.');
    }
  };
  const declineApplicationByDoctor = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/diseases/disapprovebydoctor/${currentDisease.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (response.ok) {
        window.location.href = `/dashboard/doctors/pending/review/${currentDisease.id}`;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Set the error message in the state
      }
    } catch (error) {
      setErrorMessage('An error occured while doing this operation. Please try later.');
    }
  };
 
  if (loading) {
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
  } else 
  fetchAlreadyHandler();
  const handleRejectClick = () => {
    setShowTextarea(true);
  };
  const handleDisapproveBySuperDoctor = () => {
    setShowTextareaForSuperDoctor(true);
  }

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px', padding: '20px' }}  ref={errorRef}>
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center' }}>Disease Details</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Pending Diseases</h3>
            {errorMessage && ( // Conditionally render the error message
                            <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                              {errorMessage}
                            </div>
                          )}
            {currentDisease && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Poster</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Posting Date</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Accepted count</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Refused count</th>
                    {currentDisease.reason != null && (
                     <React.Fragment>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reason</th>
                    </React.Fragment>
                  )}
                 {currentDisease.status === "Pending" && alreadyHandler == true &&  currentDisease.poster != user.id && (
                     <React.Fragment>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                    </React.Fragment>
                  )}     
                 </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{currentDisease.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{currentDisease.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{currentDisease.poster}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{currentDisease.posting_date}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{currentDisease.status}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{currentDisease.accepted_counts}</td>
                    
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <Link
                      to={`/dashboard/doctors/pending/review/reasons/${currentDisease.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#007bff', // Blue color
                        textDecoration: 'none', // Remove default underline
                        cursor: 'pointer', // Show pointer cursor on hover
                      }}
                    >
                      {currentDisease.refused_counts}
                    </Link>
                    </td>
                                    
                    {currentDisease.reason != null && (
                         <React.Fragment>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{currentDisease.reason}</td>
                         </React.Fragment>
                    )}
                    {currentDisease.poster != user.id && currentDisease.status === "Pending" && alreadyHandler == true && (
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <React.Fragment>
                          <button className="btn btn-success" style={{ padding: '10px 30px', fontSize: '10px', fontWeight: 'bold',marignLeft:'30px',marginRight:'20px' }} onClick={handleApprove}>Approve</button>
                          <button className="btn btn-danger" style={{ padding: '10px 30px', fontSize: '10px', fontWeight: 'bold',marginLeft:'-90px',float:'right' }} onClick={handleRejectClick}>Disapprove</button>
                        </React.Fragment>
                     
                    </td>
                     )}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Symptoms</h3>
            <div className="row">
          <div className="col-md-12">
            <ul className="symptom-list">
              {symptoms.map((symptom, index) => (
                <li key={index} className="symptom-item">
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        </div>
           
          </div>
        </div>

        <hr style={{ margin: '20px 0' }} />
        {user.role ==="SuperDoctor" && currentDisease.status === "Pending" && currentDisease.poster != user.id  && (
         <React.Fragment>
          <button  className="btn btn-success" style={{ padding: '10px 20px', fontSize: '18px', fontWeight: 'bold' }} onClick={handleApproveSuperDoctor}>Add</button>
          <button  className="btn btn-danger" style={{ padding: '10px 20px', fontSize: '18px', fontWeight: 'bold' }}  onClick={handleDisapproveBySuperDoctor} >Refuse </button>
          </React.Fragment>
        )}
        {TextareaForSuperDoctor && (
              <div className="overlay">
                <div className="textarea-container">
                  <textarea
                    value={rejectReasonBySuperDoctor}
                    onChange={handleReasonChangeBySuperDoctor}
                    placeholder="Enter the reason for rejection"
                    rows="4"
                    cols="50"
                  />
                  <div className="button-container">
                    <button className='view-button' onClick={handleCancelClickSuperDoctor}>Cancel</button>
                    <button className='view-button'  style={{marginRight:'90px'}} onClick={handleSubmitClickBySuperDoctor}>Submit</button>
                  </div>
                </div>
              </div>
            )}
        
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
  );
};

export default ReviewRequestBody;
