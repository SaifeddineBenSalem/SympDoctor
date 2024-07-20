import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
const ChartsBody = () => {
  const { user, loading1 } = useContext(UserContext);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetch('http://localhost:5000/api/diseases/getdiseasesbyuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      .then(response => response.json())
      .then(data => {
          setDiseases(data);
          setLoading(false);
        })
      .catch(error => {
          console.error('Error fetching diseases:', error);
          setLoading(false);
        });
    }
  }, [user]); // add user as a dependency

  if (!user) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }} >
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>SympDoctor Dashboard </h2>
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

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split(' ')[0].split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const allYears = Array.from(new Set(diseases.map(disease => parseDate(disease.date).getFullYear())));
  allYears.unshift('All');

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filteredDiseases = selectedYear === 'All'
    ? diseases
    : diseases.filter(disease => parseDate(disease.date).getFullYear().toString() === selectedYear);

  const diseaseCounts = {};
  const diseasesByYear = {};

  filteredDiseases.forEach(disease => {
    const year = parseDate(disease.date).getFullYear();
    if (diseaseCounts[disease.disease]) {
      diseaseCounts[disease.disease]++;
    } else {
      diseaseCounts[disease.disease] = 1;
    }

    if (diseasesByYear[year]) {
      if (diseasesByYear[year][disease.disease]) {
        diseasesByYear[year][disease.disease]++;
      } else {
        diseasesByYear[year][disease.disease] = 1;
      }
    } else {
      diseasesByYear[year] = { [disease.disease]: 1 };
    }
  });

  const chartData = Object.keys(diseaseCounts).map(disease => ({
    name: disease,
    value: diseaseCounts[disease],
  }));

  const barChartData = Object.keys(diseasesByYear).map(year => ({
    year,
    ...diseasesByYear[year],
  }));

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const COLORS = chartData.map(() => getRandomColor());

  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px' }} >
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12" style={{ marginLeft: '479px' }}>
            <h2>Charts</h2>
          </div>
        </div>
        <div className="row" style={{ marginLeft: '200px',marginTop: '50px',marginBottom: '90px' }}>
          <div className="col-md-4">
            <label htmlFor="yearSelect">Select Year:</label>
            <select id="yearSelect" value={selectedYear} onChange={handleYearChange} className="form-control">
              {allYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <hr />
        <div className="row" style={{ marginLeft: '200px' }}>
          <div className="container bootstrap snippets bootdeys">
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                cx={200}
                cy={200}
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value }) => `${name}: ${value}`}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => `${name}: ${value}`} />
            </PieChart>
          </div>
        </div>
        <hr style={{marginBottom:'100px'}} />
        <div className="row" style={{ marginLeft: '200px' }}>
          <div className="container bootstrap snippets bootdeys">
            <BarChart width={600} height={300} data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(diseaseCounts).map((disease, index) => (
                <Bar key={disease} dataKey={disease} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </div>
        </div>
       
        
      </div>
    </div>
  );
};

export default ChartsBody;
