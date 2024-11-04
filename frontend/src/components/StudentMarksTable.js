// src/components/StudentMarksTable.js

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
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../services/api';
import { format, parseISO } from 'date-fns';

function StudentMarksTable() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/student/marks/');
      const data = response.data;
      console.log('Fetched Marks:', data); // For debugging

      setMarks(data);

      // Extract unique dates
      const uniqueDates = Array.from(
        new Set(data.map((mark) => mark.schedule.date))
      ).sort((a, b) => new Date(a) - new Date(b));
      setDates(uniqueDates);

      // Extract unique lessons
      const uniqueLessons = Array.from(
        new Set(data.map((mark) => mark.schedule.lesson.name))
      ).sort();
      setLessons(uniqueLessons);
    } catch (error) {
      console.error('Error fetching marks:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch marks. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Create a map for quick lookup: lesson -> date -> mark
  const marksMap = {};
  marks.forEach((mark) => {
    const lessonName = mark.schedule?.lesson?.name;
    const date = mark.schedule?.date;

    if (lessonName && date) {
      if (!marksMap[lessonName]) {
        marksMap[lessonName] = {};
      }
      marksMap[lessonName][date] = mark.mark;
    }
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Marks
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      ) : marks.length === 0 ? (
        <Typography>No marks available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="marks table">
            <TableHead>
              <TableRow>
                <TableCell>Lesson</TableCell>
                {dates.map((date) => (
                  <TableCell key={date} align="center">
                    {format(parseISO(date), 'dd.MM')}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson}>
                  <TableCell component="th" scope="row">
                    {lesson}
                  </TableCell>
                  {dates.map((date) => (
                    <TableCell key={date} align="center">
                      {marksMap[lesson][date] !== undefined
                        ? marksMap[lesson][date]
                        : 'N/A'}
                    </TableCell>
                  ))}
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
  );
}

export default StudentMarksTable;
