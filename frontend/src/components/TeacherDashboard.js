import React, { useEffect, useState } from 'react';
import api from '../services/api';

function TeacherDashboard() {
    const [lessons, setLessons] = useState([]);
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        // Fetch lessons and schedules
    }, []);

    return (
        <div className="teacher-dashboard">
        <h2>Teacher Dashboard</h2>
        {/* Display lessons and schedules */}
        {/* Links or buttons to create new schedules, marks, hometasks */}
        </div>
    );
}

export default TeacherDashboard;
