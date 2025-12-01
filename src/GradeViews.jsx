import React, { useState } from 'react';
import './GradeViews.css';
import { Button } from '@mui/material'
import AssignmentManagement from './AssignmentManagement'
import {
  calculateWeightedGrade,
  calculateUnweightedGrade,
  convertToLetterGrade,
  convertToGPA,
  calculateOverallGPA,
  recommendFocusByPotential,
  recommendFocusByLowestGrade
} from './GradeCalculator';

function GradeViews({ semester, selectedCourseName, courseData, onBackToDashboard }) {
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [dialogAssignMode, setDialogAssignMode] = useState("add");
    // Get courses for the current semester
    const coursesInSemester = Object.values(courseData).filter(
        course => course.semester === semester
    );

    // Get the selected course data
    const selectedCourseData = courseData[selectedCourseName] || coursesInSemester[0];

    const [selectedCourse, setSelectedCourse] = useState(selectedCourseData);
    const [focusMode, setFocusMode] = useState('potential'); // 'potential' or 'lowestGrade'

    // Update selected course when the selectedCourseName prop changes
    React.useEffect(() => {
        if (selectedCourseName && courseData[selectedCourseName]) {
            setSelectedCourse(courseData[selectedCourseName]);
        }
    }, [selectedCourseName, courseData]);

    // Calculate grades for each course
    const courseGrades = coursesInSemester.map(course => {
        const finalGrade = course.isWeighted
            ? calculateWeightedGrade(course)
            : calculateUnweightedGrade(course);
        const letterGrade = convertToLetterGrade(finalGrade);
        const gpa = convertToGPA(letterGrade);

        return {
            ...course,
            finalGrade: finalGrade || 0,
            currentGrade: finalGrade || 0,
            letterGrade,
            gpa: gpa || 0
        };
    });

    // Focus recommendations
    const focusRecommendations = focusMode === 'potential'
        ? recommendFocusByPotential(courseGrades)
        : recommendFocusByLowestGrade(courseGrades);

    // Calculate overall GPA
    const overallGPA = calculateOverallGPA(courseGrades);

    return (
        <div className="grade-views">
            <div className="back-to-dashboard-header">
                <button className="back-button" onClick={onBackToDashboard}>
                    ← Back to Dashboard
                </button>
                <h1>Course Detail View</h1>
            </div>

            {/* Individual course detail */}
            <div className="course-detail">
                <h2>Course Information</h2>
                {/* Course selector */}
                <div className="course-selector">
                    <label>Select Course: </label>
                    <select
                        value={selectedCourse?.name || ''}
                        onChange={(e) => setSelectedCourse(coursesInSemester.find(c => c.name === e.target.value))}
                    >
                        {coursesInSemester.map(course => (
                            <option key={course.name} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                </div>

                {/* Course details */}
                {selectedCourse ? (
                <div className="course-info">
                    <h3>{selectedCourse.name}</h3>
                    <div className="course-stats">
                        <div className="stat-card">
                            <span className="stat-label">Current Grade:</span>
                            <span className="stat-value">
                                {selectedCourse.assignments && selectedCourse.assignments.length > 0 ? (
                                    selectedCourse.isWeighted
                                        ? calculateWeightedGrade(selectedCourse).toFixed(2)
                                        : calculateUnweightedGrade(selectedCourse).toFixed(2)
                                ) : 'N/A'}%
                            </span>
                            <span className="stat-letter">
                                {selectedCourse.assignments && selectedCourse.assignments.length > 0 ? convertToLetterGrade(
                                    selectedCourse.isWeighted
                                        ? calculateWeightedGrade(selectedCourse)
                                        : calculateUnweightedGrade(selectedCourse)
                                ) : 'N/A'}
                            </span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Course Type</span>
                            <span className="stat-value">{selectedCourse.isWeighted ? 'Weighted' : 'Unweighted'}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Remaining Weight</span>
                            <span className="stat-value">{selectedCourse.isWeighted?`${selectedCourse.remainingWeight}%`:'Weights are disbabled'}</span>
                        </div>
                    </div>
                
                {/* Assignment breakdown */}
                <div className="assignment-breakdown">
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <h4>Assignments ({selectedCourse.assignments?.length || 0})</h4>
                        <Button style={{ fontSize: '24px', color: 'black', height: '100%' }} onClick={() => { setOpenAssignDialog(true); setDialogAssignMode("add"); }}>
                                +
                        </Button> 
                    </div>
                    <AssignmentManagement open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} onAdd={(data) => console.log(data)} isWeighted={selectedCourse.isWeighted} AssignCat={Object.keys(selectedCourse.categoryWeights)}/>
                    
                    {selectedCourse.assignments && selectedCourse.assignments.length > 0 ? (
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
                                {selectedCourse.assignments.map((assignment, index) => (
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

                {/* Category breakdown if weighted*/}
                {selectedCourse.isWeighted && selectedCourse.categoryWeights && (
                    <div className="category-breakdown">
                        <h4>Category Breakdown</h4>
                        <div className="categories">
                            {Object.entries(selectedCourse.categoryWeights).map(([category, weight]) => {
                                const categoryAssignments = (selectedCourse.assignments || []).filter(a => a.category === category);
                                const categoryAverage = categoryAssignments.length > 0
                                    ? (categoryAssignments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / categoryAssignments.length).toFixed(1)
                                    : 'N/A';
                                return (
                                    <div key={category} className="category-card">
                                        <span className="category-name">{category} </span>
                                        <span className="category-weight">{weight}% of grade </span>
                                        <span className="category-average">with average of {categoryAverage}% </span>
                                        <span className="category-count">({categoryAssignments.length} assignments)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                        No course selected. Please select a course from the tabs below.
                    </p>
                )}
            </div>

            {/* Overall GPA */}
            <div className="overall-gpa">
                <h2>Overall GPA View</h2>
                
                <div className="gpa-display">
                    <div className="gpa-main">
                        <span className="gpa-label">Current GPA:</span>
                        <span className="gpa-value">{overallGPA?.toFixed(2) || 'N/A'}</span>
                    </div>
                </div>

                <div className="courses-list">
                    <h3>All Courses</h3>
                    <table className="courses-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Grade</th>
                                <th>Letter</th>
                                <th>GPA Points</th>
                                <th>Assignments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseGrades.map((course, index) => (
                                <tr key={index}>
                                    <td>{course.name}</td>
                                    <td>{(course.finalGrade || 0).toFixed(2)}%</td>
                                    <td className="letter-grade">{course.letterGrade || 'N/A'}</td>
                                    <td>{(course.gpa || 0).toFixed(2)}</td>
                                    <td>{course.assignments?.length || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Focus Recommendations */}
            <div className="focus-recommendations">
                <h2>Focus Recommendations View</h2>

                <div className="focus-mode-selector">
                    <label>Focus Mode: </label>
                    <select value={focusMode} onChange={(e) => setFocusMode(e.target.value)}>
                        <option value="potential">By Potential Improvement</option>
                        <option value="lowestGrade">By Lowest Grade</option>
                    </select>
                </div>

                <div className="focus-resutls">
                    <div className="focus-description">
                        {focusMode === 'potential' ? (
                            <p>Showing courses ranked by improvement potential</p>
                        ) : (
                            <p>Showing courses ranked by lowest current grade</p>
                        )}
                    </div>

                    <div className="focus-rankings">
                        {focusRecommendations?.map((course, index) => (
                            <div key={index} className={`focus-card rank-${index + 1}`} style={{marginBottom:10}}>
                                <div className="rank-badge">
                                    <b>#{index + 1}</b>
                                </div>
                                <div className="focus-info" style={{marginLeft:20}}>
                                    <h4>{course.name}</h4>
                                    <div className="focus-stats">
                                        <span>Current: {(course.currentGrade || course.finalGrade || 0).toFixed(1)}% </span>
                                        <span>Letter: {course.letterGrade || 'N/A'} </span>
                                        {focusMode === 'potential' && course.priorityScore !== undefined && (
                                            <span>Potential Score: {course.priorityScore.toFixed(0)}</span>
                                        )}
                                    </div>
                                    {index === 0 && (
                                        <div className="focus-badge">Top Priority</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GradeViews;