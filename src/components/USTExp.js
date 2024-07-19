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
        height: '400px', // Same height as EmployeeStatusGraph
        width: '500px', // Same width as EmployeeStatusGraph
        padding: '2rem', // Same padding as EmployeeStatusGraph
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

    return (
        <div style={graphbox}>
            <h1 style={{ fontSize: "1.5rem", textAlign: "center", fontWeight: "bold", color: "#ffffff" }}>UST Experience</h1>
            <div className='d-flex justify-content-center' style={{ alignItems: 'center' }}>
                <div>
                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer", textAlign: "center" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => handleSectionClick('< 1 Year')}
                    >
                        <Typography variant="h4" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            {lessThan1Year}
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#00E5FF", fontWeight: "bold" }}>
                            &lt; 1 Year
                        </Typography>
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer", textAlign: "center" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => handleSectionClick('< 2 Years')}
                    >
                        <Typography variant="h4" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            {lessThan2Years}
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#00E5FF", fontWeight: "bold" }}>
                            &lt; 2 Years
                        </Typography>
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer", textAlign: "center" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => handleSectionClick('2 - 6 Years')}
                    >
                        <Typography variant="h4" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            {between2And6Years}
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#00E5FF", fontWeight: "bold" }}>
                            2 - 6 Years
                        </Typography>
                    </Box>
                </div>

                <div>
                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer", textAlign: "center" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => handleSectionClick('6 - 10 Years')}
                    >
                        <Typography variant="h4" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            {between6And10Years}
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#00E5FF", fontWeight: "bold" }}>
                            6 - 10 Years
                        </Typography>
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer", textAlign: "center" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => handleSectionClick('10 - 15 Years')}
                    >
                        <Typography variant="h4" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            {moreThan10Years}
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#00E5FF", fontWeight: "bold" }}>
                            10 - 15 Years
                        </Typography>
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer", textAlign: "center" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => handleSectionClick('15+ Years')}
                    >
                        <Typography variant="h4" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            {unknown}
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#00E5FF", fontWeight: "bold" }}>
                            15+ Years
                        </Typography>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default USTExp;
