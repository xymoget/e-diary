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
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
} from '@mui/material';
import api from '../services/api';

function ManageMarks() {
    // State to manage students, marks, schedules, and dialog visibility
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [open, setOpen] = useState(false);

    // State to manage form data
    const [formData, setFormData] = useState({
        student: '',
        schedule: '',
        mark: '',
    });

    // State to manage errors
    const [errors, setErrors] = useState({
        student: false,
        schedule: false,
        mark: false,
    });

    // State to manage Snackbar notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' | 'error' | 'warning' | 'info'
    });

    // Fetch students, marks, and schedules on component mount
    useEffect(() => {
        fetchStudents();
        fetchMarks();
        fetchSchedules();
    }, []);

    // Function to fetch students
    const fetchStudents = async () => {
        try {
            const response = await api.get('/teacher/students/'); // Ensure this endpoint exists
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            showSnackbar('Failed to fetch students.', 'error');
        }
    };

    // Function to fetch marks
    const fetchMarks = async () => {
        try {
            const response = await api.get('/teacher/marks/');
            setMarks(response.data);
        } catch (error) {
            console.error('Error fetching marks:', error);
            showSnackbar('Failed to fetch marks.', 'error');
        }
    };

    // Function to fetch schedules
    const fetchSchedules = async () => {
        try {
            const response = await api.get('/teacher/schedules/');
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            showSnackbar('Failed to fetch schedules.', 'error');
        }
    };

    // Function to open the dialog
    const handleOpenDialog = () => {
        // Reset form data and errors when opening the dialog
        setFormData({
            student: '',
            schedule: '',
            mark: '',
        });
        setErrors({
            student: false,
            schedule: false,
            mark: false,
        });
        setOpen(true);
    };

    // Function to close the dialog
    const handleCloseDialog = () => {
        setOpen(false);
    };

    // Function to handle form input changes with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Reset the error for the field being updated
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));
    };

    // Function to handle mark input with validation and auto-adjustment
    const handleMarkChange = (e) => {
        let value = e.target.value;

        // Allow empty input for flexibility
        if (value === '') {
            setFormData((prevData) => ({
                ...prevData,
                mark: '',
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                mark: false,
            }));
            return;
        }

        // Convert value to number
        value = Number(value);

        // Define min and max limits
        const min = 1;
        const max = 12;

        let isError = false;
        let errorMessage = '';

        if (value < min) {
            value = min;
            isError = true;
            errorMessage = `Mark cannot be less than ${min}.`;
        } else if (value > max) {
            value = max;
            isError = true;
            errorMessage = `Mark cannot exceed ${max}.`;
        } else if (!Number.isInteger(value)) {
            isError = true;
            errorMessage = 'Mark must be an integer.';
        }

        // Update form data with adjusted value
        setFormData((prevData) => ({
            ...prevData,
            mark: value,
        }));

        // Update error state
        setErrors((prevErrors) => ({
            ...prevErrors,
            mark: isError,
        }));

        // Show error message if there's an error
        if (isError) {
            showSnackbar(errorMessage, 'error');
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        const { student, schedule, mark } = formData;
        let valid = true;
        const newErrors = {
            student: false,
            schedule: false,
            mark: false,
        };

        if (student === '') {
            newErrors.student = true;
            valid = false;
        }
        if (schedule === '') {
            newErrors.schedule = true;
            valid = false;
        }
        if (mark === '' || mark < 1 || mark > 12 || !Number.isInteger(mark)) {
            newErrors.mark = true;
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) {
            showSnackbar('Please correct the errors before submitting.', 'error');
            return;
        }

        try {
            const data = {
                student_id: student,
                schedule_id: schedule,
                mark: mark,
            };

            await api.post('/teacher/marks/', data);
            fetchMarks();
            showSnackbar('Mark assigned successfully!', 'success');
            handleCloseDialog();
        } catch (error) {
            console.error('Error assigning mark:', error);
            showSnackbar('Failed to assign mark. Please try again.', 'error');
        }
    };

    // Function to show Snackbar notifications
    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message: message,
            severity: severity,
        });
    };

    // Function to close Snackbar
    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
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
                        {marks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No marks available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            marks.map((mark) => (
                                <TableRow key={mark.id}>
                                    <TableCell>{mark.student.username}</TableCell>
                                    <TableCell>{mark.schedule.lesson.name}</TableCell>
                                    <TableCell>
                                        {new Date(mark.schedule.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {mark.mark !== null ? mark.mark : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Assigning Mark */}
            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Assign Mark</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        {/* Select Student */}
                        <FormControl fullWidth margin="normal" required error={errors.student}>
                            <InputLabel id="student-label">Select Student</InputLabel>
                            <Select
                                labelId="student-label"
                                name="student"
                                value={formData.student}
                                label="Select Student"
                                onChange={handleInputChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {students.map((student) => (
                                    <MenuItem key={student.id} value={student.id}>
                                        {student.username} ({student.first_name} {student.last_name})
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.student && (
                                <Typography variant="caption" color="error">
                                    Please select a student.
                                </Typography>
                            )}
                        </FormControl>

                        {/* Select Schedule */}
                        <FormControl fullWidth margin="normal" required error={errors.schedule}>
                            <InputLabel id="schedule-label">Select Schedule</InputLabel>
                            <Select
                                labelId="schedule-label"
                                name="schedule"
                                value={formData.schedule}
                                label="Select Schedule"
                                onChange={handleInputChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {schedules.map((schedule) => (
                                    <MenuItem key={schedule.id} value={schedule.id}>
                                        {new Date(schedule.date).toLocaleDateString()} -{' '}
                                        {schedule.lesson.name} (
                                        {schedule.period.start_time} - {schedule.period.end_time})
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.schedule && (
                                <Typography variant="caption" color="error">
                                    Please select a schedule.
                                </Typography>
                            )}
                        </FormControl>

                        {/* Input Mark */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Mark"
                            type="number"
                            name="mark"
                            value={formData.mark}
                            onChange={handleMarkChange}
                            inputProps={{ min: 1, max: 12, step: 1 }}
                            error={errors.mark}
                            helperText={
                                errors.mark
                                    ? 'Mark must be an integer between 1 and 12.'
                                    : 'Enter a mark between 1 and 12.'
                            }
                            sx={{
                                // Remove default spin buttons in Chrome, Safari, Edge, Opera
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
                                // Remove default spin buttons in Firefox
                                '& input[type=number]': {
                                    MozAppearance: 'textfield',
                                },
                            }}
                        />

                        {/* Dialog Actions */}
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">
                                Assign
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );

}

export default ManageMarks;
