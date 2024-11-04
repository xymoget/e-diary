// src/components/ManageMarks.js

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import api from '../services/api';

function ManageMarks() {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    schedule: '',
    mark: '',
  });
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchMarks();
    fetchSchedules();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/teacher/students/'); // Assuming you have this endpoint
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await api.get('/teacher/marks/');
      setMarks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/teacher/schedules/');
      setSchedules(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      student: '',
      schedule: '',
      mark: '',
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/marks/', formData);
      fetchMarks();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Manage Marks
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Assign Mark
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Lesson</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Mark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marks.map((mark) => (
              <TableRow key={mark.id}>
                <TableCell>{mark.student.username}</TableCell>
                <TableCell>{mark.schedule.lesson.name}</TableCell>
                <TableCell>{mark.schedule.date}</TableCell>
                <TableCell>{mark.mark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Assigning Mark */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Assign Mark</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Select
              margin="normal"
              required
              fullWidth
              name="student"
              value={formData.student}
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Student</em>
              </MenuItem>
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.username}
                </MenuItem>
              ))}
            </Select>
            <Select
              margin="normal"
              required
              fullWidth
              name="schedule"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Schedule</em>
              </MenuItem>
              {schedules.map((schedule) => (
                <MenuItem key={schedule.id} value={schedule.id}>
                  {schedule.date} - {schedule.lesson.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mark"
              type="number"
              name="mark"
              value={formData.mark}
              onChange={(e) => setFormData({ ...formData, mark: e.target.value })}
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Assign
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageMarks;
