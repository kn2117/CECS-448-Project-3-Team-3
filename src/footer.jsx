import React from 'react';
import { Button } from '@mui/material'
import './footer.css'
function Footer({choices, current, onClick}){
    return(
        <div class='footer'>
            {choices.map(element => (
                <Button style={{color:'black', height:'74px', background:current == element?'#D9D9D9':'white', 
                                borderRight:'2px solid black', borderRadius:0, 
                                paddingLeft:50,paddingRight:50}} key={element} onClick={()=>onClick(element)}>
                    {element}
                </Button>
           ) )}
        </div>
    )
    
}

export default Footer