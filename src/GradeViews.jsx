import { useState } from 'react';
import './GradeViews.css';
import {
  calculateWeightedGrade,
  calculateUnweightedGrade,
  convertToLetterGrade,
  convertToGPA,
  calculateOverallGPA,
  recommendFocusByPotential,
  recommendFocusByLowestGrade
} from './gradeCalculator';

function GradeViews() {
    // Mock data
    const [mockCourses] = useState([
        { 
         name: "CECS 329",
         isWeighted: true,
         categoryWeights: {
            "Homework": 30,
            "Quizzes": 20,
            "Exams": 50
         },
         assignments: [
            { name: "HW1", score: 95, maxScore: 100, category: "Homework", dueDate: "2024-11-01" },
            { name: "Quiz1", score: 85, maxScore: 100, category: "Quizzes", dueDate: "2024-11-05" },
            { name: "Exam1", score: 90, maxScore: 100, category: "Exams", dueDate: "2024-11-10" }
         ],
         currentGrade: 87.5,
         remainingWeight: 50
        },
        { 
         name: "MATH 101",
         isWeighted: false,
         assignments: [
            { name: "HW1", score: 80, maxScore: 100, category: "Homework", dueDate: "2024-11-02" },
            { name: "Quiz1", score: 70, maxScore: 100, category: "Quizzes", dueDate: "2024-11-06" },
            { name: "Exam1", score: 75, maxScore: 100, category: "Exams", dueDate: "2024-11-11" }
         ],
         currentGrade: 75,
         remainingWeight: 40
        }
    ]);

    // State for selected view and focus mode
    const [selectedCourse, setSelectedCourse] = useState(mockCourses[0]);
    const [focusMode, setFocusMode] = useState('potential'); // 'potential' or 'lowestGrade'

    // Calculate grades for each course
    const courseGrades = mockCourses.map(course => {
        const finalGrade = course.isWeighted 
            ? calculateWeightedGrade(course) 
            : calculateUnweightedGrade(course);
        const letterGrade = convertToLetterGrade(finalGrade);
        const gpa = convertToGPA(letterGrade);

        return {
            ...course, 
            finalGrade,
            letterGrade,
            gpa
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
            <h1>Grade Views</h1>
            {/* Individual course detail */}
            <div className="course-detail">
                <h2>Course Detail View</h2>
                {/* Course selector */}
                <div className="course-selector">
                    <label>Select Course: </label>
                    <select
                        value={selectedCourse.name}
                        onChange={(e) => setSelectedCourse(mockCourses.find(c => c.name === e.target.value))}
                    >
                        {mockCourses.map(course => (
                            <option key={course.name} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                </div>

                {/* Course details */}
                <div className="course-info">
                    <h3>{selectedCourse.name}</h3>
                    <div className="course-stats">
                        <div className="stat-card">
                            <span className="stat-label">Current Grade:</span>
                            <span className="stat-value">
                                {selectedCourse.isWeighted
                                    ? calculateWeightedGrade(selectedCourse).toFixed(2)
                                    : calculateUnweightedGrade(selectedCourse).toFixed(2)}%
                            </span>
                            <span className="stat-letter">
                                {convertToLetterGrade(
                                    selectedCourse.isWeighted
                                        ? calculateWeightedGrade(selectedCourse)
                                        : calculateUnweightedGrade(selectedCourse)
                                )}
                            </span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Course Type</span>
                            <span className="stat-value">{selectedCourse.isWeighted ? 'Weighted' : 'Unweighted'}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Remaining Weight</span>
                            <span className="stat-value">{selectedCourse.remainingWeight}%</span>
                        </div>
                    </div>
                
                {/* Assignment breakdown */}
                <div className="assignment-breakdown">
                    <h4>Assignments ({selectedCourse.assignments.length})</h4>
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
                </div>

                {/* Category breakdown if weighted*/}
                {selectedCourse.isWeighted && (
                    <div className="category-breakdown">
                        <h4>Category Breakdown</h4>
                        <div className="categories">
                            {Object.entries(selectedCourse.categoryWeights).map(([category, weight]) => {
                                const categoryAssignments = selectedCourse.assignments.filter(a => a.category === category);
                                const categoryAverage = categoryAssignments.length > 0
                                    ? (categoryAssignments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / categoryAssignments.length).toFixed(1)
                                    : 'N/A';
                                return (
                                    <div key={category} className="category-card">
                                        <span className="category-name">{category}</span>
                                        <span className="category-weight">{weight}% of grade</span>
                                        <span className="category-average">Avg: {categoryAverage}%</span>
                                        <span className="category-count">({categoryAssignments.length} assignments)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                </div>
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
                                    <td>{course.finalGrade.toFixed(2)}%</td>
                                    <td className="letter-grade">{course.letterGrade}</td>
                                    <td>{course.gpa.toFixed(2)}</td>
                                    <td>{course.assignments.length}</td>
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
                            <div key={index} className={`focus-card rank-${index + 1}`}>
                                <div className="rank-badge">#{index + 1}</div>
                                <div className="focus-info">
                                    <h4>{course.name}</h4>
                                    <div className="focus-stats">
                                        <span>Current: {course.currentGrade?.toFixed(1) || course.finalGrade?.toFixed(1)}%</span>
                                        <span>Letter: {course.letterGrade || convertToLetterGrade(course.currentGrade || course.finalGrade)}</span>
                                        {focusMode === 'potential' && course.priorityScore && (
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