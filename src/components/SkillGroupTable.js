import React from 'react';
import { useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const SkillGroupTable = ({ skillData }) => {
  const dispatch = useDispatch();

  const colors = {
    backgroundColor: '#0A2342',
    headingColor: '#ffffff',
    scrollbarTrack: '#0A2342',
    scrollbarThumb: '#1A3E59',
    scrollbarThumbHover: '#39FF14',
    tableHeaderBackground: '#102E4A',
    tableHeaderColor: '#ffffff', // White color for the header text
    tableRowEvenBackground: '#0A2342',
    tableRowHoverBackground: '#102E4A',
    tableRowHoverColor: '#1A3E59',
    tableCellColor: 'white',
  };

  const containerStyle = {
    borderRadius: '10px',
    height: '470px',
    width: '700px', // Width of the background layer box
    padding: '2rem',
    backgroundColor: colors.backgroundColor, // Main background color
    fontFamily: 'Inter, serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    position: 'relative',
  };

  const headingStyle = {
    fontSize: '2rem',
    color: colors.headingColor,
    textAlign: 'center',
    marginBottom: '2rem',
  };

  // Sort the skillData in alphabetical order by skillGroup
  const sortedSkillData = [...skillData].sort((a, b) => {
    return a.skillGroup.localeCompare(b.skillGroup);
  });

  const handleRowClick = (skillGroup) => {
    const filteredData = skillData.filter((item) => item.skillGroup === skillGroup);
    dispatch(setSelectedData(filteredData));
  };

  if (!sortedSkillData || sortedSkillData.length === 0) {
    return <div style={headingStyle}>No data available</div>;
  }

  return (
    <div style={containerStyle}>
      <style>{`
        .table-container {
          overflow-y: auto;
          max-height: 100%; /* Ensure the table container takes full height */
          width: 100%; /* Ensure it takes the full width of the container */
          display: flex; /* Center table */
          align-items: center; /* Center table vertically */
          justify-content: center; /* Center table horizontally */
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
          width: 100%; /* Ensure the table takes the full width of the container */
          border-collapse: collapse;
          margin: 0 auto; /* Center table horizontally */
        }
        
        .custom-table th,
        .custom-table td {
          padding: 8px 12px;
          text-align: left;
        }
        
        .custom-table th {
          background-color: ${colors.tableHeaderBackground};
          color: ${colors.tableHeaderColor}; /* White header text */
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

        /* Set column widths */
        .skill-group-column {
          width: 70%; /* 70% of the table width */
        }

        .count-column {
          width: 30%; /* 30% of the table width */
        }
      `}</style>
      <h1 style={headingStyle}>Skill Groups</h1>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th className="skill-group-column">Skill Group</th>
              <th className="count-column">Count</th>
            </tr>
          </thead>
          <tbody>
            {sortedSkillData.map((skill, index) => (
              <tr key={index} onClick={() => handleRowClick(skill.skillGroup)} style={{ cursor: 'pointer' }}>
                <td className="skill-group-column">{skill.skillGroup}</td>
                <td className="count-column">{skill.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillGroupTable;
