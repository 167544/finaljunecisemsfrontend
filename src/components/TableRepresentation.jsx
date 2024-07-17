import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const TableRepresentation = ({ columnname, maleEmployees, femaleEmployees, isLoadedFromDynamicEmp }) => {
  const data = useSelector((state) => state.selectedData);
  const dispatch = useDispatch(); // Define dispatch here

  console.log("M", maleEmployees);
  console.log("F", femaleEmployees);

  const graphbox = {
    borderRadius: '10px',
    height: '340px',
    width: '80%',
    padding: '1rem',
    backgroundColor: '#0A2342',
    fontFamily: 'Inter, serif',
    boxShadow: "1px 5px 5px rgba(0, 0, 0, 0.2)", // Soft shadow to avoid neon effect
    color: 'white',
    margin: '0 auto', // Center the box
  };

  const tableContainer = {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '250px', // Adjust as needed to show the scrollbar
  };

  const customTable = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '10px 0',
    fontSize: '1rem',
    textAlign: 'left',
  };

  const thStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#0A2342',
    color: 'white',
    cursor: 'pointer',
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
  };

  const trStyle = {
    backgroundColor: '#0A2342',
    color: 'white',
  };

  const trHoverStyle = {
    backgroundColor: '#005f73',
  };

  const country_codes = {
    ARM: 'Europe',
    AUS: 'Asia',
    CAN: 'North America',
    CHE: 'Europe',
    CHN: 'Asia',
    COL: 'South America',
    DEU: 'Europe',
    ESP: 'Europe',
    FRA: 'Europe',
    GBR: 'Europe',
    HKG: 'Asia',
    IND: 'Asia',
    IRL: 'Europe',
    JPN: 'Asia',
    MEX: 'North America',
    MYS: 'Asia',
    NLD: 'Europe',
    PHL: 'Asia',
    POL: 'Europe',
    PRT: 'Europe',
    ROU: 'Europe',
    USA: 'America'
  };

  const getCountsByCountry = () => {
    const counts = {};
    data.forEach((item) => {
      const country = item.Country;
      counts[country] = counts[country] ? counts[country] + 1 : 1;
    });
    return Object.entries(counts).map(([country, count]) => ({ _id: country, count }));
  };

  const getMaleCountsByCountry = () => {
    const counts = {};
    maleEmployees?.forEach((item) => {
      const country = item.Country;
      counts[country] = counts[country] ? counts[country] + 1 : 1;
    });
    return counts;
  };

  const getFemaleCountsByCountry = () => {
    const counts = {};
    femaleEmployees?.forEach((item) => {
      const country = item.Country;
      counts[country] = counts[country] ? counts[country] + 1 : 1;
    });
    return counts;
  };

  const [countryCounts, setCountryCounts] = useState(getCountsByCountry());
  const [maleCounts, setMaleCounts] = useState(getMaleCountsByCountry());
  const [femaleCounts, setFemaleCounts] = useState(getFemaleCountsByCountry());

  const [sortOrder, setSortOrder] = useState({
    Country: 'asc',
    Continent: 'asc',
    Count: 'asc'
  });

  useEffect(() => {
    setCountryCounts(getCountsByCountry());
    setMaleCounts(getMaleCountsByCountry());
    setFemaleCounts(getFemaleCountsByCountry());
  }, [data, maleEmployees, femaleEmployees]);

  const handleSort = (columnName) => {
    const newSortOrder = {
      ...sortOrder,
      [columnName]: sortOrder[columnName] === 'asc' ? 'desc' : 'asc'
    };
    setSortOrder(newSortOrder);

    const sortedData = [...countryCounts].sort((a, b) => {
      if (columnName === 'Country') {
        return newSortOrder[columnName] === 'asc' ? a._id.localeCompare(b._id) : b._id.localeCompare(a._id);
      } else if (columnName === 'Continent') {
        return newSortOrder[columnName] === 'asc' ? country_codes[a._id].localeCompare(country_codes[b._id]) : country_codes[b._id].localeCompare(country_codes[a._id]);
      } else if (columnName === 'Count') {
        return newSortOrder[columnName] === 'asc' ? a.count - b.count : b.count - a.count;
      }
      return 0;
    });

    setCountryCounts(sortedData);
  };

  const getSortIcon = (columnName) => {
    if (sortOrder[columnName] === 'asc') {
      return <span>&#9650;</span>; // Upward triangle
    } else {
      return <span>&#9660;</span>; // Downward triangle
    }
  };

  const handleCountryClick = (countryCode) => {
    const filteredData = data.filter(item => item.Country === countryCode);
    dispatch(setSelectedData(filteredData));
  };

  return (
    <div className="m-2" style={graphbox}>
      <h1 style={{ fontSize: '1.2rem', textAlign: 'center', color: '#ffffff' }}>
        {columnname}
      </h1>

      <div style={tableContainer}>
        <table style={customTable}>
          <thead>
            <tr>
              <th style={thStyle} onClick={() => handleSort('Country')}>
                Country {getSortIcon('Country')}
              </th>
              <th style={thStyle} onClick={() => handleSort('Continent')}>
                Continent {getSortIcon('Continent')}
              </th>
              <th style={thStyle} onClick={() => handleSort('Count')}>
                Count {getSortIcon('Count')}
              </th>
              {isLoadedFromDynamicEmp && (
                <>
                  <th style={thStyle}>Male Count</th>
                  <th style={thStyle}>Female Count</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {countryCounts.map((country, index) => (
              <tr key={index} onClick={() => handleCountryClick(country._id)} style={{ ...trStyle, cursor: 'pointer' }}>
                <td style={tdStyle}>{country._id}</td>
                <td style={tdStyle}>{country_codes[country._id]}</td>
                <td style={tdStyle}>{country.count}</td>
                {isLoadedFromDynamicEmp && (
                  <>
                    <td style={tdStyle}>{maleCounts[country._id] || 0}</td>
                    <td style={tdStyle}>{femaleCounts[country._id] || 0}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableRepresentation;
