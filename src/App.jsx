import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@mui/material'
function App() {
  const [semester, setSemester] = useState('Fall 2025');
  return (
    <div id='root'>
      <div class='header'>
        {/*add header.jsx*/}
      </div>
      <div class='body'>
        {/*add body.jsx*/}
      </div>
      <div class='footer'>
        <Button style={{fontSize:'24px', color:'black'}}>
          +
        </Button>
        {/*add footer.jsx*/}
      </div>
    </div>
  )
}

export default App
