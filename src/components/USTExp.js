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
    const [between2And5Years, setBetween2And5Years] = useState(0);
    const [between6And10Years, setBetween6And10Years] = useState(0);
    const [between11And15Years, setBetween11And15Years] = useState(0);
    const [moreThan15Years, setMoreThan15Years] = useState(0);

    const graphbox = {
        borderRadius: '10px',
        height: '500px',
        width: '360px',
        padding: '2rem',
        boxShadow: '1px 5px 5px',
        backgroundColor: '#0A2342',
        fontFamily: 'Inter, serif',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative'
    };

    const headingStyle = {
        fontSize: '2rem',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '1rem',
        paddingTop: '0rem'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Filter out exited employees
                const activeEmployees = Empdata.filter(employee => employee['Employee Status'] !== 'Exit');

                let lessThan1YearCount = 0;
                let lessThan2YearsCount = 0;
                let between2And5YearsCount = 0;
                let between6And10YearsCount = 0;
                let between11And15YearsCount = 0;
                let moreThan15YearsCount = 0;

                activeEmployees.forEach(employee => {
                    const ustExperience = parseFloat(employee['UST Experience']);

                    if (ustExperience < 1) {
                        lessThan1YearCount++;
                    } else if (ustExperience < 2) {
                        lessThan2YearsCount++;
                    } else if (ustExperience >= 2 && ustExperience <= 5) {
                        between2And5YearsCount++;
                    } else if (ustExperience > 5 && ustExperience <= 10) {
                        between6And10YearsCount++;
                    } else if (ustExperience > 10 && ustExperience <= 15) {
                        between11And15YearsCount++;
                    } else if (ustExperience > 15) {
                        moreThan15YearsCount++;
                    }
                });

                setLessThan1Year(lessThan1YearCount);
                setLessThan2Years(lessThan2YearsCount);
                setBetween2And5Years(between2And5YearsCount);
                setBetween6And10Years(between6And10YearsCount);
                setBetween11And15Years(between11And15YearsCount);
                setMoreThan15Years(moreThan15YearsCount);
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
                const empExperience = parseFloat(employee['UST Experience']);
                return empExperience < 1 && employee['Employee Status'] !== 'Exit';
            });
        } else if (section === '< 2 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = parseFloat(employee['UST Experience']);
                return empExperience >= 1 && empExperience < 2 && employee['Employee Status'] !== 'Exit';
            });
        } else if (section === '2 - 5 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = parseFloat(employee['UST Experience']);
                return empExperience >= 2 && empExperience <= 5 && employee['Employee Status'] !== 'Exit';
            });
        } else if (section === '6 - 10 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = parseFloat(employee['UST Experience']);
                return empExperience > 5 && empExperience <= 10 && employee['Employee Status'] !== 'Exit';
            });
        } else if (section === '11 - 15 Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = parseFloat(employee['UST Experience']);
                return empExperience > 10 && empExperience <= 15 && employee['Employee Status'] !== 'Exit';
            });
        } else if (section === '15+ Years') {
            filteredData = Empdata.filter((employee) => {
                const empExperience = parseFloat(employee['UST Experience']);
                return empExperience > 15 && employee['Employee Status'] !== 'Exit';
            });
        }

        dispatch(setSelectedData(filteredData));
    };

    const boxStyle = {
        gridColumn: "span 2",
        width: 220,
        height: 100,
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
        fontSize: "1.5rem"
    };

    const labelStyle = {
        color: "#00E5FF",
        fontWeight: "bold",
        fontSize: "1rem"
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
                        onClick={() => handleSectionClick('2 - 5 Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {between2And5Years}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            2 - 5 Years
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
                        onClick={() => handleSectionClick('11 - 15 Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {between11And15Years}
                        </Typography>
                        <Typography variant="subtitle1" style={labelStyle}>
                            11 - 15 Years
                        </Typography>
                    </Box>

                    <Box
                        style={boxStyle}
                        onClick={() => handleSectionClick('15+ Years')}
                    >
                        <Typography variant="h4" style={numberStyle}>
                            {moreThan15Years}
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
