import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { Link } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = {
    grey: {
      100: "#f5f5f5",
    },
  };

  const handleClick = () => {
    setSelected(title);
    if (onClick) onClick();
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={handleClick}
      icon={<Box>{icon}</Box>}
    >
      <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
        <Typography>{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = {
    grey: {
      100: "#f5f5f5",
    },
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [selected, setSelected] = useState("Dashboard");

  // Define the isNotUser variable here based on your logic
  const isNotUser = false; // Set this based on your actual logic

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const openPowerBI = () => {
    window.open(
      "https://app.powerbi.com/groups/ad189f19-f0f0-4658-b243-e17584a83f39/reports/95ab2eba-6696-465f-95c3-55e7981469cc/ReportSection2d89fa6d7ab7b8a6c586?experience=power-bi",
      "_blank"
    );
  };

  const handleFinanceClick = () => {
    window.open(
      "https://app.powerbi.com/groups/ad189f19-f0f0-4658-b243-e17584a83f39/reports/95ab2eba-6696-465f-95c3-55e7981469cc/ReportSection2d89fa6d7ab7b8a6c586?experience=power-bi",
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        "& .pro-sidebar-inner": {
          backgroundColor: "#0A2342",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          color: "white",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: "white",
        },
        "& .pro-inner-item:hover": {
          backgroundColor: "#00E5FF",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" style={{ color: "white" }}>
                  Dashboard
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon style={{ color: "white" }} />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home Page"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {isNotUser ? null : (
              <Item
                title="Manage Team"
                to="/dashboard/contacts"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            <Item
              title="Talent Pool"
              to="/dashboard/talentpool"
              icon={<BadgeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Accounts"
              to="#"
              icon={<GroupsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Diversity Metrics"
              to="/dashboard/dynamic"
              icon={<GroupsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="CIS Sourcing"
              to="/dashboard/cissourcing"
              icon={<GroupsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <MenuItem
              active={selected === "Finance"}
              style={{
                color: colors.grey[100],
              }}
              onClick={() => {
                setSelected("Finance");
                handleFinanceClick();
              }}
              icon={<Box><AccountBalanceOutlinedIcon /></Box>}
            >
              <Typography>Finance</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
