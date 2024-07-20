import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Link, useNavigate } from 'react-router-dom';

const ListApplicationsBody = () => {
  const history = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading1 } = useContext(UserContext);
  const token = localStorage.getItem('token');  // Retrieve the token from local storage

  const [currentPage, setCurrentPage] = useState(1);
  const [diseasesPerPage] = useState(10); // Number of diseases to display per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

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
      const response = await fetch('http://localhost:5000/api/feedback/getfeedbacks', {
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
        if (response.status === 400) {
          history('/', { replace: true });
        } else {
          history('/', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error fetching pending diseases:', error);
      setLoading(false);
    }
  };

  if (!user) {
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
  }

  const indexOfLastDisease = currentPage * diseasesPerPage;
  const indexOfFirstDisease = indexOfLastDisease - diseasesPerPage;

  // Filter applications based on search term
  const filteredApplications = applications.filter(application => {
    const feedbackText = application.feedback_text.toLowerCase();
    const posterName = `${application.applicantData?.first_name} ${application.applicantData?.last_name}`.toLowerCase();
    const postingDate = application.posting_date.toLowerCase();
    const status = application.status.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return feedbackText.includes(searchLower) || posterName.includes(searchLower) || postingDate.includes(searchLower) || status.includes(searchLower);
  });

  const currentDiseases = filteredApplications.slice(indexOfFirstDisease, indexOfLastDisease);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px', padding: '20px' }}>
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center' }}>Feedbacks List</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Feedbacks </h3>
            <input
              type="text"
              placeholder="Search by feedback, poster, posting date, or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'top' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Feedback</th>
                  {(user.role === "Admin" || user.role === "SuperAdmin") && (
                    <React.Fragment>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Poster</th>
                    </React.Fragment>
                  )}
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Posting date</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDiseases.map((disease, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'top' }}>{indexOfFirstDisease + index + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.feedback_text}</td>
                    {(user.role === "Admin" || user.role === "SuperAdmin") && (
                      <React.Fragment>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <Link to={`/dashboard/profile/${disease.applicantData?.id}`} >{disease.applicantData?.first_name +' '+ disease.applicantData?.last_name}
                          </Link>
                        </td>
                      </React.Fragment>
                    )}
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.posting_date}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.status}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <Link to={`/dashboard/feedback/list/${disease.id}`}>
                        <button style={{ backgroundColor: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', color: '#337ab7' }}>View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-md-12">
            <ul className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, listStyleType: 'none' }}>
              {Array.from({ length: Math.ceil(filteredApplications.length / diseasesPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} style={{ margin: '0 5px' }}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(index + 1)} 
                    style={{ 
                      padding: '10px 15px', 
                      border: '1px solid #ddd', 
                      borderRadius: '50%', 
                      backgroundColor: currentPage === index + 1 ? '#007bff' : '#fff', 
                      color: currentPage === index + 1 ? '#fff' : '#007bff', 
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListApplicationsBody;
