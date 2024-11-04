// src/components/ManageLessons.js

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
} from '@mui/material';
import api from '../services/api';

function ManageLessons() {
    const [lessons, setLessons] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await api.get('/teacher/lessons/');
            setLessons(response.data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const handleOpenDialog = (lesson = null) => {
        if (lesson) {
        setSelectedLesson(lesson);
        setFormData({
            name: lesson.name,
        });
        } else {
        setSelectedLesson(null);
        setFormData({
            name: '',
        });
        }
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedLesson(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.name.trim()) {
            alert('Lesson name is required.');
        return;
        }

        try {
        if (selectedLesson) {
            // Update existing lesson
            await api.put(`/teacher/lessons/${selectedLesson.id}/`, formData);
        } else {
            // Create new lesson
            await api.post('/teacher/lessons/', formData);
        }
        fetchLessons();
        handleCloseDialog();
        } catch (error) {
        console.error('Error saving lesson:', error);
        if (error.response && error.response.data) {
            alert(`Error: ${JSON.stringify(error.response.data)}`);
        } else {
            alert('An unexpected error occurred. Please try again.');
        }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
        try {
            await api.delete(`/teacher/lessons/${id}/`);
            fetchLessons();
        } catch (error) {
            console.error('Error deleting lesson:', error);
            alert('Failed to delete lesson. Please try again.');
        }
        }
    };

    return (
        <div>
        <Typography variant="h5" gutterBottom>
            Manage Lessons
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            Create New Lesson
        </Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                    <TableCell>{lesson.name}</TableCell>
                    <TableCell align="right">
                    <Button onClick={() => handleOpenDialog(lesson)}>Edit</Button>
                    <Button color="error" onClick={() => handleDelete(lesson.id)}>
                        Delete
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Dialog for Create/Edit Lesson */}
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>{selectedLesson ? 'Edit Lesson' : 'Create Lesson'}</DialogTitle>
            <DialogContent>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                    {selectedLesson ? 'Update' : 'Create'}
                </Button>
                </DialogActions>
            </form>
            </DialogContent>
        </Dialog>
        </div>
    );
}

export default ManageLessons;
