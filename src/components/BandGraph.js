import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

const PyramidGraph = ({ isDataUploaded, isLoadedFromDynamicEmp }) => {
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
        backgroundColor: '#0A2342', // Set background color to the previous color
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
        color: '#FFFFFF', // Adjusted heading color for contrast
        textAlign: 'center',
        marginBottom: '1rem'
    };

    const fetchBand = () => {
        try {
            if (!employeeData) return;

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

        const sortedData = data.slice().sort((a, b) => a.total - b.total);

        const x = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d.total)])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(sortedData.map(d => d.band))
            .range([0, height])
            .padding(0.3);

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const middleX = width / 2;

        // Step 1: Use the updated blue color
        const fillColor = '#1A3E59'; // Deep blue color for the bars

        svg.selectAll('.bar')
            .data(sortedData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => middleX - x(d.total) / 2)
            .attr('y', d => y(d.band))
            .attr('width', d => x(d.total))
            .attr('height', y.bandwidth())
            .attr('fill', fillColor) // Apply the blue color
            .attr('stroke', '#FFFFFF')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                setSelectedBand(d.band);
            });

        svg.selectAll('.label')
            .data(sortedData)
            .enter().append('text')
            .attr('class', 'label')
            .attr('x', d => middleX - x(d.total) / 2 - 10) // Positioning the label to the left of the bar
            .attr('y', d => y(d.band) + y.bandwidth() / 2 + 5)
            .text(d => `${d.band}, ${d.total}`)
            .attr('fill', '#FFFFFF')
            .style('font-weight', 'bold')
            .style('font-size', '1rem') // Increased font size
            .attr('text-anchor', 'end') // Align the text to the end (right side)
            .style('text-shadow', '1px 1px 2px #000') // Added text shadow for better contrast
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                setSelectedBand(d.band);
            });

    }, [data, isDataUploaded]);

    return (
        <div style={graphbox}>
            <h1 style={headingStyle}>Band</h1>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default PyramidGraph;
