import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import StatBox from '../components/StatBox';
import axios from 'axios';
//import { useSelector } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import setSelectedData from '../actions/setSetlecteddata';

function USTExp({ isDataUploaded }) {
    let Empdata = useSelector((state) => state.selectedData)
    const [data, setData] = useState(null);
    const dispatch = useDispatch(); //CodeByJ
    const [lessThan1Year, setLessThan1Year] = useState(0);
    const [lessThan2Years, setLessThan2Years] = useState(0);
    const [between2And6Years, setBetween2And6Years] = useState(0);
    const [between6And10Years, setBetween6And10Years] = useState(0);
    const [moreThan10Years, setMoreThan10Years] = useState(0);
    const [unknown, setUnknown] = useState(0);

    const graphbox = {
        borderRadius:'10px',
        height:'330px',
      
        boxShadow:"1px 5px 5px  "
    }

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
                    // console.log(ustExperience)
                    
                    if (parseInt(ustExperience) < 1) {
                        lessThan1YearCount++;
                    } else if (parseInt(ustExperience) < 2) {
                        lessThan2YearsCount++;
                    } else if (parseInt(ustExperience) >= 2 && parseInt(ustExperience) <= 6) {
                        between2And6YearsCount++;
                    } else if (parseInt(ustExperience) > 6 && parseInt(ustExperience) <= 10) {
                        between6And10YearsCount++;
                    } else if (parseInt(ustExperience) > 10 && parseInt(ustExperience) <= 15 ) {
                        moreThan10YearsCount++;
                    } else {
                        unknownCount++;
                    }
                });

                // Update state variables with the counts
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

    //CodeByJ - Handle section click
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

            dispatch(setSelectedData(filteredData)); // CodeByJ - Dispatch the action to update the selected data
       
    };



    return (
        <div  style={graphbox}>
            <h1 style={{ fontSize: "1rem", textAlign: "center", fontWeight: "bold", color: "#0A6E7C" }}>UST Experience</h1>

            <div className='d-flex justify-content-center ' style={{alignItems:'center'}}>

                <div>
                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer"  }} //CodeByJ
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onclick={() => handleSectionClick('< 1 Year')} //CodeByJ
                    >
                        <StatBox
                            title={lessThan1Year}
                            subtitle="< 1 Year"
                        />
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer"  }} //CodeByJ
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onclick={() => handleSectionClick('< 2 Year')} //CodeByJ
                    >
                        <StatBox
                            title={lessThan2Years}
                            subtitle="< 2 Years"
                        />
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer"  }} //CodeByJ
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onclick={() => handleSectionClick('2 - 6 Years')} //CodeByJ
                    >
                        <StatBox
                            title={between2And6Years}
                            subtitle="2 - 6 Years"
                        />
                    </Box>
                </div>

                <div>
                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer"  }} //CodeByJ
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onclick={() => handleSectionClick('6 - 10 Years')} //CodeByJ
                    >
                        <StatBox
                            title={between6And10Years}
                            subtitle="6 - 10 Years"
                        />
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer"  }} //CodeByJ
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onclick={() => handleSectionClick('10 - 15 Years')} //CodeByJ
                    >
                        <StatBox
                            title={moreThan10Years}
                            subtitle="10 - 15 Years"
                        />
                    </Box>

                    <Box
                        gridColumn="span 2"
                        width={180}
                        style={{ margin: "10px", cursor: "pointer"  }} //CodeByJ
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onclick={() => handleSectionClick('15+ Years')} //CodeByJ 
                    >
                        <StatBox
                            title={unknown}
                            subtitle="15+ Years"
                        />
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default USTExp;
