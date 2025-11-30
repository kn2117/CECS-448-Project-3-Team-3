

function Dropdown({current, choices, onClick}){
    const items = choices.sort((a,b) => {
        let first = a.split(' ')
        let second = b.split(' ')
        if (first[1] == second[1]){
            return a.localeCompare(b)
        }
        return Number(second[1]) - Number(first[1])
    })
    const handle = (event) =>{
        onClick(event.target.value)
    }
    return(
        <select value={current} onChange={handle} style={{height:'100%', width:'fit-content', 
            fontSize:24, backgroundColor:'#D9D9D9', color:'black',
            borderRight:'2px solid black'}}> 
                {items.map(element => (
                    <option key={element} value ={element} style={{backgroundColor:'white', color:'black'}}>
                        {element}
                    </option>
                ))
                }
        </select>
    )

}

export default Dropdown;