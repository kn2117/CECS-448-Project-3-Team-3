// Calculate category average
export function calculateCategoryAverage(assignments) {
    // Edge case: no assignments
    if (assignments.length === 0) return null;

    // For each assignment, calculate the percentage score
    let totalPercentage = 0;
    let validAssignmentsCount = 0;

    for (const assignment of assignments) {
        if (assignment.maxScore === 0) continue; // Avoid division by zero

        const percentage = (assignment.score / assignment.maxScore) * 100;
        totalPercentage += percentage;
        validAssignmentsCount++;
    }
    // Edge case: no valid assignments
    if (validAssignmentsCount === 0) return null;

    // Calculate average percentage
    return Math.round(totalPercentage / assignments.length * 100) / 100;
}

// Calculate weighted overall grade
export function calculateWeightedGrade(course) {
    const categoryWeights = course.categoryWeights;
    
    // Group assignments by category
    const assignmentCategory = {};

    for (const assignment of course.assignments) {
        const category = assignment.category;

        // If category does not exist, create it
        if (!assignmentCategory[category]) {
            assignmentCategory[category] = [];
        }

        assignmentCategory[category].push(assignment);
    }

    // Calculate weighted overall grade
    let overallGrade = 0;

    for (const category in categoryWeights) {
        // Get weight and assignments for this category
        const weight = categoryWeights[category];
        const assignments = assignmentCategory[category];

        // Edge case: no assignments in this category
        if (!assignments || assignments.length === 0) continue;

        const categoryAverage = calculateCategoryAverage(assignments);
        if (categoryAverage === null) continue; // Edge case: no valid assignments
        const weightedScore = (categoryAverage * weight) / 100;
        overallGrade += weightedScore;
    }
    return Math.round(overallGrade * 100) / 100;

}

// Calculate unweighted overall grade
export function calculateUnweightedGrade(course) {
    return calculateCategoryAverage(course.assignments);
}

// Letter grade conversion
export function convertToLetterGrade(percentage) {
    // Edge cases
    if (percentage == null) return 'N/A'; // Null or undefined
    if (percentage < 0 || percentage > 100) return 'Invalid'; // Out of range

    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
}

// GPA Conversion
export function convertToGPA(letterGrade) {
    // Edge cases
    if (letterGrade == null) return null; // Null or undefined

    const gradeToGPA = {
        'A+': 4.0,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'D-': 0.7,
        'F': 0.0
    };

    // Return GPA or null if letter grade is invalid
    return gradeToGPA[letterGrade] !== undefined ? gradeToGPA[letterGrade] : null;
}

// Calculate overall GPA
export function calculateOverallGPA(courses) {
    // Edge case: no courses
    if (!courses || courses.length === 0) return null;

    let totalGPA = 0;
    let validCoursesCount = 0;

    for (const course of courses) {
        const unweightedGrade = calculateUnweightedGrade(course);
        const letterGrade = convertToLetterGrade(unweightedGrade);
        const gpa = convertToGPA(letterGrade);
        if (gpa !== null) {
            totalGPA += gpa;
            validCoursesCount++;
        }
    }

    // Edge case: no valid courses
    if (validCoursesCount === 0) return null;

    return Math.round((totalGPA / validCoursesCount) * 100) / 100;
}

// Focus recommendation by potential improvement
export function recommendFocusByPotential(courses) {
    // Edge case: no courses
    if (!courses || courses.length === 0) return null;

    // Calculate priority score
    const courseScores = [];

    for (const course of courses) {
        const priorityScore = (100 - course.currentGrade) * course.remainingWeight;
        
        courseScores.push({ ...course, priorityScore: priorityScore });
    }

    // Sort by priority score
    courseScores.sort((a, b) => b.priorityScore - a.priorityScore);

    return courseScores;
}

// Focus by lowest grade
export function recommendFocusByLowestGrade(courses) {
    // Edge case: no courses
    if (!courses || courses.length === 0) return null;

    // Sort by current grade
    const sortedCourses = [...courses].sort((a, b) => a.currentGrade - b.currentGrade);
    return sortedCourses;
}