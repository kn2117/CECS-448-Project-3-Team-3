import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CourseManagement from './CourseManagement'
import GradeViews from './GradeViews'
import { Button } from '@mui/material'
function App() {
  const [semester, setSemester] = useState('Fall 2025');
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div id='root'>
      <div class='header'>
        {/*add header.jsx*/}
      </div>
      <div class='body'>
        {/*add body.jsx*/}
        <CourseManagement open={openDialog} onClose={() => setOpenDialog(false)} />
        <GradeViews semester={semester} />
      </div>
      <div class='footer'>
        <Button style={{fontSize:'24px', color:'black'}} onClick={() => setOpenDialog(true)}>
          +
        </Button>
        {/*add footer.jsx*/}
      </div>
    </div>
  )
}

export default App
