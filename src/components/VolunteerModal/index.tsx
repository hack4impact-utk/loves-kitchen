import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function VolunteerModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /* Hardcoded volunteer data */
  const volunteer = {
    name: 'Jane Harris',
    age: 29,
    accountCreated: '2023-05-01',
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ backgroundColor: 'white', color: 'green', zIndex: 1000 }}
      >
        Open Volunteer Info
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Volunteer Information
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Name:</strong> {volunteer.name}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Age:</strong> {volunteer.age}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Account Created:</strong> {volunteer.accountCreated}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
