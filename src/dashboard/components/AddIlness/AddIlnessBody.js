import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import './css/style.css';

const AddIlnessBody = () => {
  const { user, loading1 } = useContext(UserContext);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disease, setDisease] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/diseases/getsymptoms')
      .then(response => response.json())
      .then(data => {
        const symptomsArray = data.split(','); // Split the comma-separated string into an array
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
    // Assuming selectedSymptoms is an array
console.log('Selected Symptoms:', selectedSymptoms);

// Convert user.id to string and add it to the array
selectedSymptoms.push(String(user.id)); // or selectedSymptoms.push(user.id.toString());

    fetch('http://localhost:5000/api/diseases/finddiseases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms: selectedSymptoms }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Diseases found:', data);
      setDisease(data);
      // Handle the response data as needed
    })
    .catch(error => {
      console.error('Error finding diseases:', error);
    });
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

  if (loading) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>Choose your symptoms</h2>
              <h5>Loading symptoms data...</h5>
              {/* You can add a spinner or loading indicator here */}
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
            <h2>Choose your symptoms</h2>
            <h5>Dear {user.first_name} {user.last_name}, Please choose your symptoms.</h5>
          </div>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="row">
            {symptoms.map((symptom, index) => (
              <div className="col-md-4" key={index}>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      value={symptom} 
                      onChange={handleCheckboxChange} 
                    /> {symptom}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-12">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>
          
         
        </form>
        <hr/>
        <h4 id="diseaseName"> {disease} </h4>
      </div>
    </div>
  );
};

export default AddIlnessBody;
