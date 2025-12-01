import React from 'react';
import './Dashboard.css';

function Dashboard({ semester, courseData }) {
    // Get courses for the current semester
    const coursesInSemester = Object.values(courseData).filter(
        course => course.semester === semester
    );

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p style={{ color: '#666', fontSize: '18px', textAlign: 'center', marginTop: '40px' }}>
                Add dashboard
            </p>
            {/* Dashboard */}
        </div>
    );
}

export default Dashboard;
