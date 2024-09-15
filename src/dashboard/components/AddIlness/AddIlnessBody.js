import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';

const AddIlnessBody = () => {
  const { user, loading1 } = useContext(UserContext);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disease, setDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/diseases/getsymptoms')
      .then(response => response.json())
      .then(data => {
        const symptomsArray = data.split(',');
        setSymptoms(symptomsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching symptoms:', error);
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, value]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom !== value));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    selectedSymptoms.push(String(user.id));

    fetch('http://localhost:5000/api/diseases/finddiseases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms: selectedSymptoms }),
    })
      .then(response => response.json())
      .then(data => {
        setDisease(data);
      })
      .catch(error => {
        console.error('Error finding diseases:', error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSymptoms = symptoms.filter(symptom => {
    // Replace underscores with spaces for the search comparison
    const formattedSymptom = symptom.replace(/_/g, ' ');
    const formattedSearchTerm = searchTerm.replace(/_/g, ' ');
    
    // Check if formatted symptom includes formatted search term
    return formattedSymptom.toLowerCase().includes(formattedSearchTerm.toLowerCase());
  });
  

  if (!user) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>SympDoctor Dashboard</h2>
              <h5>Loading user data...</h5>
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
              <h2>Choose your symptoms</h2>
              <h5>Loading symptoms data...</h5>
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
          <div className="col-md-12">
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Choose your symptoms</h2>
            <h5 style={{ fontSize: '18px' }}>Dear {user.first_name} {user.last_name}, please select your symptoms below.</h5>
          </div>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Search symptoms..." 
              className="form-control"
              style={{ marginBottom: '20px', fontSize: '16px', padding: '10px' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="row">
            {filteredSymptoms.map((symptom, index) => (
              <div className="col-md-4" key={index} style={{ marginBottom: '15px' }}>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value={symptom} 
                    onChange={handleCheckboxChange} 
                    id={`symptom-${index}`}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <label className="form-check-label" htmlFor={`symptom-${index}`} style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '8px' }}>
                    {symptom.replace(/_/g, ' ')}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '18px', fontWeight: 'bold' }}>Submit</button>
            </div>
          </div>
        </form>
        {disease && (
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <div 
                className="disease-box" 
                style={{ 
                  backgroundColor: '#e0f7fa', 
                  borderRadius: '12px', 
                  padding: '20px 30px', 
                  marginTop: '30px', 
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  border: '1px solid #b2ebf2',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#00796b',
                  backgroundImage: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
                  transition: 'transform 0.3s',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {disease}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddIlnessBody;
