import * as React from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import './CourseManagement.css';

function SemesterManagement({ open, onClose, addSemester, editSemester, deleteSemester, existingSemesters, currentSemester, edit }) {
    const [semesterName, setSemesterName] = React.useState('');

    // When dialog opens in edit mode, populate with current semester name
    React.useEffect(() => {
        if (open && edit && currentSemester) {
            setSemesterName(currentSemester);
        } else if (open && !edit) {
            setSemesterName('');
        }
    }, [open, edit, currentSemester]);

    const handleChangeSemesterName = (event) => {
        setSemesterName(event.target.value);
    };

    // Normalize semester name to check for duplicates (case-insensitive, no extra spaces)
    const normalizeName = (name) => {
        return name.trim().toLowerCase().replace(/\s+/g, ' ');
    };

    const handleSave = () => {
        if (!semesterName.trim()) {
            alert('Please enter a semester name!');
            return;
        }

        const trimmedName = semesterName.trim().replace(/\s+/g, ' '); // Remove extra spaces
        const normalizedNew = normalizeName(trimmedName);

        // Check for duplicates (case-insensitive and space-insensitive)
        const duplicate = Object.keys(existingSemesters || {}).find(sem => {
            // Skip the current semester if we're editing
            if (edit && sem === currentSemester) {
                return false;
            }
            return normalizeName(sem) === normalizedNew;
        });

        if (duplicate) {
            alert(`This semester already exists as "${duplicate}"!`);
            return;
        }

        if (edit) {
            editSemester(currentSemester, trimmedName);
        } else {
            addSemester(trimmedName);
        }
        setSemesterName('');
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${currentSemester}" and all its courses?`)) {
            deleteSemester(currentSemester);
            setSemesterName('');
            onClose();
        }
    };

    const handleCancel = () => {
        setSemesterName('');
        onClose();
    };

    const title = edit ? "Edit Semester" : "Add New Semester";
    const saveButtonText = edit ? "Save" : "Add";

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <div className="firstLine" style={{ paddingTop: '10px' }}>
                    <TextField
                        className="courseName"
                        label="Semester Name"
                        placeholder="e.g., Fall 2025, Spring 2026"
                        value={semesterName}
                        onChange={handleChangeSemesterName}
                        fullWidth
                        autoFocus
                    />
                </div>
                <div className="buttons">
                    {edit && (
                        <Button variant="contained" color="error" style={{ minWidth: '100px' }} onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <Button variant="outlined" color="error" style={{ minWidth: '100px' }} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" style={{ minWidth: '100px' }} onClick={handleSave}>
                        {saveButtonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default SemesterManagement;
