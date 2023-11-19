import React, { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  useSnackbarStore,
  useTestimonialStore,
} from "../../zustand/GlobalStore";
import { useNavigate } from "react-router-dom";

function TestimonialMenuButton({ testimonial }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { deleteTestimonial } = useTestimonialStore();
  const { openSnackbar } = useSnackbarStore();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleClose();
  };

  const handleViewOriginalSurvey = () => {
    // Add your view original survey method logic here
    console.log("view", testimonial);
    navigate(`/surveys/${testimonial?.survey?._id}`);
    handleClose();
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteTestimonial(testimonial._id);
      setDeleteDialogOpen(false);
      openSnackbar("Deleted.", "success");
      navigate("/testimonials");
    } catch (error) {
      console.error(error);
      openSnackbar(error.message, "error");
    }
  };

  const handleDeleteCanceled = () => {
    // User canceled the deletion, close the dialog
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <Button
        aria-controls="survey-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
      >
        Options
      </Button>

      <Menu
        id="survey-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ marginRight: 1 }} />
          Delete
        </MenuItem>
        <MenuItem onClick={handleViewOriginalSurvey}>
          <ArticleIcon sx={{ marginRight: 1 }} />
          View Original Survey
        </MenuItem>
      </Menu>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCanceled}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this testimonial? </p>
          <p>
            You can re-create the testimonial from the original survey anytime.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCanceled} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TestimonialMenuButton;
