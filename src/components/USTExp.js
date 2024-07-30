import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

function USTExp({ isDataUploaded }) {
    let Empdata = useSelector((state) => state.selectedData);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();
    const [lessThan1Year, setLessThan1Year] = useState(0);
    const [lessThan2Years, setLessThan2Years] = useState(0);
    const [between2And6Years, setBetween2And6Years] = useState(0);
    const [between6And10Years, setBetween6And10Years] = useState(0);
    const [moreThan10Years, setMoreThan10Years] = useState(0);
    const [unknown, setUnknown] = useState(0);

    const graphbox = {
        borderRadius: '10px',
        height: '500px', // Increased height
        width: '360px', // Adjusted width for better spacing
        padding: '2rem', // Same padding as EmployeeStatusGraph
        boxShadow: '1px 5px 5px',
        backgroundColor: '#0A2342',
        fontFamily: 'Inter, serif',
        margin: '0 auto', // Center the box
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Adjust to start to add more space at the top
        position: 'relative'
    };

    const headingStyle = {
        fontSize: '2rem',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '1rem', // Adjusted to stay within the box
        paddingTop: '0rem' // Reduced padding to bring the heading closer to the top
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let lessThan1YearCount = 0;
                let lessThan2YearsCount = 0;
                let between2And6YearsCount = 0;
                let between6And10YearsCount = 0;
                let moreThan10YearsCount = 0;
                let unknownCount = 0;

                Empdata.forEach(employee => {
                    const ustExperience = employee['UST Experience'];

                    if (parseInt(ustExperience) < 1) {
                        lessThan1YearCount++;
                    } else if (parseInt(ustExperience) < 2) {
                        lessThan2YearsCount++;
                    } else if (parseInt(ustExperience) >= 2 && parseInt(ustExperience) <= 6) {
                        between2And6YearsCount++;
                    } else if (parseInt(ustExperience) > 6 && parseInt(ustExperience) <= 10) {
                        between6And10YearsCount++;
                    } else if (parseInt(ustExperience) > 10 && parseInt(ustExperience) <= 15) {
                        moreThan10YearsCount++;
                    } else {
                        unknownCount++;
                    }
                });

                setLessThan1Year(lessThan1YearCount);
                setLessThan2Years(lessThan2YearsCount);
                setBetween2And6Years(between2And6YearsCount);
                setBetween6And10Years(between6And10YearsCount);
                setMoreThan10Years(moreThan10YearsCount);
                setUnknown(unknownCount);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [Empdata]);

    const handleSectionClick = (section) => {
        let filteredData;
        if (section === '< 1 Year') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = employee['UST Experience'];
                return empExperience >= 0 && empExperience < 1;
            });
        } else if (section === '< 2 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = employee['UST Experience'];
                return empExperience >= 1 && empExperience < 2;
            });
        } else if (section === '2 - 6 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = employee['UST Experience'];
                return empExperience >= 2 && empExperience <= 6;
            });
        } else if (section === '6 - 10 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = employee['UST Experience'];
                return empExperience > 6 && empExperience <= 10;
            });
        } else if (section === '10 - 15 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = employee['UST Experience'];
                return empExperience > 10 && empExperience <= 15;
            });
        } else {
            filteredData = Empdata.filter((employee) => {
                const empExperience = employee['UST Experience'];
                return empExperience > 15;
            });
        }

        dispatch(setSelectedData(filteredData));
    };

    const boxStyle = {
        gridColumn: "span 2",
        width: 220, // Adjusted width
        height: 100, // Adjusted height
        margin: "10px",
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    };

    const numberStyle = {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "1.5rem" // Adjusted font size
    };

    const labelStyle = {
        color: "#00E5FF",
        fontWeight: "bold",
        fontSize: "1rem" // Adjusted font size
    };

    return (
        <div style={graphbox}>
            <h1 style={headingStyle}>UST Experience</h1>
            <div className='d-flex justify-content-center' style={{ alignItems: 'center' }}>
                <div>
                    <Box
                        style={boxStyle}
                        onClick={() => handleSectionClick('< 1 Year')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {lessThan1Year}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            &lt; 1 Year
                        </Typography>
                    </Box>

                    <Box
                        style={boxStyle}
                        onClick={() => handleSectionClick('< 2 Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {lessThan2Years}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            &lt; 2 Years
                        </Typography>
                    </Box>

                    <Box
                        style={boxStyle}
                        onClick={() => handleSectionClick('2 - 6 Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {between2And6Years}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            2 - 6 Years
                        </Typography>
                    </Box>
                </div>

                <div>
                    <Box
                        style={boxStyle}
                        onClick={() => handleSectionClick('6 - 10 Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {between6And10Years}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            6 - 10 Years
                        </Typography>
                    </Box>

                    <Box
                        style={boxStyle}
                        onClick={() => handleSectionClick('10 - 15 Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {moreThan10Years}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            10 - 15 Years
                        </Typography>
                    </Box>

                    <Box
                        style={boxStyle}
                        onClick={() => handleSectionClick('15+ Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {unknown}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            15+ Years
                        </Typography>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default USTExp;
