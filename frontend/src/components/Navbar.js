import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/courses', label: 'Courses', icon: <SchoolIcon /> },
    { path: '/assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarTodayIcon /> },
    { path: '/agent', label: 'AI Agent', icon: <SmartToyIcon /> },
    { path: '/chat', label: 'Chat', icon: <ChatIcon /> },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Supervity
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              startIcon={item.icon}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

