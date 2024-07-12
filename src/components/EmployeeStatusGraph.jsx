import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import './TableRepresentation.css';
import { useSelector, useDispatch } from 'react-redux'; 
import setSelectedData from '../actions/setSetlecteddata'; 

const EmployeeStatusGraph = (props) => {
  const data = useSelector((state) => state.selectedData); 
  const dispatch = useDispatch();
  const [statusCounts, setStatusCounts] = useState([]);
  const columnName = props.columnname; // Your column name
  const svgRef = useRef();

  const graphbox = {
    borderRadius:'10px',
    height:'330px',
    width:"70%",
    padding:"1.2rem",
    boxShadow:"1px 5px 5px  ",
    backgroundColor: '#0A2342',
    fontFamily: 'Inter, serif'
}

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

  // CodyByJ: Click handler to filter data by status
  const handleBarClick = (status) => { 
    const filteredData = data.filter(item => item['Employee Status'] === status);
    dispatch(setSelectedData(filteredData)); // CodeByJ - Dispatch the action to update the selected data
    // console.log('Filtered Data by Status:', filteredData);
    // console.log('Total No:', filteredData.length);
  };


  const drawBarChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
  
    const margin = { top: 20, right: 20, bottom: 70, left: 40 }; // Adjust bottom margin for axis labels
    const width = 500 - margin.left - margin.right; // Increase width here
    const height = 300 - margin.top - margin.bottom;
  
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
      .selectAll('text') //CodeByJ
      .style('cursor', 'pointer') // CodyByJ: Set cursor to pointer for labels
      .style('fill', '#ffffff')
      .on('click', (event, d) => handleBarClick(d)); // CodyByJ: Add click handler to labels
  
    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).ticks(5).tickSizeInner(-width));
  
    g.selectAll('.bar')
      .data(statusCounts)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d._id))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .style('fill', '#ffffff')
      .style('filter', 'drop-shadow(0 0 5px #0ff)')
      .style('cursor', 'pointer') // CodyByJ: Set cursor to pointer for bars
      .on('click', (event, d) => handleBarClick(d._id)); // CodyByJ: Add click handler to bars
  
    g.selectAll('.bar-label')
      .data(statusCounts)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => x(d._id) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', '#ffffff') // Set text color to white
      .text(d => d.count);
  
    // X Axis Label
    svg.append('text')
      .attr('transform', `translate(${width / 2 + margin.left},${height + margin.top + margin.bottom * 0.7})`)
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff') // Set text color to white
      .text(columnName);
  
    // Y Axis Label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - (40))
      .attr('x', 0 - (height / 2) - margin.top)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff') // Set text color to white
      .text('Count');
  
    svg.selectAll('.axis-y .tick line').remove();
  };
  
  

  return (
    <div className='m-2' style={graphbox}>
      <h1 style={{ fontSize: '1.2rem', textAlign: 'center', color: '#ffffff' }}>{columnName}</h1>
      <div style={{ textAlign: 'center' }}>
        <svg ref={svgRef} width="500" height="300"></svg>
      </div>
    </div>
  );
};

export default EmployeeStatusGraph;
