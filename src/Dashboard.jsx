import React from 'react';
import './Dashboard.css';
import { Button} from '@mui/material'
import {
  calculateWeightedGrade,
  calculateUnweightedGrade,
  convertToLetterGrade,
  convertToGPA,
  calculateOverallGPA,
  recommendFocusByPotential,
  recommendFocusByLowestGrade
} from './gradeCalculator';
import {PieChart} from '@mui/x-charts/PieChart';
import { useState } from 'react';


function Dashboard({ semester, courseData, selectedCourseName }) {
    // Get courses for the current semester
    const coursesInSemester = Object.values(courseData).filter(
        course => course.semester === semester
    );

     // Get the selected course data
    const selectedCourseData = courseData[selectedCourseName] || coursesInSemester[0];
    
    return (
        <div className="dashboard-root">
            <h1 className="dashboard-header"> {selectedCourseData.name} Dashboard </h1>
            <div className="dashboard-container">
                <Assignments  courseAssignments={selectedCourseData.assignments}/>
                <GradePieChart weights={selectedCourseData.categoryWeights} assignments={selectedCourseData.assignments} />
                <GradeLineChart />
            </div>
            {/* Dashboard */}
        </div>
    );
}

function Assignments({ courseAssignments }) {
    return (
        <div className = "assignments">
            <h2 className = "assignments-header">
                <div></div>
                Assignments
                <Button 
                style ={{ fontSize: '32px', color: 'black', borderRadius: 10, height: '75%', fontWeight: 'normal' }}>
                    +
                </Button>
            </h2>
            {courseAssignments && courseAssignments.length > 0 ? (
                        <table className="assignments-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseAssignments.map((assignment, index) => (
                                    <tr key={index}>
                                        <td>{assignment.name}</td>
                                        <td>{assignment.category}</td>
                                        <td>{assignment.score} / {assignment.maxScore}</td>
                                        <td>{((assignment.score / assignment.maxScore) * 100).toFixed(2)}%</td>
                                        <td>{assignment.dueDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                            No assignments yet. Add assignments to see them here.
                        </p>
                    )}
        </div>
    );
}

function GradePieChart(weights, assignments, GPA, letterGra) {

const MyPieChart = () => {   
  return (
    <PieChart
      series={[
    {
      data: [
        { id: 0, value: 10, label: 'series A' },
        { id: 1, value: 15, label: 'series B' },
        { id: 2, value: 20, label: 'series C' },
      ],
    },
  ]}
      height={200}
    />
  );
};

    return (
        <div className = "grade-pie-chart">
            <h2 className = "grade-pie-chart-header">Grade</h2>
            <h2 className = "grade-pie-grades"> 88% B </h2>
            <h2 className = "grade-pie-grades"> Course Weight </h2>
            <MyPieChart />
        </div>
    );
}

function GradeLineChart() {
    return (
        <div className = "grade-line-chart">
            <h2 className = "grade-line-chart-header">Grade Over Time</h2>
        </div>
    );
} 

export default Dashboard;
