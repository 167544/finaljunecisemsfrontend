import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import {
  HomeOutlined as HomeOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  BadgeOutlined as BadgeOutlinedIcon,
  GroupsOutlined as GroupsOutlinedIcon,
  LocalAtmOutlined as LocalAtmOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
} from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = {
    grey: {
      100: "#f5f5f5",
    },
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        if (onClick) {
          onClick();
        }
      }}
      icon={<Box>{icon}</Box>}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
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

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const openPowerBI = () => {
    window.open(
      "https://app.powerbi.com/groups/ad189f19-f0f0-4658-b243-e17584a83f39/reports/95ab2eba-6696-465f-95c3-55e7981469cc/ReportSection2d89fa6d7ab7b8a6c586?experience=power-bi",
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#0A2342",
        "& .pro-sidebar-inner": {
          backgroundColor: "#191C24",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          color: "white",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: "white",
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
                  Employee
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon style={{ color: "white" }} />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {!isNotUser && (
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
              to="/dashboard/customers"
              icon={<GroupsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Dynamic Metrics"
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
            <Item
              title="Finance"
              to="#"
              icon={<LocalAtmOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={openPowerBI}
            />
            <Item
              title="Finance"
              to="/dashboard/finance"
              icon={<LocalAtmOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
