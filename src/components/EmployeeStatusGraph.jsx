import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import * as d3 from 'd3';
import './TableRepresentation.css';
import setSelectedData from '../actions/setSetlecteddata'; 

const EmployeeStatusGraph = (props) => {
  const data = useSelector((state) => state.selectedData); 
  const dispatch = useDispatch();
  const [statusCounts, setStatusCounts] = useState([]);
  const columnName = props.columnname; // Your column name
  const svgRef = useRef();

  const graphbox = {
    borderRadius: '10px',
    height: '465px', // Increased height to accommodate heading and padding
    width: '500px', // Increased width
    padding: '2rem', // Increased padding
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
    fontSize: '1.5rem',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '2rem', // Adjusted to move heading label down
    marginTop: '0.5rem' // Adjusted to add some space above the heading
  };

  const getCountsByStatus = () => {
    const counts = {};
    data.forEach((item) => {
      const status = item['Employee Status'];
      counts[status] = counts[status] ? counts[status] + 1 : 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ _id: status, count }));
  };

  useEffect(() => {
    setStatusCounts(getCountsByStatus());
  }, [data]); // Update counts whenever data changes

  useEffect(() => {
    if (statusCounts.length > 0) {
      drawBarChart();
    }
  }, [statusCounts]);

  // Click handler to filter data by status
  const handleBarClick = (status) => { 
    const filteredData = data.filter(item => item['Employee Status'] === status);
    dispatch(setSelectedData(filteredData)); // Dispatch the action to update the selected data
  };

  const drawBarChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
  
    const margin = { top: 60, right: 40, bottom: 90, left: 60 }; // Adjusted margins
    const width = 450 - margin.left - margin.right; // Increased width
    const height = 300 - margin.top - margin.bottom; // Adjusted height
  
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .range([height, 0]);
  
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    x.domain(statusCounts.map(d => d._id));
    y.domain([0, d3.max(statusCounts, d => d.count)]);
  
    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('cursor', 'pointer')
      .style('fill', '#ffffff')
      .style('font-size', '11px') // Reduced font size for x-axis labels
      .on('click', (event, d) => handleBarClick(d));
  
    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).ticks(5).tickSizeInner(-width))
      .selectAll('text')
      .style('fill', '#ffffff')
      .style('font-size', '18px'); // Reduced font size for y-axis labels
  
    g.selectAll('.bar')
      .data(statusCounts)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d._id))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .style('fill', '#ffffff')
      .style('cursor', 'pointer')
      .on('click', (event, d) => handleBarClick(d._id));
  
    g.selectAll('.bar-label')
      .data(statusCounts)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => x(d._id) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 15) // Adjusted spacing for more separation
      .attr('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '25px') // Reduced font size for bar labels
      .text(d => d.count);
  
    // Y Axis Label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 65)
      .attr('x', 0 - (height / 2) - margin.top)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '15px') // Reduced font size for y-axis label
      .text('Count');
  
    svg.selectAll('.axis-y .tick line').remove();
  };
  
  return (
    <div className='m-2' style={graphbox}>
      <h1 style={headingStyle}>{columnName}</h1>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <svg ref={svgRef} width="600" height="350"></svg> {/* Adjusted SVG size */}
      </div>
    </div>
  );
};

export default EmployeeStatusGraph;
