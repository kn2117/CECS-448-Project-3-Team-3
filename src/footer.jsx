import React from 'react';
import { Button } from '@mui/material'
import './footer.css'
function Footer({choices, onClick}){
    return(
        <div class='footer'>
            {choices.map(element => (
                <Button key={element} onClick={()=>onClick(element)}>
                    {element}
                </Button>
           ) )}
        </div>
    )
    
}

export default Footer