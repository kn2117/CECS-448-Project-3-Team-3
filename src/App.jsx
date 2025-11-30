import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CourseManagement from './CourseManagement'
import GradeViews from './GradeViews'
import Dashboard from './Dashboard'
import { Button } from '@mui/material'
import Footer from './footer'
import Dropdown from './dropdown'
function App() {
  const [viewMode, setViewMode] = useState('dashboard');
  const [courseData, setCourseData] = useState({
    'test1': {
      name: 'test1',
      semester: 'Fall 2025',
      isWeighted: true,
      categoryWeights: { "Homework": 30, "Quizzes": 20, "Exams": 50 },
      assignments: [],
      remainingWeight: 100
    },
    'test2': {
      name: 'test2',
      semester: 'Fall 2025',
      isWeighted: false,
      categoryWeights: {},
      assignments: [],
      remainingWeight: 100
    },
    'test3': {
      name: 'test3',
      semester: 'Spring 2025',
      isWeighted: true,
      categoryWeights: { "Labs": 40, "Midterm": 30, "Final": 30 },
      assignments: [],
      remainingWeight: 100
    },
    'test4': {
      name: 'test4',
      semester: 'Spring 2025',
      isWeighted: false,
      categoryWeights: {},
      assignments: [],
      remainingWeight: 100
    }
  });

  // Derive semesters list from courseData
  const [semesters, setSemesters] = useState({
    'Fall 2025': ['test1', 'test2'],
    'Spring 2025': ['test3', 'test4']
  });

  const [semester, setSemester] = useState('Fall 2025');
  const [course, setCourse] = useState('test1');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");

  const addCourse = function (semester, courseName, categories) {
    // Determine if weighted based on whether categories are provided
    const isWeighted = categories && categories.length > 0 && categories[0].name !== "";

    // Convert categories array to categoryWeights object
    const categoryWeights = {};
    if (isWeighted) {
      categories.forEach(cat => {
        if (cat.name && cat.weight) {
          categoryWeights[cat.name] = parseFloat(cat.weight);
        }
      });
    }

    // Calculate remaining weight
    const totalWeight = Object.values(categoryWeights).reduce((sum, w) => sum + w, 0);
    const remainingWeight = 100 - totalWeight;

    // Add to courseData
    setCourseData(prev => ({
      ...prev,
      [courseName]: {
        name: courseName,
        semester: semester,
        isWeighted: isWeighted,
        categoryWeights: categoryWeights,
        assignments: [],
        remainingWeight: remainingWeight
      }
    }));

    // Add to semesters list
    setSemesters(prev => {
      const updated = { ...prev };
      if (!updated[semester]) {
        updated[semester] = [];
      }
      updated[semester] = [...updated[semester], courseName];
      return updated;
    });

    // Set as current course
    setSemester(semester);
    setCourse(courseName);
  };

  return (
    <div id='root'>
      <div class='header'>
        {/*add header.jsx*/}
        {/*Testing */}
        <Dropdown choices={Object.keys(semesters)} current={semester} onClick={setSemester} />
        <Button style={{ fontSize: '16px', color: 'black', border: '2px solid black', borderRadius: 10, height: '75%' }} onClick={() => { setOpenDialog(true); setDialogMode("edit") }}>
          Edit Course
        </Button>
      </div>
      <div class='body'>
        {/*add body.jsx*/}
        {viewMode === 'dashboard' ? (
          <Dashboard
            semester={semester}
            courseData={courseData}
          />
        ) : (
          <GradeViews
            semester={semester}
            selectedCourseName={course}
            courseData={courseData}
            onBackToDashboard={() => setViewMode('dashboard')}
          />
        )}
      </div>
      <div class='footer'>
        <Button style={{ fontSize: '24px', color: 'black', borderRight: '2px solid black', borderRadius: 0, height: '100%' }} onClick={() => { setOpenDialog(true); setDialogMode("add"); }}>
          +
        </Button>

        <Footer
          choices={semesters[semester]}
          current={course}
          onClick={(selectedCourse) => {
            setCourse(selectedCourse);
            setViewMode('courseDetail');
          }}
        />
      </div>
      <CourseManagement open={openDialog} onClose={() => setOpenDialog(false)} edit={dialogMode == "edit"} semesters={semesters} addCourse={addCourse} />
    </div>
  )
}

export default App
