import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const ResourceType = ({ isDataUploaded }) => {
  const data = useSelector((state) => state.selectedData);
  const dispatch = useDispatch();

  const graphbox = {
    borderRadius: '10px',
    height: '490px',
    width: '350px',
    padding: '2rem',
    boxShadow: '1px 5px 5px',
    backgroundColor: '#0A2342',
    fontFamily: 'Inter, serif',
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
    marginBottom: '2rem',
  };

  const getCountsByResource = () => {
    const counts = {};
    data.forEach((item) => {
      const resource = item.Client;
      const status = item['Employee Status'];
      if (resource && status !== 'Exit') { // Exclude "Exit" status
        counts[resource] = counts[resource] ? counts[resource] + 1 : 1;
      }
    });
    return Object.entries(counts)
      .map(([resource, count]) => ({ _id: resource, count }))
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
  };

  const [resourceCounts, setResourceCounts] = useState([]);

  useEffect(() => {
    setResourceCounts(getCountsByResource());
  }, [data]);

  const handleRowClick = (resource) => {
    const filteredData = data.filter(item => item.Client === resource && item['Employee Status'] !== 'Exit');
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
      <h1 style={headingStyle}>Clients</h1>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {resourceCounts.map((resource, index) => (
              <tr key={index} onClick={() => handleRowClick(resource._id)} style={{ cursor: 'pointer' }}>
                <td>{resource._id}</td>
                <td>{resource.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceType;
