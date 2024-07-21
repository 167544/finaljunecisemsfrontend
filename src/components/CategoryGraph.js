import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const CategoryGraph = ({ columnnamem, isDataUploaded }) => {
  const data = useSelector((state) => state.selectedData);
  const dispatch = useDispatch();

  const graphbox = {
    borderRadius: '10px',
    height: '390px', // Same height as EmployeeStatusGraph
    width: '350px', // Same width as EmployeeStatusGraph
    padding: '2rem', // Same padding as EmployeeStatusGraph
    boxShadow: '1px 5px 5px',
    backgroundColor: '#0A2342',
    fontFamily: 'Inter, serif',
    margin: '0 auto', // Center the box
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  const headingStyle = {
    fontSize: '2rem',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '2rem', // Adjusted to stay within the box
    
  };

  const getCountsByCountry = () => {
    const counts = {};
    data.forEach((item) => {
      const country = item.Category;
      if (!country) {
        // console.warn('Undefined category in item:', item);
      } else {
        counts[country] = counts[country] ? counts[country] + 1 : 1;
      }
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ _id: country, count }))
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
  };

  const [countryCounts, setCountryCounts] = useState([]);

  useEffect(() => {
    setCountryCounts(getCountsByCountry());
  }, [data]);

  const handleRowClick = (category) => {
    const filteredData = data.filter(item => item.Category === category);
    dispatch(setSelectedData(filteredData));
  };

  return (
    <div className="m-2" style={graphbox}>
      <style>{`
        .table-container {
          overflow-y: auto;
          max-height: 450px;
        }
        
        .table-container::-webkit-scrollbar {
          width: 12px;
        }
        
        .table-container::-webkit-scrollbar-track {
          background: #0A2342;
        }
        
        .table-container::-webkit-scrollbar-thumb {
          background-color: #00E5FF;
          border-radius: 20px;
          border: 3px solid #0A2342;
        }
        
        .table-container::-webkit-scrollbar-thumb:hover {
          background-color: #39FF14;
        }
        
        .custom-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .custom-table th,
        .custom-table td {
          padding: 8px 12px;
          text-align: left;
        }
        
        .custom-table th {
          background-color: #102E4A;
          color: #00E5FF;
        }
        
        .custom-table td {
          color: white;
        }

        .custom-table tr:nth-child(even) {
          background-color: #0A2342;
        }
        
        .custom-table tr:hover {
          background-color: #102E4A;
        }
        
        .custom-table tr:hover td {
          color: #00E5FF;
        }
      `}</style>
      <h1 style={headingStyle}>Category Graph</h1>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody className='text-light'>
            {countryCounts.map((country, index) => (
              <tr key={index} onClick={() => handleRowClick(country._id)} style={{ cursor: 'pointer' }}>
                <td>{country._id}</td>
                <td>{country.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryGraph;
