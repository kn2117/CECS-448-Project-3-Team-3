import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CourseManagement from './CourseManagement'
import GradeViews from './GradeViews'
import { Button } from '@mui/material'
import Footer from './footer'
import Dropdown from './dropdown'
function App() {
  const [semesters, setSemesters] = useState({
    'Fall 2025': ['CECS 329', 'MATH 101'],
    'Spring 2025': ['test 3', 'test 4']
  });
  const [semester, setSemester] = useState('Fall 2025');
  const [course, setCourse] = useState('CECS 329');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");

  const addCourse = function (semester, courseName) {
    setSemesters(prev => {
      const updated = { ...prev };
      updated[semester] = [...updated[semester], courseName];
      return updated;
    });
  };

  return (
    <div id='root'>
      <div class='header'>
        {/*Testing */}
        <Dropdown choices={Object.keys(semesters)} current={semester} onClick={setSemester} />
        <Button style={{ fontSize: '16px', color: 'black', border: '2px solid black', borderRadius: 10, height: '75%' }} onClick={() => { setOpenDialog(true); setDialogMode("edit") }}>
          Edit Course
        </Button>
        
      </div>
      <div class='body'>
        {/*add body.jsx*/}
        <GradeViews course={course} />
      </div>
      <div class='footer'>
        <Button style={{ fontSize: '24px', color: 'black', borderRight: '2px solid black', borderRadius: 0, height: '100%' }} onClick={() => { setOpenDialog(true); setDialogMode("add"); }}>
          +
        </Button>

        <Footer choices={semesters[semester]} current={course} onClick={setCourse} />
      </div>
      <CourseManagement open={openDialog} onClose={() => setOpenDialog(false)} edit={dialogMode == "edit"} semesters={semesters} addCourse={addCourse} />
    </div>
  )
}

export default App
