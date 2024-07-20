import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../UserContext';
import { Link, useNavigate } from 'react-router-dom';

const UsersBody = () => {
  const history = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading1 } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [diseasesPerPage] = useState(10); // Number of diseases to display per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/getallusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        console.log(data);
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
    const fullName = `${application.first_name} ${application.last_name}`.toLowerCase();
    const email = application.email.toLowerCase();
    const role = application.role.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower) || role.includes(searchLower);
  });

  const currentDiseases = filteredApplications.slice(indexOfFirstDisease, indexOfLastDisease);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px', padding: '20px' }}>
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center' }}>Applications List</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Applications </h3>
            <input
              type="text"
              placeholder="Search by name, email, or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'top' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Full name</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Last login</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDiseases.map((disease, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'top' }}>{disease.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.first_name +' '+ disease.last_name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.email}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.role}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.last_login}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <Link to={`/dashboard/profile/${disease.id}`}>
                        <button style={{ backgroundColor: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', color: '#337ab7' }}>View profile</button>
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
            <ul className="pagination" style={{ display: 'flex', justifyContent: 'center' }}>
              {Array.from({ length: Math.ceil(filteredApplications.length / diseasesPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} style={{ margin: '0 5px' }}>
                  <button className="page-link" onClick={() => paginate(index + 1)} style={{ padding: '5px 10px', border: '1px solid #ddd', backgroundColor: currentPage === index + 1 ? '#007bff' : '#fff', color: currentPage === index + 1 ? '#fff' : '#007bff', cursor: 'pointer' }}>
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

export default UsersBody;
