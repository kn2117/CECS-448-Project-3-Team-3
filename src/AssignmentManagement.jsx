import * as React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';

function AssignmentManagement({open, onClose, onAdd}) {
    const [assignmentName, setAssignmentName] = React.useState("");
    const [categoryName, setCategoryName] = React.useState("");
    const [score, setScore] = React.useState("");
    const [month, setMonth] = React.useState("");
    const [day, setDay] = React.useState("");
    const [year, setYear] = React.useState("");

    const handleAdd = () => {
    const assignmentData = {
      name: assignmentName,
      category: category,
      score: score,
      dueDate: `${month}/${day}/${year}`,
    };

    if (onAdd) {
      onAdd(assignmentData);
    }

    // Reset fields
    setAssignmentName("");
    setCategory("");
    setScore("");
    setMonth("");
    setDay("");
    setYear("");

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Assignment</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

          {/* Assignment Name */}
          <TextField
            label="Assignment Name"
            fullWidth
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
          />

          {/* Category dropdown */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Homework">Homework</MenuItem>
              <MenuItem value="Quiz">Quiz</MenuItem>
              <MenuItem value="Exam">Exam</MenuItem>
              <MenuItem value="Project">Project</MenuItem>
            </Select>
          </FormControl>

          {/* Score */}
          <TextField
            label="Score"
            type="number"
            fullWidth
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />

          {/* Due Date */}
          <Box>
            <h4 style={{ marginBottom: "8px" }}>Due Date</h4>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Month"
                  placeholder="MM"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label="Day"
                  placeholder="DD"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label="Year"
                  placeholder="YYYY"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2
            }}
          >
            <Button color="error" variant="contained" onClick={onClose}>
              Cancel
            </Button>

            <Button color="success" variant="contained" onClick={handleAdd}>
              Add Assignment
            </Button>
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AssignmentManagement;