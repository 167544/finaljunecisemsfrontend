import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Assuming you're using Redux for state management
import * as d3 from 'd3';
import './TableRepresentation.css';
import setSelectedData from '../actions/setSetlecteddata';

const ResourceType = (props) => {
  const data = useSelector((state) => state.selectedData); // Assuming you're using Redux to get data
  const dispatch = useDispatch();
  const [resourceCounts, setResourceCounts] = useState([]);
  const columnName = props.columnname; // Your column name
  const svgRef = useRef();
  const legendRef = useRef(); // Reference for the legend div

  const graphbox = {
    borderRadius: '10px',
    height: '330px',
    boxShadow: "1px 5px 5px",
    backgroundColor: '#0A2342',
    fontFamily: 'Inter, serif',
    position: 'relative',
    display: 'flex', // Add display flex to align items side by side
    justifyContent: 'space-around', // Add space between items
  };

  useEffect(() => {
    clearGraph();
    setResourceCounts(getCountsByResource());
  }, [data]);

  useEffect(() => {
    if (resourceCounts.length > 0) {
      clearGraph();
      createPieChart();
      createLegend();
    }
  }, [resourceCounts]);

  //CodeByJ - handleclick
  const handleClick = (resourceType) => {
    const filteredData = data.filter(item => item['Resource Type'] === resourceType);
    dispatch(setSelectedData(filteredData)); // CodeByJ - Dispatch the action to update the selected data
  };


  const getCountsByResource = () => {
    const counts = {};
    data.forEach((item) => {
      const resource = item['Resource Type'];
      counts[resource] = counts[resource] ? counts[resource] + 1 : 1;
    });
    return Object.entries(counts).map(([resource, count]) => ({ _id: resource, count }));
  };


  const clearGraph = () => {
    const svg = d3.select(svgRef.current);
    // Remove all child elements from the SVG
    svg.selectAll("*").remove();
    // Remove the legend div
    d3.select(legendRef.current).selectAll("*").remove();
  };

  const createPieChart = () => {
    const width = 200; // Set pie chart width
    const height = 250; // Set pie chart height
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      // .range(["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"]); 
      .range(["#4daf4a", "#377eb8", "#ff7f00", "#984ea3", "#e41a1c", "#ff6f61", "#a3de83", "#79abd8", "#ffa500"]);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius - 10);

    const pie = d3.pie()
      .sort(null)
      .value((d) => d.count);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const g = svg.selectAll(".arc")
      .data(pie(resourceCounts))
      .enter().append("g")
      .attr("class", "arc")
      .style("cursor", "pointer") // CodyByJ: Add cursor pointer style
      .on("click", (event, d) => handleClick(d.data._id)); // CodyByJ: Add click handler;

    g.append("path")
      .attr("d", arc)
      .style("fill", (d) => color(d.data._id));

    // Hide legends on pie chart
    d3.select(legendRef.current).selectAll("*").remove();
  };

  const createLegend = () => {
    const color = d3.scaleOrdinal()
      .range(["#4daf4a", "#377eb8", "#ff7f00", "#984ea3", "#e41a1c", "#ff6f61", "#a3de83", "#79abd8", "#ffa500"]);

    const legend = d3.select(legendRef.current)
      .style("background-color", "#0A2342")
      .style("padding", "10px")
      .style("color", "white")
      .style("border-radius", "5px");

    resourceCounts.forEach((resource, index) => {
      const legendItem = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin-bottom", "5px")
        .style("cursor", "pointer")
        .on("click", () => handleClick(resource._id)); // CodyByJ: Add click handler;

      legendItem.append("div")
        .style("width", "10px") // Decrease the width of legend color box
        .style("height", "10px") // Decrease the height of legend color box
        .style("background-color", color(resource._id))
        .style("margin-right", "5px");

      legendItem.append("div")
        .text(`${resource._id}: ${resource.count}`);
    });
  };

  return (
    <div className='' style={graphbox}>
      <div>
        <h1 style={{ fontSize: '1.2rem', textAlign: 'center', color: '#ffffff', paddingTop:"1.2rem" }}>{columnName}</h1>
        <div style={{ textAlign: 'center' }}>
          <svg ref={svgRef}></svg>
        </div>
      </div>
      <div ref={legendRef}></div> {/* Add a div for the legend */}
    </div>
  );
};

export default ResourceType;
