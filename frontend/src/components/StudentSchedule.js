// src/components/StudentSchedule.js

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../services/api';

function StudentSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchSchedule(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const fetchSchedule = async (date) => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await api.get('/student/schedule/', {
        params: { date: formattedDate },
      });
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch schedule. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Sort schedule by period number
  const sortedSchedule = schedule.sort(
    (a, b) => a.period.number - b.period.number
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        {/* Date Picker and Navigation Arrows */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={handlePrevDay} aria-label="Previous Day">
            <ArrowBackIcon />
          </IconButton>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => {
              if (newValue) setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
            disableToolbar
            variant="inline"
            inputFormat="MM/dd/yyyy"
          />
          <IconButton onClick={handleNextDay} aria-label="Next Day">
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        {/* Schedule Title */}
        <Typography variant="h4" gutterBottom>
          My Schedule for{' '}
          {selectedDate.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>

        {/* Loading Indicator */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : sortedSchedule.length === 0 ? (
          <Typography>No scheduled lessons found for this day.</Typography>
        ) : (
          /* Schedule Table */
          <TableContainer component={Paper}>
            <Table aria-label="schedule table">
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Lesson</TableCell>
                  <TableCell>Mark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSchedule.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      {lesson.period.start_time && lesson.period.end_time
                        ? `${formatTime(lesson.period.start_time)} - ${formatTime(
                            lesson.period.end_time
                          )}`
                        : `Period ${lesson.period.number}`}
                    </TableCell>
                    <TableCell>{lesson.lesson.name}</TableCell>
                    <TableCell>
                      {lesson.mark !== null ? (
                        <Typography
                          color={
                            lesson.mark >= 8
                              ? 'success.main'
                              : lesson.mark >= 5
                              ? 'warning.main'
                              : 'error.main'
                          }
                        >
                          {lesson.mark}
                        </Typography>
                      ) : (
                        <Typography color="textSecondary">N/A</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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
    </LocalizationProvider>
  );
}

function formatTime(timeString) {
  const [hour, minute] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hour, 10));
  date.setMinutes(parseInt(minute, 10));
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  });
}

export default StudentSchedule;
