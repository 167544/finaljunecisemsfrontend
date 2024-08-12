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
import Footer from "./scenes/global/Footer";
import Talentpool from "./scenes/talentpool";
import DynamicEmp from "./components/DynamicEmp";
import CisSourcing from "./components/CisSourcing";
import FinanceExternal from "../src/components/FinanceExternal";
import CustomerDetails from "./components/CustomerDetails";
import Account1Details from "../src/accountspages/Account1Details";
import Account2Details from "../src/accountspages/Account2Details";
import Account3Details from "../src/accountspages/Account3Details";
import Account4Details from "../src/accountspages/Account4Details";
import Account5Details from "../src/accountspages/Account5Details"; // Import Account5Details
import ManageTalentPool from "../src/components/ManageTalentPool"; 

function MainDashboard(props) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const data = useSelector((state) => state);

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
              {/* <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                Welcome to the Dashboard
              </Typography> */}
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
                <Route path="/dashboard/finance" element={<FinanceExternal />} />
                <Route path="/dashboard/accounts" element={<CustomerDetails />} />
                <Route path="/account/1" element={<Account1Details />} /> {/* Route for Account 1 details */}
                <Route path="/account/2" element={<Account2Details />} /> {/* Route for Account 2 details */}
                <Route path="/account/3" element={<Account3Details />} /> {/* Route for Account 3 details */}
                <Route path="/account/4" element={<Account4Details />} /> {/* Route for Account 4 details */}
                <Route path="/account/5" element={<Account5Details />} /> {/* Route for Account 5 details */}
                <Route path="/dashboard/manage-talentpool" element={<ManageTalentPool />} /> {/* Manage Talent Pool route */}
                <Route path="/dashboard/finance" element={<FinanceExternal />} />
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
