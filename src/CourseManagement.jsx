import * as React from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import './CourseManagement.css';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

function CourseManagement({ open, onClose, edit=false, semesters, addCourse, courseData }) {
    const [courseName, setCourseName] = React.useState('');
    const [semester, setSemester] = React.useState('');
    const [categories, setCategories] = React.useState([
        { name: "", weight: "" }
    ]);
    
    React.useEffect(()=>{
        setCourseName('')
        setSemester('')
        setCategories(
        [{ name: "", weight: "" }])
    },[edit])

    React.useEffect(()=>{
        if(edit){
            setCourseName(courseData.name)
            setSemester(courseData.semester)
            setCategories(Object.keys(courseData.categoryWeights).map(key=> {return {
                name:key ,  
                weight:courseData.categoryWeights[key],
            }}))  
        }
             
    },[courseData, edit])



    const handleChangeSemester = (event) => {
        setSemester(event.target.value);
    };

    const handleChangeCourseName = (event) => {
        setCourseName(event.target.value)
    };

    const handleChangeCategories = (index, field, value) => {
        const updated = [...categories];
        updated[index][field] = value;
        setCategories(updated);
        console.log(categories)
    };

    const handleSave = (semester, courseName) => {
        if(!edit)
            addCourse(semester, courseName, categories)
        else{
            courseData.name=courseName;
            courseData.semester = semester
        }
        onClose()
    };

    const addCategory = () => {
        setCategories([...categories, { name: "", weight: "" }]);
    };

    const deleteCategory = (index) => {
        const updated = categories.filter((_, i) => i !== index);
        setCategories(updated);
    };

    const title = edit ? "Edit Course" : "Add Course";
    const save = edit ? "Save" : "Add";

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <div className="firstLine">
                        <TextField className="courseName" label={`${courseName ==""?'Course name':courseName}`} onChange={handleChangeCourseName} />
                        <Box sx={{ display: "inline-block", minWidth: 200 }} className="semesterSelect">
                            <FormControl fullWidth>
                                <InputLabel>Select a Semester</InputLabel>
                                <Select
                                    value={semester}
                                    label="Select a Semester"
                                    onChange={handleChangeSemester}
                                >
                                    {Object.keys(semesters).map((semester) => (
                                        <MenuItem value={semester}>{semester}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    <div>
                       <p>Categories</p>
                        <Box sx={{ width: "100%", maxWidth: 600 }} className="categories">
                            {categories.map((cat, i) => (
                                <Grid container spacing={2} key={i} sx={{ mb: 2 }} alignItems="center">

                                    <Grid item xs={5}>
                                        <TextField
                                            label="Category Name"
                                            fullWidth
                                            value={cat.name}
                                            onChange={(e) =>
                                                handleChangeCategories(i, "name", e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={5}>
                                        <TextField
                                            label="Weight"
                                            fullWidth
                                            value={cat.weight}
                                            onChange={(e) =>
                                                handleChangeCategories(i, "weight", e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={2}>
                                        <IconButton
                                            color="error"
                                            onClick={() => deleteCategory(i)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}

                            <Box className="addButtonContainer">
                                <Button variant="contained" onClick={addCategory}>
                                    Add Category
                                    <AddIcon />
                                </Button>
                            </Box>
                        </Box>
                    </div>
                    <div className="buttons">
                        {edit && (
                            <Button variant="contained" color="error" style={{ minWidth: '100px' }} onClick={onClose}>
                                Delete
                            </Button>
                        )}
                        <Button variant="outlined" color="error" style={{ minWidth: '100px' }} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="success" style={{ minWidth: '100px' }} onClick={() => handleSave(semester, courseName)}>
                            {save}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CourseManagement;