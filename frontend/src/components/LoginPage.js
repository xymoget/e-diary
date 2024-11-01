// src/components/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

// Material-UI Components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        await AuthService.login(credentials.username, credentials.password);
        const user = AuthService.getCurrentUser();
        console.log(user);
        console.log(user.role);
        if (user && user.role === 'teacher') {
            navigate('/teacher');
        } else if (user && user.role === 'student') {
            navigate('/student');
        } else {
            setError('Invalid role.');
        }
        } catch {
        setError('Invalid credentials.');
        }
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
            {/* Left Side Image */}
            <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuAK2QHSh94sQ4XpBxe-hPd068t2agl9KIxQ&s)', // Replace with your image
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) => t.palette.grey[50],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            />
            {/* Right Side Form */}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <div
                style={{
                margin: theme.spacing(8, 4),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                {/* Avatar Icon */}
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
                </Avatar>
                {/* Page Title */}
                <Typography component="h1" variant="h5">
                Sign in
                </Typography>
                {/* Error Message */}
                {error && (
                <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                    {error}
                </Alert>
                )}
                {/* Login Form */}
                <form style={{ width: '100%', mt: 1 }} onSubmit={handleLogin} noValidate>
                {/* Username Field */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={credentials.username}
                    onChange={handleChange}
                />
                {/* Password Field */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                />
                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                </form>
            </div>
            </Grid>
        </Grid>
        </ThemeProvider>
    );
}

export default LoginPage;
