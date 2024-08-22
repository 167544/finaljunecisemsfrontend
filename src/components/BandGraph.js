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
        backgroundColor: '#0A2342',
        fontFamily: 'Inter, serif',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    };

    const headingStyle = {
        fontSize: '1.5rem',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: '1rem',
    };

    // Define the colors from the pie chart image
    const colors = {
        Q1: '#0088FE', // Color from Q1 pie slice
        Q2: '#FF8042', // Color from Q2 pie slice
        Q3: '#00C49F', // Color from Q3 pie slice
        Q4: '#FFBB28', // Color from Q4 pie slice
    };

    const fetchBand = () => {
        try {
            if (!employeeData) return;

            const activeEmployees = employeeData.filter((employee) => employee['Employee Status'] !== 'Exit');

            const bandCounts = activeEmployees.reduce((counts, employee) => {
                const band = employee.Band;
                counts[band] = counts[band] || { total: 0, male: 0, female: 0 };
                counts[band].total += 1;
                if (employee.Gender === 'M') counts[band].male += 1;
                if (employee.Gender === 'F') counts[band].female += 1;
                return counts;
            }, {});

            let formattedData = Object.entries(bandCounts).map(([band, { total, male, female }]) => ({
                band,
                total,
                male,
                female,
            }));

            // Sort bands in descending alphabetical order
            formattedData = formattedData.sort((a, b) => b.band.localeCompare(a.band));

            // Move CWR to the bottom of the array
            formattedData = formattedData.sort((a, b) => {
                if (a.band === 'CWR') return 1;
                if (b.band === 'CWR') return -1;
                return 0; // Preserve the alphabetical order
            });

            setData(formattedData);
        } catch (error) {
            console.error('Error fetching band data:', error);
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
        d3.select(svgRef.current).selectAll('*').remove();

        const margin = { top: 10, right: 20, bottom: 40, left: 80 };
        const width = 450 - margin.left - margin.right;
        const height = 460 - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.total)])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map((d) => d.band))
            .range([0, height - 30]) // Adjust the range to move the bands up
            .padding(0.3);

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const middleX = width / 2;

        // Define band color mapping based on the bands
        const bandColorMapping = {
            E1: colors.Q1,
            D2: colors.Q1,
            D1: colors.Q2,
            C3: colors.Q2,
            C2: colors.Q3,
            C1: colors.Q3,
            B3: colors.Q4,
            B2: colors.Q4,
            A3: colors.Q1,
            A2: colors.Q1,
            A1: colors.Q2,
            CWR: '#A28C88' // Custom color for CWR or you can assign another from the pie chart
        };

        // Draw bars for the bands, excluding CWR
        svg.selectAll('.bar')
            .data(data.filter((d) => d.band !== 'CWR'))
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => middleX - x(d.total) / 2)
            .attr('y', (d) => y(d.band))
            .attr('width', (d) => x(d.total))
            .attr('height', y.bandwidth())
            .attr('fill', (d) => bandColorMapping[d.band] || '#1A3E59') // Apply pie chart colors or fallback to default color
            .attr('stroke', '#FFFFFF')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                setSelectedBand(d.band);
            });

        // Draw labels for the bands, excluding CWR
        svg.selectAll('.label')
            .data(data.filter((d) => d.band !== 'CWR'))
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', (d) => middleX - x(d.total) / 2 - 10)
            .attr('y', (d) => y(d.band) + y.bandwidth() / 2 + 5)
            .text((d) => `${d.band}, ${d.total}`)
            .attr('fill', '#FFFFFF')
            .style('font-weight', 'bold')
            .style('font-size', '1rem')
            .attr('text-anchor', 'end')
            .style('text-shadow', '1px 1px 2px #000')
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                setSelectedBand(d.band);
            });

        // Add a separator line above the CWR band
        const separatorY = y(data[data.length - 2]?.band) + y.bandwidth() + 8; // Increase the space between the last band and the separator line
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', separatorY)
            .attr('y2', separatorY)
            .attr('stroke', '#FF0000')  // Red color for separator line
            .attr('stroke-width', 2);

        // Draw CWR band and label below the separator line
        const cwrBand = data.find((d) => d.band === 'CWR');
        if (cwrBand) {
            const cwrY = separatorY + 20; // Add more space between the separator line and the CWR band

            // Draw CWR bar
            svg.append('rect')
                .attr('class', 'bar')
                .attr('x', middleX - x(cwrBand.total) / 2)
                .attr('y', cwrY)
                .attr('width', x(cwrBand.total))
                .attr('height', y.bandwidth())
                .attr('fill', bandColorMapping['CWR']) // Apply color to CWR bar
                .attr('stroke', '#FFFFFF')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .on('click', () => {
                    setSelectedBand(cwrBand.band);
                });

            // Draw CWR label
            svg.append('text')
                .attr('class', 'label')
                .attr('x', middleX - x(cwrBand.total) / 2 - 10)
                .attr('y', cwrY + y.bandwidth() / 2 + 5)
                .text(`${cwrBand.band}, ${cwrBand.total}`)
                .attr('fill', '#FFFFFF')
                .style('font-weight', 'bold')
                .style('font-size', '1rem')
                .attr('text-anchor', 'end')
                .style('text-shadow', '1px 1px 2px #000')
                .style('cursor', 'pointer')
                .on('click', () => {
                    setSelectedBand(cwrBand.band);
                });
        }
    }, [data, isDataUploaded]);

    return (
        <div style={graphbox}>
            <h1 style={headingStyle}>Pyramid Band</h1>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default PyramidGraph;
