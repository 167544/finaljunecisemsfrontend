import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as d3 from 'd3';
import './TableRepresentation.css';
import setSelectedData from '../actions/setSetlecteddata';

const ResourceType = (props) => {
  const data = useSelector((state) => state.selectedData);
  const dispatch = useDispatch();
  const [resourceCounts, setResourceCounts] = useState([]);
  const columnName = props.columnname;
  const svgRef = useRef();
  const legendRef = useRef();

  const graphbox = {
    borderRadius: '10px',
    height: '400px',
    padding: '1rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Border shadow effect
    backgroundColor: '#0A2342',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
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

  const handleClick = (resourceType) => {
    const filteredData = data.filter(item => item['Resource Type'] === resourceType);
    dispatch(setSelectedData(filteredData));
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
    svg.selectAll("*").remove();
    d3.select(legendRef.current).selectAll("*").remove();
  };

  const createPieChart = () => {
    const width = 200;
    const height = 250;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      .range([
        "#39FF14",
        "#00FFFF",
        "#FF00FF",
        "#FFD700",
        "#FF4500",
        "#7CFC00",
        "#00BFFF",
        "#8A2BE2",
        "#FF1493"
      ]);

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
      .style("cursor", "pointer")
      .on("click", (event, d) => handleClick(d.data._id));

    g.append("path")
      .attr("d", arc)
      .style("fill", (d) => color(d.data._id))
      .attr('stroke', '#00E5FF') // Border color
      .attr('stroke-width', 1) // Border width
      .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'); // Border shadow effect

    g.append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("fill", "#FFFFFF")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .text((d) => d.data.count);

    d3.select(legendRef.current).selectAll("*").remove();
  };

  const createLegend = () => {
    const color = d3.scaleOrdinal()
      .range([
        "#39FF14",
        "#00FFFF",
        "#FF00FF",
        "#FFD700",
        "#FF4500",
        "#7CFC00",
        "#00BFFF",
        "#8A2BE2",
        "#FF1493"
      ]);

    const legend = d3.select(legendRef.current)
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("background-color", "#0A2342");

    resourceCounts.forEach((resource) => {
      const legendItem = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin-bottom", "5px")
        .style("cursor", "pointer")
        .on("click", () => handleClick(resource._id));

      legendItem.append("div")
        .style("width", "10px")
        .style("height", "10px")
        .style("background-color", color(resource._id))
        .style("margin-right", "5px");

      legendItem.append("div")
        .style("color", "#FFFFFF") // Set to white color
        .text(`${resource._id}: ${resource.count}`);
    });
  };

  return (
    <div className='' style={graphbox}>
      <div>
        <h1 style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }}>{columnName}</h1> {/* Set to white color */}
        <div style={{ textAlign: 'center' }}>
          <svg ref={svgRef}></svg>
        </div>
      </div>
      <div ref={legendRef}></div>
    </div>
  );
};

export default ResourceType;
