import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const ResourceType = ({ isDataUploaded }) => {
  const data = useSelector((state) => state.selectedData);
  const dispatch = useDispatch();

  // Step 1: Define the color scheme with the new blue color
  const colors = {
    backgroundColor: '#0A2342',
    headingColor: '#ffffff',
    scrollbarTrack: '#0A2342',
    scrollbarThumb: '#1A3E59', // Updated deep blue color from the image
    scrollbarThumbHover: '#39FF14',
    tableHeaderBackground: '#102E4A',
    tableHeaderColor: '#1A3E59', // Updated deep blue color
    tableRowEvenBackground: '#0A2342',
    tableRowHoverBackground: '#102E4A',
    tableRowHoverColor: '#1A3E59', // Updated deep blue color
    tableCellColor: 'white',
  };

  const graphbox = {
    borderRadius: '10px',
    height: '490px',
    width: '350px',
    padding: '2rem',
    boxShadow: '1px 5px 5px',
    backgroundColor: colors.backgroundColor, // Applied color
    fontFamily: 'Inter, serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const headingStyle = {
    fontSize: '2rem',
    color: colors.headingColor, // Applied color
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

  const resourceCounts = useMemo(() => getCountsByResource(), [data]);

  const handleRowClick = (resource) => {
    const filteredData = data.filter(item => item.Client === resource && item['Employee Status'] !== 'Exit');
    dispatch(setSelectedData(filteredData));
  };

  if (!data || data.length === 0) {
    return <div style={headingStyle}>No data available</div>;
  }

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
          background: ${colors.scrollbarTrack};
        }
        
        .table-container::-webkit-scrollbar-thumb {
          background-color: ${colors.scrollbarThumb};
          border-radius: 20px;
          border: 3px solid ${colors.scrollbarTrack};
        }
        
        .table-container::-webkit-scrollbar-thumb:hover {
          background-color: ${colors.scrollbarThumbHover};
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
          background-color: ${colors.tableHeaderBackground};
          color: ${colors.tableHeaderColor};
        }
        
        .custom-table td {
          color: ${colors.tableCellColor};
        }

        .custom-table tr:nth-child(even) {
          background-color: ${colors.tableRowEvenBackground};
        }
        
        .custom-table tr:hover {
          background-color: ${colors.tableRowHoverBackground};
        }
        
        .custom-table tr:hover td {
          color: ${colors.tableRowHoverColor};
        }

        /* Adjust the column widths */
        .custom-table th:first-child, 
        .custom-table td:first-child {
          width: 70%; /* Increase the width of the Client column */
        }

        .custom-table th:last-child, 
        .custom-table td:last-child {
          width: 30%; /* Reduce the width of the Count column */
          text-align: center; /* Center-align the Count column */
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
