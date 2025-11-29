import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CourseManagement from './CourseManagement'
import { Button } from '@mui/material'
import Footer from './footer'
function App() {
  const sem1 = ['test1', 'test2'];
  const sem2 = ['test3', 'test4']
  const [semester, setSemester] = useState('Fall 2025');
  const [course, setCourse] = useState(sem1[0]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");

  return (
    <div id='root'>
      <div class='header'>
        {/*add header.jsx*/}
        {/*Testing */}
        <p>
          {course}
        </p>
        <Button style={{ fontSize: '16px', color: 'black', border: '2px solid black', borderRadius: 10, height: '75%' }} onClick={() => {setOpenDialog(true); setDialogMode("edit")}}>
          Edit Course
        </Button>
      </div>
      <div class='body'>
        {/*add body.jsx*/}
      </div>
      <div class='footer'>
        <Button style={{ fontSize: '24px', color: 'black', borderRight: '2px solid black', borderRadius: 0, height: '100%' }} onClick={() => {setOpenDialog(true); setDialogMode("add");}}>
          +
        </Button>

        <Footer choices={['test1', 'test2']} current={course} onClick={setCourse} />
      </div>
      <CourseManagement open={openDialog} onClose={() => setOpenDialog(false)} edit={dialogMode == "edit"} />
    </div>
  )
}

export default App
