import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Volunteer } from '@/server/models/Vol';
import { Divider } from '@mui/material';

interface VolunteerDrawerProps {
  open: boolean;
  onClose: () => void;
  volunteer: Volunteer;
}

const VolunteerDrawer: React.FC<VolunteerDrawerProps> = ({
  open,
  onClose,
  volunteer,
}) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ width: 500, padding: '2rem' }}>
        <Typography align="center" variant="h5" gutterBottom>
          {volunteer.name}
        </Typography>
        <Divider></Divider>
        <Typography variant="h6">Age: {volunteer.age}</Typography>
        <Typography variant="h6">
          Date Created: {new Date(volunteer.createdAt).toLocaleDateString()}
        </Typography>
      </div>
    </Drawer>
  );
};

export default VolunteerDrawer;
