import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../UserContext';
import { Link } from 'react-router-dom';

const PendingBody = () => {
  const { user, loading1 } = useContext(UserContext);
  const [pendingDiseases, setPendingDiseases] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [diseasesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPendingDiseases();
  }, []);

  const fetchPendingDiseasesFromDataBase = (name) => {
    fetch('http://localhost:5000/api/diseases/getpendingdiseasesdb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nameD: name }),
    })
      .then(response => response.json())
      .then(data => {
        setPendingDiseases(prevDiseases => {
          const isDuplicate = prevDiseases.some(disease => disease.id === data.id);
          if (!isDuplicate) {
            return [...prevDiseases, data];
          }
          return prevDiseases;
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pending diseases:', error);
        setLoading(false);
      });
  };

  const fetchPendingDiseases = () => {
    fetch('http://localhost:5000/api/diseases/getpendingdiseases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ /* data to send in the body */ }),
    })
      .then(response => response.json())
      .then(data => {
        const diseaseNames = data.split(",");
        diseaseNames.forEach(name => {
          fetchPendingDiseasesFromDataBase(name);
        });
      })
      .catch(error => {
        console.error('Error fetching pending diseases:', error);
        setLoading(false);
      });
  };

  const indexOfLastDisease = currentPage * diseasesPerPage;
  const indexOfFirstDisease = indexOfLastDisease - diseasesPerPage;
  const filteredApplications = pendingDiseases.filter(application => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (application.id?.toString().toLowerCase().includes(searchLower)) ||
      (application.name?.toLowerCase().includes(searchLower)) ||
      (typeof application.poster === 'string' && application.poster.toLowerCase().includes(searchLower)) ||
      (application.posting_date?.toLowerCase().includes(searchLower)) ||
      (application.status?.toLowerCase().includes(searchLower)) ||
      (application.count?.toString().toLowerCase().includes(searchLower))
    );
  });
  

  const currentDiseases = filteredApplications.slice(indexOfFirstDisease, indexOfLastDisease);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12" >
            <h2 style={{ textAlign: 'center' }}>Pending Diseases</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginTop: '20px' }}>Pending Diseases</h3>
            <input
              type="text"
              placeholder="Search by file name, applicant, posting date, or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Poster</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Posting Date</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDiseases.map((disease, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.poster}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.posting_date}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{disease.status}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <Link to={`/dashboard/doctors/pending/review/${disease.id}`}>
                        <button style={{ backgroundColor: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', color: '#337ab7' }}>Action</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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

        <hr style={{ margin: '20px 0' }} />
      </div>
    </div>
  );
};

export default PendingBody;
