import React, { useState, useEffect } from 'react';
import './TableRepresentation.css';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';
import { style } from 'd3';

const CategoryGraph = ({ columnnamem, isDataUploaded }) => {
  const data = useSelector((state) => state.selectedData);
  const dispatch = useDispatch(); // CodeByJ - Hook to dispatch actions

  const graphbox = {
    borderRadius: '10px',
    height: '330px',
    width: '50%',
    padding: '1rem',
    boxShadow: '1px 5px 5px ',
  };

  const getCountsByCountry = () => {
    const counts = {};
    data.forEach((item) => {
      const country = item.Category;
      counts[country] = counts[country] ? counts[country] + 1 : 1;
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ _id: country, count }))
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
  };

  const [countryCounts, setCountryCounts] = useState(getCountsByCountry());

  useEffect(() => {
    setCountryCounts(getCountsByCountry());
  }, [data]);

  const handleRowClick = (category) => { // CodyByJ: Click handler to filter data by category
    const filteredData = data.filter(item => item.Category === category);
    dispatch(setSelectedData(filteredData)); // CodeByJ - Dispatch the action to update the selected data
    // console.log('Filtered Data by Category:', filteredData);
    // console.log('Total No:', filteredData.length);
  };


  return (
    <div className="m-2" style={graphbox}>
      <h1 style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', color: '#0A6E7C' }}>
        Category Graph
        
      </h1>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {countryCounts.map((country, index) => (
              <tr key={index} onClick={() => handleRowClick(country._id)} style= {{ cursor: 'pointer'}}> {/* CodyByJ: Add click handler to rows */}
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
