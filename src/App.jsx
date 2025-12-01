import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CourseManagement from './CourseManagement'
import SemesterManagement from './SemesterManagement'
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

  // Get semesters list from courseData
  const [semesters, setSemesters] = useState({
    'Fall 2025': ['test1', 'test2'],
    'Spring 2025': ['test3', 'test4']
  });

  const [semester, setSemester] = useState('Fall 2025');
  const [course, setCourse] = useState('test1');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [openSemesterDialog, setOpenSemesterDialog] = useState(false);
  const [semesterDialogMode, setSemesterDialogMode] = useState("add");

  const addSemester = function (semesterName) {
    if (!semesters[semesterName]) {
      setSemesters(prev => ({
        ...prev,
        [semesterName]: []
      }));
      setSemester(semesterName);
    }
  };

  const editSemester = function (oldName, newName) {
    if (oldName === newName) return; // No change

    // Update semesters list
    setSemesters(prev => {
      const updated = { ...prev };
      updated[newName] = updated[oldName]; // Copy courses to new name
      delete updated[oldName]; // Remove old name
      return updated;
    });

    // Update courseData to point to new semester
    setCourseData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(courseKey => {
        if (updated[courseKey].semester === oldName) {
          updated[courseKey] = {
            ...updated[courseKey],
            semester: newName
          };
        }
      });
      return updated;
    });

    // Update current semester if it was the one being edited
    if (semester === oldName) {
      setSemester(newName);
    }
  };

  const deleteSemester = function (semesterName) {
    // Remove semester from semesters list
    setSemesters(prev => {
      const updated = { ...prev };
      delete updated[semesterName];
      return updated;
    });

    // Remove all courses from that semester
    setCourseData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(courseKey => {
        if (updated[courseKey].semester === semesterName) {
          delete updated[courseKey];
        }
      });
      return updated;
    });

    // Switch to another semester if the deleted one was selected
    if (semester === semesterName) {
      const remainingSemesters = Object.keys(semesters).filter(s => s !== semesterName);
      if (remainingSemesters.length > 0) {
        setSemester(remainingSemesters[0]);
      }
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
          <Dropdown choices={Object.keys(semesters)} current={semester} onClick={setSemester} />
          <Button
            style={{ fontSize: '24px', color: 'black', border: '2px solid black', borderRadius: 10, height: '40px', minWidth: '40px', padding: '0' }}
            onClick={() => { setOpenSemesterDialog(true); setSemesterDialogMode("add"); }}
          >
            +
          </Button>
          <Button
            style={{ fontSize: '16px', color: 'black', border: '2px solid black', borderRadius: 10, height: '40px' }}
            onClick={() => { setOpenSemesterDialog(true); setSemesterDialogMode("edit"); }}
          >
            Edit Semester
          </Button>
        </div>
        <Button style={{ fontSize: '16px', color: 'black', border: '2px solid black', borderRadius: 10, height: '75%', marginRight: '10px' }} onClick={() => { setOpenDialog(true); setDialogMode("edit") }}>
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
      <SemesterManagement
        open={openSemesterDialog}
        onClose={() => setOpenSemesterDialog(false)}
        addSemester={addSemester}
        editSemester={editSemester}
        deleteSemester={deleteSemester}
        existingSemesters={semesters}
        currentSemester={semester}
        edit={semesterDialogMode === "edit"}
      />
    </div>
  )
}

export default App
