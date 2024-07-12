import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Contacts from "./scenes/contacts";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
import FAQ from "./scenes/faq";
import Calendar from "./scenes/calendar/calendar";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider, useMediaQuery, Box, Typography } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import store from "./store";
import { Provider, useSelector } from "react-redux";
import Footer from "./scenes/global/Footer"; // Import Footer
import Talentpool from "./scenes/talentpool";
import DynamicEmp from "./components/DynamicEmp";
import CisSourcing from "./components/CisSourcing";

function MainDashboard(props) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const data = useSelector((state) => state);

  // Collapse sidebar on mobile view
  useEffect(() => {
    setIsSidebar(!isMobile);
  }, [isMobile]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          height="100vh"
          sx={{
            position: "relative",
            backgroundColor: "#102E4A", // Background color
          }}
        >
          {isSidebar && <Sidebar />}
          <Box flex={1} display="flex" flexDirection="column">
            <Topbar setIsSidebar={setIsSidebar} handleUserLogout={props.handleUserLogout} />
            <Box flex={1} overflow="auto" padding={2}>
              <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                Welcome to the Dashboard
              </Typography>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard/contacts" element={<Contacts />} />
                <Route path="/dashboard/talentpool" element={<Talentpool />} />
                <Route path="/dashboard/dynamic" element={<DynamicEmp />} />
                <Route path="/dashboard/cissourcing" element={<CisSourcing />} />
                <Route path="/dashboard/invoices" element={<Invoices />} />
                <Route path="/dashboard/form" element={<Form />} />
                <Route path="/dashboard/bar" element={<Bar />} />
                <Route path="/dashboard/pie" element={<Pie />} />
                <Route path="/dashboard/line" element={<Line />} />
                <Route path="/dashboard/faq" element={<FAQ />} />
                <Route path="/dashboard/calendar" element={<Calendar />} />
                <Route path="/dashboard/geography" element={<Geography />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default MainDashboard;
