import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../UserContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import customGeoJSON from './js/custom.geo.json';

const monthNames = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ChartsBody = () => {
  const { user } = useContext(UserContext);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetch('http://localhost:5000/api/diseases/getalldiseasesdb', {
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
  }, [user]);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split(' ')[0].split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const allYears = Array.from(new Set(diseases.map(disease => parseDate(disease.date).getFullYear())));
  allYears.unshift('All');

  const allMonths = monthNames;

  const allCountries = Array.from(new Set(diseases.map(disease => disease.country)));
  allCountries.unshift('All');

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const filteredDiseases = diseases.filter(disease => {
    const diseaseYear = parseDate(disease.date).getFullYear().toString();
    const diseaseMonth = (parseDate(disease.date).getMonth() + 1).toString();
    const isYearMatch = selectedYear === 'All' || diseaseYear === selectedYear;
    const isMonthMatch = selectedMonth === 'All' || diseaseMonth === (monthNames.indexOf(selectedMonth)).toString();
    const isCountryMatch = selectedCountry === 'All' || disease.country === selectedCountry;
    return isYearMatch && isMonthMatch && isCountryMatch;
  });

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

  const countryDiseaseCounts = {};
  filteredDiseases.forEach(disease => {
    if (countryDiseaseCounts[disease.country]) {
      if (countryDiseaseCounts[disease.country][disease.disease]) {
        countryDiseaseCounts[disease.country][disease.disease]++;
      } else {
        countryDiseaseCounts[disease.country][disease.disease] = 1;
      }
    } else {
      countryDiseaseCounts[disease.country] = { [disease.disease]: 1 };
    }
  });

  const mostPrevalentDiseaseByCountry = Object.keys(countryDiseaseCounts).map(country => {
    const diseaseEntries = Object.entries(countryDiseaseCounts[country]);
    const mostPrevalentDisease = diseaseEntries.reduce((prev, current) => (current[1] > prev[1] ? current : prev));
    return {
      country,
      disease: mostPrevalentDisease[0],
      cases: mostPrevalentDisease[1],
    };
  });

  const colorScale = scaleQuantize()
    .domain([0, Math.max(...mostPrevalentDiseaseByCountry.map(d => d.cases))])
    .range(['#ffedea', '#ffcec5', '#ffad9f', '#ff8a75', '#ff5533', '#e2492d', '#be3d26', '#9a311f', '#782618']);

  return (
    <div className="container" style={{ position: 'relative' }}>
      <div className="row">
        <div className="col-md-3">
          <label>Year:</label>
          <select value={selectedYear} onChange={handleYearChange}>
            {allYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label>Month:</label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {allMonths.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label>Country:</label>
          <select value={selectedCountry} onChange={handleCountryChange}>
            {allCountries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr />
      <div>
        <div className="row" style={{ marginLeft: '200px' }}>
          <div className="container bootstrap snippets bootdeys">
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value, name) => `${name}: ${value}`} />
            </PieChart>
          </div>
        </div>
        <hr style={{ marginBottom: '100px' }} />
        <div className="row" style={{ marginLeft: '200px' }}>
          <div className="container bootstrap snippets bootdeys">
            <BarChart width={600} height={300} data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {Object.keys(diseaseCounts).map((disease, index) => (
                <Bar key={disease} dataKey={disease} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </div>
        </div>
        <hr style={{ marginBottom: '100px' }} />
        <div className="row">
          <div className="container bootstrap snippets bootdeys" style={{ position: 'relative' }}>
            <ComposableMap>
              <Geographies geography={customGeoJSON}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const country = geo.properties.name;
                    const diseaseData = mostPrevalentDiseaseByCountry.find(d => d.country === country);
                    const color = diseaseData ? colorScale(diseaseData.cases) : '#EEE';

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={color}
                        onMouseEnter={(event) => {
                          const { name } = geo.properties;
                          const diseaseData = mostPrevalentDiseaseByCountry.find(d => d.country === name);
                          setHoveredCountry({
                            name,
                            disease: diseaseData ? diseaseData.disease : 'No data',
                            cases: diseaseData ? diseaseData.cases : 'No data',
                          });
                          setHoverPosition({
                            x: event.clientX,
                            y: event.clientY,
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredCountry(null);
                        }}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#F53', outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            {hoveredCountry && (
              <div
                className="hover-info"
                style={{
                  position: 'absolute',
                  left: `${hoverPosition.x + 10}px`,
                  top: `${hoverPosition.y + 10}px`,
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                }}
              >
                <p><strong>Country:</strong> {hoveredCountry.name}</p>
                <p><strong>Disease:</strong> {hoveredCountry.disease}</p>
                <p><strong>Cases:</strong> {hoveredCountry.cases}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsBody;
