import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const AddDisease = () => {
  const { user, loading1 } = useContext(UserContext);
  const [existDisease, setExistDisease] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disease, setDisease] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [inputs, setInputs] = useState([{ value: '' }]);
  const token = localStorage.getItem('token');  // Retrieve the token from local storage
  const [searchTerm, setSearchTerm] = useState('');

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
  const fetchIdOfPendingDisease = async (newDiseaseName) => {
    try {
      const response = await fetch('http://localhost:5000/api/diseases/getidofpendingdiseasebyname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diseasename2 : newDiseaseName }),
      });
      const data = await response.json();
      console.log('Additional data:', data);
      console.log(diseaseName);
      // Process the data as needed
      // For example, update state or handle errors
      return data.id;
    } catch (error) {
      console.error('Error fetching additional data:', error);
      // Handle the error, e.g., set an error message state
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const newDiseaseName = data.diseasename;
    
    setDiseaseName(newDiseaseName);
    
    const response = await fetch('http://localhost:5000/api/diseases/finddiseasebynameaddingdisease', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diseasename: newDiseaseName }),
    });
    
    const result = await response.json();
    console.log('Diseases found:', result);
  
    if (result.exists) {
      setExistDisease(true);
      if (result.message === 'Disease found in the final dataset.') {
        setErrorMessage(
          <div>
            {result.message} <Link to={`/dashboard/doctors/diseases/${newDiseaseName}`} target="_blank">
              Click here to view more details
            </Link>
          </div>
        );
      } else {
        const id = await fetchIdOfPendingDisease(newDiseaseName);
        console.log(id);
        setErrorMessage(
          <div>
            {result.message} <Link to={`/dashboard/doctors/pending/review/${id}`} target="_blank">
              Click here to view more details
            </Link>
          </div>
        );
      }
    } else {
      setExistDisease(false);
      setDisease({ found: false, message: result.message });
      setShowForm(false);
    }
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
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Add your disease</h2>
          {showForm1 ? (
              <h5 style={{ fontSize: '18px' }}>Last step of confirming the disease: {diseaseName}</h5>
            ) : (
              <React.Fragment>
                {showForm ? (
                <h5 style={{ fontSize: '18px' }}>Write the disease name:</h5>
                ) : (
                  <h5 style={{ fontSize: '18px' }}>You are trying to add the disease named as: {diseaseName}</h5>
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
          <Form onSubmit={handleFinalSubmit} style={{marginLeft:20}}>
      {inputs.map((input, index) => (
        <InputContainer key={index}>
          <Input
            type="text"
            value={input.value}
            onChange={(event) => handleInputChange(index, event)}
          />
        </InputContainer>
      ))}
      <ButtonContainer>
        <SubmitButton type="submit">
          Submit
        </SubmitButton>
        <AddButton type="button" onClick={handleAddInput}>
          +
        </AddButton>
      </ButtonContainer>
    </Form>
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
                <form onSubmit={handleSubmitSymtoms}>
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
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const rotateIn = keyframes`
  from {
    transform: rotate(-360deg);
    opacity: 0;
  }
  to {
    transform: rotate(0);
    opacity: 1;
  }
`;

const Form = styled.form`
  margin-left: 350px;
  margin-top: 40px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  animation: ${fadeIn} 1s ease-out;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
  animation: ${slideDown} 0.5s ease-out;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  height: 40px;
  width: 100px;
  transition: all 0.3s ease;
  animation: ${slideUp} 0.5s ease-out;

  &:hover {
    background-color: #45a049;
  }
`;

const AddButton = styled.button`
  padding: 10px;
  font-size: 20px;
  border: none;
  border-radius: 50%;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  height: 40px;
  width: 40px;
  margin-left: 20px;
  transition: all 0.3s ease;
  animation: ${rotateIn} 0.5s ease-out;

  &:hover {
    background-color: #45a049;
  }
`;


export default AddDisease;