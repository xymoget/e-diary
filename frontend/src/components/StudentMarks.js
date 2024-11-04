// src/components/StudentMarks.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import api from '../services/api';

function StudentMarks() {
    const { studentId } = useParams();
    const [marks, setMarks] = useState([]);

    useEffect(() => {
        fetchStudentMarks();
    }, []);

    const fetchStudentMarks = async () => {
        try {
        const response = await api.get(`/teacher/students/${studentId}/marks/`);
        setMarks(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    return (
        <div>
        <Typography variant="h5" gutterBottom>
            Student Marks
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Lesson</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Mark</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {marks.map((mark) => (
                <TableRow key={mark.id}>
                    <TableCell>{mark.schedule.lesson.name}</TableCell>
                    <TableCell>{mark.schedule.date}</TableCell>
                    <TableCell>{mark.mark}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
}

export default StudentMarks;
