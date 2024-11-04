// src/components/TeacherDashboard.js

import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
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
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import AuthService from '../services/authService';
import ManageSchedules from './ManageSchedules';
import ManageMarks from './ManageMarks';

function TeacherDashboard() {
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
            Teacher Dashboard
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
            <ListItem button component={Link} to="/teacher/schedules">
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Schedules" />
            </ListItem>
            <ListItem button component={Link} to="/teacher/marks">
              <ListItemIcon>
                <GradeIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Marks" />
            </ListItem>
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
        {/* Nested Routes */}
        <Routes>
          <Route path="schedules" element={<ManageSchedules />} />
          <Route path="marks" element={<ManageMarks />} />
          {/* Default Route */}
          <Route
            path="/"
            element={
              <Typography paragraph>
                Welcome to your dashboard! Use the menu to manage schedules and marks.
              </Typography>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default TeacherDashboard;
