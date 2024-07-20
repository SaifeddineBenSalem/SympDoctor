
import React, { useContext, useState, useEffect } from 'react';

const Categories = () => {
  const [applications, setApplications] = useState([]);
  useEffect(() => {
      fetchApplications();
  }, []);
  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/diseases/getdiseasesofclients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        console.log(data);
      } 
    } catch (error) {
      console.error('Error fetching pending diseases:', error);
    }
  };

  return (
    <section style={{backgroundColor:'#f5f5f5',marginTop:'5%',width:'90%',marginLeft:'5%',borderRadius:'20px'}} className="categories-section section-padding" id="categories-section">
      <div className="container">
        <div className="row justify-content-center align-items-center">

          <div className="col-lg-12 col-12 text-center">
            <h2 className="mb-5">Most Popular Diseases Checked by <span>SympDoctor</span></h2>
          </div>
          {applications.slice(0, 5).map((disease, index) => (
              <div key={index} className="col-lg-2 col-md-4 col-6">
                <div className="categories-block">
                  <a href="#" className="d-flex flex-column justify-content-center align-items-center h-100">
                    <i src="https://img.icons8.com/ios-filled/50/000000/inhaler.png" alt="Asthma Icon"></i>
                    <small style={{fontSize:'20px'}} className="categories-block-title">{disease.disease}</small>
                    <div className="categories-block-number d-flex flex-column justify-content-center align-items-center">
                      <span style={{fontSize:'12px'}} className="categories-block-number-text">{disease.count}</span>
                    </div>
                  </a>
                </div>
              </div>
            ))}
            {applications.length == 0 && ( // Conditionally render the error message
 <h5 className="mb-5 text-center">                           No data is inputted yet
 </h5>   
                          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
