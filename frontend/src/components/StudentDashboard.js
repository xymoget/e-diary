import React, { useEffect, useState } from 'react';
import api from '../services/api';

function StudentDashboard() {
    const [schedules, setSchedules] = useState([]);
    const [marks, setMarks] = useState([]);
    const [hometasks, setHometasks] = useState([]);

    useEffect(() => {
        api.get('/student/schedules/').then((response) => setSchedules(response.data));
        api.get('/student/marks/').then((response) => setMarks(response.data));
        api.get('/student/hometasks/').then((response) => setHometasks(response.data));
    }, []);

    return (
        <div className="student-dashboard">
        <h2>Student Dashboard</h2>
        {/* Display schedules, marks, and hometasks */}
        </div>
    );
}

export default StudentDashboard;
