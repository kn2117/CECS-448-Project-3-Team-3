import './Body.css';
import React from 'react';

function Body(){
    return(
        <div classname = "body-container">
            <AssignmentsPage />
            <GradePieChart />
            <GradeLineChart />
        </div>
    )
}

function AssignmentsPage() {
    return (
        <div classname = "assignments-page">
            <h2>Assignments</h2>
            {/* Add assignment components here */}
        </div>
    );
}

function GradePieChart() {
    return (
        <div classname = "grade-pie-chart">
            <h2>Grade Distribution</h2>
        </div>
    );
}

function GradeLineChart() {
    return (
        <div classname = "grade-line-chart">
            <h2>Grade Over Time</h2>
        </div>
    );
} 

export default Body;