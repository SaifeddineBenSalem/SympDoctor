import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';

const AddDisease = () => {
  const { user, loading1 } = useContext(UserContext);
  const [existDisease, setExistDisease] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disease, setDisease] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [inputs, setInputs] = useState([{ value: '' }]);
  const token = localStorage.getItem('token');  // Retrieve the token from local storage

  const [diseaseName, setDiseaseName] = useState(null);
  const [showForm, setShowForm] = useState(true); // State to control form visibility
  const [showForm1, setShowForm1] = useState(false); // State to control form visibility
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

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

  const handleAddInput = () => {
    setInputs([...inputs, { value: '' }]);
  };

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].value = event.target.value;
    setInputs(newInputs);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, value]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom !== value));
    }
  };

  const handleSubmitSymtoms = (event) => {
    event.preventDefault();
    console.log('Selected Symptoms:', selectedSymptoms);
    setShowForm1(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    setDiseaseName(data.diseasename);
    fetch('http://localhost:5000/api/diseases/finddiseasebynameaddingdisease', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diseasename: data.diseasename }), // Adjust based on how you collect diseasename from the form
    })
      .then(response => response.json())
      .then(data => {
        console.log('Diseases found:', data);
        if (data.exists) {
          // Handle the case when the disease already exists
          setExistDisease(true);
          setErrorMessage(data.message);
        } else {
          // Handle the case when the disease does not exist
          setExistDisease(false);
          setDisease({ found: false, message: data.message });
          setShowForm(false); // Hide the current form
        }
      })
      .catch(error => {
        console.error('Error finding diseases:', error);
      });
  };

  const handleFinalSubmit = (event) => {
    event.preventDefault();
    const inputData = inputs.map(input => input.value);
    const inputData1 = inputData.concat(selectedSymptoms);
    
    console.log('Final Inputs:', inputData1);
    console.log('D',diseaseName);
    fetch('http://localhost:5000/api/diseases/adddisease', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ diseasename1:diseaseName, symptoms: inputData1,userId:user.id }),
    })
      .then(response => response.json())
      .then(data => {
        
        console.log('Response from final submission:', data);
        window.location.href = `/dashboard/doctors/add`;

        // Handle the response after submission
      })
      .catch(error => {
        console.error('Error submitting final data:', error);
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
              <h5>Loading disease data...</h5>
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
            <h2>Add your disease</h2>
            {showForm1 ? (
              <h5>Last step of confirming the disease: {diseaseName}</h5>
            ) : (
              <React.Fragment>
                {showForm ? (
                  <h5>Write the disease name:</h5>
                ) : (
                  <h5>You are trying to add the disease named as: {diseaseName}</h5>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
        <hr />
        {existDisease && (
          <div className="alert alert-danger" style={{ fontSize: 20 }}>
            {errorMessage}
          </div>
        )}
        {showForm1 ? (
          <React.Fragment>
            <h5>Last step of confirming the disease: {diseaseName}</h5>
            <form style={{ marginLeft: 350, marginTop: 40 }} onSubmit={handleFinalSubmit}>
              {inputs.map((input, index) => (
                <div key={index}>
                  <input
                    type="text"
                    style={{
                      padding: 10,
                      fontSize: 16,
                      border: "1px solid #ccc",
                      borderRadius: 5,
                      width: 300,
                    }}
                    value={input.value}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </div>
              ))}
              <div style={{ position: "relative" }}>
                <button
                  style={{
                    right: 40,
                    bottom: 0,
                    padding: 5,
                    fontSize: 16,
                    border: "none",
                    borderRadius: 5,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    cursor: "pointer",
                    height: 40,
                    width: 80,
                  }}
                  type="submit"
                >
                  Submit
                </button>
                <button
                  style={{
                    marginLeft: 188,
                    right: 0,
                    bottom: 0,
                    padding: 5,
                    fontSize: 16,
                    border: "none",
                    borderRadius: 5,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    cursor: "pointer",
                    height: 40,
                    width: 40,
                  }}
                  type="button"
                  onClick={handleAddInput}
                >
                  +
                </button>
              </div>
            </form>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {showForm ? (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <textarea type="text" id="diseasename" name="diseasename" className="form-control" style={{ fontSize: 20 }}></textarea>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-primary" style={{ fontSize: 20 }}>Submit</button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <h6 style={{ marginBottom: 20 }}>As a first step, select the existent symptoms that reflect this disease</h6>
                <form onSubmit={handleSubmitSymtoms}>
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
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default AddDisease;