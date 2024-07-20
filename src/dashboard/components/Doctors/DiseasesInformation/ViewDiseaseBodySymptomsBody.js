import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../UserContext';
import { useParams } from 'react-router-dom';
import './css/ViewDiseaseBodySymptomsBody.css'; // Import CSS file

const ViewDiseaseBodySymptomsBody = () => {
  const { diseaseNameParam } = useParams();
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading1 } = useContext(UserContext);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = () => {
    fetch('http://localhost:5000/api/diseases/getsymtompsbydiseasenameh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diseaseName: diseaseNameParam }),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        const symptoms = data.split(",");
        symptoms[0] = symptoms[0].replace("[","");
        symptoms[symptoms.length - 1] = symptoms[symptoms.length - 1].replace("]", "");
        for (var i = 0; i < symptoms.length; i++) {
          symptoms[i] = symptoms[i].replace(/"/g, "");
        }
        setAllSymptoms(symptoms);
      })
      .catch(error => {
        console.error('Error fetching symptoms:', error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div id="page-wrapper" className="loading-wrapper">
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
    <div  className="page-wrapper">
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12">
            <h2 className="title">{diseaseNameParam} Symptoms</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ul className="symptom-list">
              {allSymptoms.map((symptom, index) => (
                <li key={index} className="symptom-item">
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDiseaseBodySymptomsBody;
