import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const BandGraph = ({ isDataUploaded, isLoadedFromDynamicEmp }) => {
    const svgRef = useRef();
    const [data, setData] = useState(null);
    const dispatch = useDispatch();
    const employeeData = useSelector((state) => state.selectedData);
    const [selectedBand, setSelectedBand] = useState(null);

    const graphbox = {
        borderRadius: '10px',
        height: '500px',
        width: '450px',
        padding: '1rem',
        boxShadow: '1px 5px 5px',
        backgroundColor: '#0A2342',
        fontFamily: 'Inter, serif',
        margin: '0 auto', 
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
        marginBottom: '1rem'
    };

    const fetchBand = () => {
        try {
            if (!employeeData) return;

            // Filter out employees with the status "Exit"
            const activeEmployees = employeeData.filter(employee => employee['Employee Status'] !== 'Exit');

            const bandCounts = activeEmployees.reduce((counts, employee) => {
                const band = employee.Band;
                counts[band] = counts[band] || { total: 0, male: 0, female: 0 };
                counts[band].total += 1;
                if (employee.Gender === 'M') counts[band].male += 1;
                if (employee.Gender === 'F') counts[band].female += 1;
                return counts;
            }, {});

            const formattedData = Object.entries(bandCounts).map(([band, { total, male, female }]) => ({
                band,
                total,
                male,
                female
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error fetching band data:", error);
        }
    };

    useEffect(() => {
        fetchBand();
    }, [isDataUploaded, employeeData]);

    useEffect(() => {
        if (selectedBand) {
            const filteredData = employeeData.filter((employee) => employee.Band === selectedBand);
            dispatch(setSelectedData(filteredData));
        }
    }, [selectedBand]);

    useEffect(() => {
        if (!data) return;
        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 40, left: 80 };
        const width = 450 - margin.left - margin.right;
        const height = 460 - margin.top - margin.bottom;

        const sortedData = data.slice().sort((a, b) => a.band.localeCompare(b.band));

        const x = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d.total)])
            .nice()
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(sortedData.map(d => d.band))
            .range([0, height])
            .padding(0.2);

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        svg.selectAll('.bar')
            .data(sortedData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', d => y(d.band))
            .attr('width', d => x(d.total))
            .attr('height', y.bandwidth())
            .attr('fill', '#0A2342')
            .attr('stroke', '#FFFFFF') // Changed border color to white
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                setSelectedBand(d.band);
            });

        svg.selectAll('.label')
            .data(sortedData)
            .enter().append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.total) + 5)
            .attr('y', d => y(d.band) + y.bandwidth() / 2 + 4)
            .text(d => isLoadedFromDynamicEmp 
                ? `${d.total} (Male: ${d.male}, Female: ${d.female})` 
                : d.total)
            .attr('fill', '#FFFFFF') 
            .style('font-weight', 'bold')
            .style('font-size', '0.8rem')
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                setSelectedBand(d.band);
            });

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll('text')
            .attr('fill', '#FFFFFF') 
            .style('font-size', '0.8rem')
            .style('font-weight', 'bold');

        // Make the axis lines thicker and white
        svg.selectAll('.y-axis path, .y-axis line')
            .attr('stroke', '#FFFFFF') // Set the color of the axis lines to white
            .attr('stroke-width', 2); // Set the thickness of the axis lines

    }, [data, isDataUploaded]);

    return (
        <div style={graphbox}>
            <h1 style={headingStyle}>Band Graph</h1>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default BandGraph;
