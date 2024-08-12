import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const EmployeeStatusGraph = ({ columnName, isDataUploaded }) => {
  const data = useSelector((state) => state.selectedData);
  const dispatch = useDispatch();

  const graphbox = {
    borderRadius: '10px',
    height: '480px',
    width: '350px',
    padding: '2rem',
    boxShadow: '1px 5px 5px',
    backgroundColor: '#0A2342',
    fontFamily: 'Inter, serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the top
    position: 'relative'
  };

  const headingStyle = {
    fontSize: '2rem',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '1rem', // Space between heading and table
  };

  const getCountsByStatus = () => {
    const counts = {};
    data.forEach((item) => {
      const status = item['Employee Status'];
      if (!status) {
        // Handle undefined statuses if needed
      } else {
        counts[status] = counts[status] ? counts[status] + 1 : 1;
      }
    });
    return Object.entries(counts)
      .map(([status, count]) => ({ _id: status, count }))
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
  };

  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    setStatusCounts(getCountsByStatus());
  }, [data]);

  const handleRowClick = (status) => {
    const filteredData = data.filter(item => item['Employee Status'] === status);
    dispatch(setSelectedData(filteredData));
  };

  return (
    <div className="m-2" style={graphbox}>
      <h1 style={headingStyle}>Employee Status</h1> {/* Heading inside the box at the top */}
      <style>{`
        .table-container {
          overflow-y: auto;
          max-height: 400px; // Adjusted to fit below the heading
          width: 100%;
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
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody className='text-light'>
            {statusCounts.map((status, index) => (
              <tr key={index} onClick={() => handleRowClick(status._id)} style={{ cursor: 'pointer' }}>
                <td>{status._id}</td>
                <td>{status.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeStatusGraph;
