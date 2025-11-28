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