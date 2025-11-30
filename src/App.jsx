import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CourseManagement from './CourseManagement'
import { Button, TextField } from '@mui/material'
import Footer from './footer'
import Dropdown from './dropdown'
import Body from './Body'

function App() {
  const [semesters, setSemesters] = useState({
    'Fall 2025': ['test1', 'test2'],
    'Spring 2025': ['test3', 'test4']
  });
  //const semesters =['Fall 2025', 'Spring 2025', 'Fall 2024', 'Spring 2024'];
  const [semester, setSemester] = useState('Fall 2025');
  const [course, setCourse] = useState('test1');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [documentName, setDocumentName] = useState("Grade Dashboard");


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
        {/*add header.jsx*/}
        {/*Testing */}
        <Dropdown choices={Object.keys(semesters)} current={semester} onClick={setSemester} />
        <TextField 
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          style={{ marginLeft: '10px', marginRight: '10px'}}
          sx={{ width: `${Math.ceil(documentName.length * 1.7)+2}ch`}}
          inputProps={{ style: { fontSize: 24}}}
          />
        <Button style={{ fontSize: '16px', color: 'black', border: '2px solid black', borderRadius: 10, height: '75%' }} onClick={() => { setOpenDialog(true); setDialogMode("edit") }}>
          Edit Course
        </Button>
      </div>
      <div class='body'>
        <Body />
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
