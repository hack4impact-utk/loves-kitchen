import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface VolunteerDrawerProps {
  open: boolean;
  onClose: () => void;
  volunteerName: string | null;
}

const VolunteerDrawer: React.FC<VolunteerDrawerProps> = ({
  open,
  onClose,
  volunteerName,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 300, padding: '1rem' },
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="div">
          Volunteer Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Typography variant="body1">
          {volunteerName ? `Name: ${volunteerName}` : 'No volunteer selected'}
        </Typography>
      </div>
    </Drawer>
  );
};

export default VolunteerDrawer;
