// src/components/ManageSchedules.js

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
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import api from '../services/api';

function ManageSchedules() {
    const [schedules, setSchedules] = useState([]);
    const [open, setOpen] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [formData, setFormData] = useState({
        lesson: '',
        date: '',
        period: '',
    });

    useEffect(() => {
        fetchSchedules();
        fetchLessons();
        fetchPeriods();
    }, []);

    const fetchSchedules = async () => {
        try {
        const response = await api.get('/teacher/schedules/');
        setSchedules(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    const fetchLessons = async () => {
        try {
        const response = await api.get('/teacher/lessons/');
        setLessons(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    const fetchPeriods = async () => {
        try {
        const response = await api.get('/teacher/periods/');
        setPeriods(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    const handleOpenDialog = (schedule = null) => {
        if (schedule) {
        setSelectedSchedule(schedule);
        setFormData({
            lesson: schedule.lesson.id,
            date: schedule.date,
            period: schedule.period.id,
        });
        } else {
        setSelectedSchedule(null);
        setFormData({
            lesson: '',
            date: '',
            period: '',
        });
        }
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedSchedule(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const data = {
            date: formData.date,
            lesson_id: formData.lesson,
            period_id: formData.period,
        };
    
        if (selectedSchedule) {
            // Update schedule
            await api.put(`/teacher/schedules/${selectedSchedule.id}/`, data);
        } else {
            // Create new schedule
            await api.post('/teacher/schedules/', data);
        }
        fetchSchedules();
        handleCloseDialog();
        } catch (error) {
        console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
        await api.delete(`/teacher/schedules/${id}/`);
        fetchSchedules();
        } catch (error) {
        console.error(error);
        }
    };

    return (
        <div>
        <Typography variant="h5" gutterBottom>
            Manage Schedules
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            Create New Schedule
        </Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Lesson</TableCell>
                <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                    <TableCell>{schedule.date}</TableCell>
                    <TableCell>{schedule.period.number}</TableCell>
                    <TableCell>{schedule.lesson.name}</TableCell>
                    <TableCell align="right">
                    <Button onClick={() => handleOpenDialog(schedule)}>Edit</Button>
                    <Button color="error" onClick={() => handleDelete(schedule.id)}>
                        Delete
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Dialog for Create/Edit Schedule */}
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>{selectedSchedule ? 'Edit Schedule' : 'Create Schedule'}</DialogTitle>
            <DialogContent>
            <form onSubmit={handleSubmit}>
                <TextField
                margin="normal"
                required
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{
                    shrink: true,
                }}
                />
                <Select
                margin="normal"
                required
                fullWidth
                name="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                displayEmpty
                >
                <MenuItem value="">
                    <em>Select Period</em>
                </MenuItem>
                {periods.map((period) => (
                    <MenuItem key={period.id} value={period.id}>
                    {period.number}: {period.start_time} - {period.end_time}
                    </MenuItem>
                ))}
                </Select>
                <Select
                margin="normal"
                required
                fullWidth
                name="lesson"
                value={formData.lesson}
                onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                displayEmpty
                >
                <MenuItem value="">
                    <em>Select Lesson</em>
                </MenuItem>
                {lessons.map((lesson) => (
                    <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.name}
                    </MenuItem>
                ))}
                </Select>
                <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                    {selectedSchedule ? 'Update' : 'Create'}
                </Button>
                </DialogActions>
            </form>
            </DialogContent>
        </Dialog>
        </div>
    );
}

export default ManageSchedules;
