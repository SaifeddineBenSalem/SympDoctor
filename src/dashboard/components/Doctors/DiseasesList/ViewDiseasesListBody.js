import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../UserContext';
import { Link, useParams } from 'react-router-dom';
import './css/style.css'; // Import CSS file

const ViewDiseasesListBody = () => {
  const [allDiseases, setAllDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading1 } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [diseasesPerPage] = useState(19); // Number of diseases to display per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term state


  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = () => {
    fetch('http://localhost:5000/api/diseases/getalldiseases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ /* data to send in the body */ }),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);

        const diseaseNames = data.split(",");
        diseaseNames.pop();
        setAllDiseases(diseaseNames);
      })
      .catch(error => {
        console.error('Error fetching pending diseases:', error);
        setLoading(false);
      });
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
  }

  const indexOfLastDisease = currentPage * diseasesPerPage;
  const indexOfFirstDisease = indexOfLastDisease - diseasesPerPage;
  const filteredApplications = allDiseases.filter(application => {
    const fileName = application.toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    return fileName.includes(searchLower);
  });
  const currentDiseases = filteredApplications.slice(indexOfFirstDisease, indexOfLastDisease);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px', padding: '20px' }}>
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center' }}>Disease List</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Pending Diseases</h3>
            <input
              type="text"
              placeholder="Search by file name, applicant, posting date, or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'top' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd',width:'20%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDiseases.map((disease, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'top' }}>{indexOfFirstDisease + index + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <Link to={`/dashboard/doctors/diseases/${disease}`}>
                        <button className='view-button'>View</button>
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

export default ViewDiseasesListBody;
