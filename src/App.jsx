import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CourseManagement from './CourseManagement'
import { Button } from '@mui/material'
import Footer from './footer'
function App() {
  const sem1 = ['test1', 'test2'];
  const sem2 = ['test3','test4']
  const [semester, setSemester] = useState('Fall 2025');
  const [course, setCourse] = useState(sem1[0]);
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div id='root'>
      <div class='header'>
        {/*add header.jsx*/}
        {/*Testing */}
        <p>
          {course} 
        </p>
      </div>
      <div class='body'>
        {/*add body.jsx*/}
      </div>
      <div class='footer'>
        <CourseManagement open={openDialog} onClose={() => setOpenDialog(false)} />
        <Button style={{fontSize:'24px', color:'black', borderRight:'2px solid black', borderRadius:0, height:'100%'}} onClick={() => setOpenDialog(true)}>
          +
        </Button>
        
        <Footer choices={['test1', 'test2']} current ={course} onClick={setCourse}/>
      </div>
    </div>
  )
}

export default App
