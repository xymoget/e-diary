// src/components/StudentDashboard.js

import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
    CalendarToday as CalendarTodayIcon,
    School as SchoolIcon,
    ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import AuthService from '../services/authService';
import StudentSchedule from './StudentSchedule';
import StudentMarksTable from './StudentMarksTable';
// ... import other student-related components if any ...

function StudentDashboard() {
  const drawerWidth = 240;

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Student Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/student/schedule">
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="My Schedule" />
            </ListItem>
            <ListItem button component={Link} to="/student/marks">
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="My Marks" />
            </ListItem>
            {/* Add more menu items here if needed */}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* Routes */}
        <Routes>
          {/* Default Route */}
          <Route
            path="/"
            element={
              <Typography paragraph>
                Welcome to your dashboard! Use the menu to view your schedule.
              </Typography>
            }
          />
          {/* My Schedule */}
          <Route path="schedule" element={<StudentSchedule />} />
          {/* Catch-All Route */}
          <Route path="marks" element={<StudentMarksTable />} />
          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default StudentDashboard;
