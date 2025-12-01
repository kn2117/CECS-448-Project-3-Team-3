import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { backdropClasses, Button } from '@mui/material';
import { Pie } from 'react-chartjs-2'; // Pie Chart
import { Line } from 'react-chartjs-2'; // Line Chart
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'; // Register Chart.js components
import { 
  calculateWeightedGrade,
  calculateUnweightedGrade,
  convertToLetterGrade,
  convertToGPA
} from './GradeCalculator';
import ChartDataLabels from 'chartjs-plugin-datalabels';


// Register the necessary Chart.js components including ArcElement for Pie chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Register ArcElement for Pie chart
);
// Dashboard Component
function Dashboard({ semester, courseData, selectedCourseName, setViewMode}) {
  // Get courses for the current semester
  const coursesInSemester = Object.values(courseData).filter(
    course => course.semester === semester
  );

  // Get the selected course data
  const selectedCourseData = courseData[selectedCourseName] || coursesInSemester[0];

  const weightedGrade = calculateWeightedGrade(selectedCourseData);
  const unweightedGrade = calculateUnweightedGrade(selectedCourseData);
  const letterGrade = convertToLetterGrade(weightedGrade);

  return (
    <div className="dashboard-root">
      <div style={{display:'flex', flexDirection:'flex-row', justifySelf:'center', height:'10%'}}>
        <h1 className="dashboard-header">{selectedCourseData.name} Dashboard</h1>
        <button className="back-button" style={{height:'50%', alignSelf:'center', marginLeft:10}} onClick={()=>setViewMode('courseDetail')}
        >
          Details →
        </button>
      </div>
      
      <div className="dashboard-container">
        <Assignments courseAssignments={selectedCourseData.assignments} />
        <GradePieChart weights={selectedCourseData.categoryWeights} weightedGrade={weightedGrade} letterGrade={letterGrade} />
        <GradeLineChart assignments={selectedCourseData.assignments} categoryWeights={selectedCourseData.categoryWeights} />
      </div>
    </div>
  );
}

// Assignments Component
function Assignments({ courseAssignments }) {
  return (
    <div className="assignments">
      <h2 className="assignments-header">
        <div></div>
        Assignments
        <Button
          style={{
            fontSize: '32px',
            color: 'black',
            borderRadius: 10,
            height: '75%',
            fontWeight: 'normal',
          }}
        >
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
                <td>
                  {assignment.score} / {assignment.maxScore}
                </td>
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

function GradePieChart({ weights, weightedGrade, letterGrade }) {
  const data = {
    labels: Object.keys(weights), // Categories (e.g. Homework, Quizzes, Exams)
    datasets: [
      {
        data: Object.values(weights), // Corresponding weights
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF'], // Colors for each category
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 14 },
        formatter: (value, context) => {
          return `${value}%`; // Show the weight of each slice
        },
      },
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <div className="grade-pie-chart">
      <h2 className="grade-pie-chart-header">Grade</h2>
      <h2 className="grade-pie-grades">{weightedGrade.toFixed(2)}% ({letterGrade})</h2>
      <h2 className="grade-pie-grades">Course Weight</h2>
      <Pie data={data} options={options} plugins={[ChartDataLabels]} height={200} />
    </div>
  );
}

function GradeLineChart({ assignments, categoryWeights, minGrade = 70 }) {
  const { dates, cumulativeGrades } = calculateIncrementalWeightedGrades(
    assignments,
    categoryWeights,
    minGrade
  );

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Grade Over Time',
        data: cumulativeGrades,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3, // smooth curves
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        min: minGrade,  // Minimum Y-axis value
        max: 100,       // Maximum Y-axis value
        title: {
          display: true,
          text: 'Grade (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div className="grade-line-chart" style={{ height: 'auto'}}>
      <h2 className="grade-line-chart-header">Grade Over Time</h2>
      <Line data={chartData} options={chartOptions} style={{padding:10}}/>
    </div>
  );
}

function calculateIncrementalWeightedGrades(assignments, categoryWeights, minGrade = 60) {
  if (!assignments || assignments.length === 0) return { dates: ['Start'], cumulativeGrades: [100] };

  const dates = ['Start'];
  const cumulativeGrades = [100]; // Start from full potential
  const accumulatedCategoryScores = {};
  const accumulatedCategoryCounts = {};

  assignments.forEach((assignment) => {
    const category = assignment.category;

    if (!accumulatedCategoryScores[category]) {
      accumulatedCategoryScores[category] = 0;
      accumulatedCategoryCounts[category] = 0;
    }

    const assignmentPercentage = (assignment.score / assignment.maxScore) * 100;
    accumulatedCategoryScores[category] += assignmentPercentage;
    accumulatedCategoryCounts[category] += 1;

    // Only consider categories that have at least one assignment
    let overallGrade = 0;
    let totalWeights = 0;

    for (const cat in categoryWeights) {
      if (accumulatedCategoryCounts[cat]) {
        const avg = accumulatedCategoryScores[cat] / accumulatedCategoryCounts[cat];
        const weight = categoryWeights[cat];
        overallGrade += (avg * weight) / 100;
        totalWeights += weight;
      }
    }

    // Normalize grade
    overallGrade = totalWeights > 0 ? (overallGrade / totalWeights) * 100 : 100;

    // Apply minimum grade floor
    overallGrade = Math.max(overallGrade, minGrade);

    dates.push(assignment.dueDate);
    cumulativeGrades.push(Math.round(overallGrade * 100) / 100);
  });

  return { dates, cumulativeGrades };
}

export default Dashboard;
