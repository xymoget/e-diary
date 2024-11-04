// src/components/ManageStudents.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    profile: {
      date_of_birth: '',
      address: '',
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/teacher/students/');
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        username: student.username,
        email: student.email,
        first_name: student.first_name,
        last_name: student.last_name,
        password: '',
        profile: {
          date_of_birth: student.profile.date_of_birth || '',
          address: student.profile.address || '',
        },
      });
    } else {
      setSelectedStudent(null);
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        profile: {
          date_of_birth: '',
          address: '',
        },
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!selectedStudent && !formData.password) {
      alert('Password is required for creating a new student.');
      return;
    }

    const usernameRegex = /^[\w.@+-]+$/;
    if (!usernameRegex.test(formData.username)) {
      alert('Username contains invalid characters.');
      return;
    }

    if (
      formData.profile.date_of_birth &&
      isNaN(Date.parse(formData.profile.date_of_birth))
    ) {
      alert('Date of Birth must be a valid date.');
      return;
    }

    try {
      if (selectedStudent) {
        // Update student
        await api.put(`/teacher/students/${selectedStudent.id}/`, formData);
      } else {
        // Create new student
        await api.post('/teacher/students/', formData);
      }
      fetchStudents();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving the student. Please check the input data and try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/teacher/students/${id}/`);
        fetchStudents();
      } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the student.');
      }
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Manage Students
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Create New Student
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.username}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.first_name}</TableCell>
                <TableCell>{student.last_name}</TableCell>
                <TableCell>{student.profile.date_of_birth}</TableCell>
                <TableCell>{student.profile.address}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleOpenDialog(student)}>Edit</Button>
                  <Button color="error" onClick={() => handleDelete(student.id)}>
                    Delete
                  </Button>
                  <Button onClick={() => navigate(`/teacher/students/${student.id}/marks`)}>
                    View Marks
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Create/Edit Student */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedStudent ? 'Edit Student' : 'Create Student'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            {/* Email */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {/* First Name */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            {/* Last Name */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            {/* Password */}
            {!selectedStudent && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            )}
            {/* Date of Birth */}
            <TextField
              margin="normal"
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.profile.date_of_birth}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: { ...formData.profile, date_of_birth: e.target.value },
                })
              }
            />
            {/* Address */}
            <TextField
              margin="normal"
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.profile.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: { ...formData.profile, address: e.target.value },
                })
              }
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedStudent ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageStudents;
