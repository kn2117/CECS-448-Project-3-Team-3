import './Body.css';
import React from 'react';
import { Button, TextField } from '@mui/material'

function Body(){
    return(
        <div class = "body-container">
            <AssignmentsPage />
            <GradePieChart />
            <GradeLineChart />
        </div>
    )
}

function AssignmentsPage() {
    return (
        <div class = "assignments-page">
            <h2 class = "assignments-header">
                <div></div>
                Assignments
                <Button 
                style ={{ fontSize: '32px', color: 'black', borderRadius: 10, height: '75%', fontWeight: 'normal' }}>
                    +
                </Button>
            </h2>
            <table class = "assignments-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Category</th>
                    <th>Due Date</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
                </table>
        </div>
    );
}

function GradePieChart() {
    return (
        <div class = "grade-pie-chart">
            <h2 class = "grade-pie-chart-header">Grade</h2>
        </div>
    );
}

function GradeLineChart() {
    return (
        <div class = "grade-line-chart">
            <h2 class = "grade-line-chart-header">Grade Over Time</h2>
        </div>
    );
} 

export default Body;