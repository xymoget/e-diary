// src/components/TeacherDashboard.js

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
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import AuthService from '../services/authService';
import ManageSchedules from './ManageSchedules';
import ManageMarks from './ManageMarks';
import ManageStudents from './ManageStudents';
import ManageLessons from './ManageLessons';
import StudentMarks from './StudentMarks';

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
            <ListItem button component={Link} to="/teacher/students">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Students" />
            </ListItem>
            <ListItem button component={Link} to="/teacher/lessons">
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Lessons" />
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
        {/* Routes */}
        <Routes>
          {/* Default Route */}
          <Route
            path="/"
            element={
              <Typography paragraph>
                Welcome to your dashboard! Use the menu to manage schedules, marks, students, and lessons.
              </Typography>
            }
          />
          {/* Manage Schedules */}
          <Route path="schedules" element={<ManageSchedules />} />
          {/* Manage Marks */}
          <Route path="marks" element={<ManageMarks />} />
          {/* Manage Students */}
          <Route path="students" element={<ManageStudents />} />
          {/* Manage Lessons */}
          <Route path="lessons" element={<ManageLessons />} />
          {/* View Student Marks */}
          <Route path="students/:studentId/marks" element={<StudentMarks />} />
          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/teacher" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default TeacherDashboard;
