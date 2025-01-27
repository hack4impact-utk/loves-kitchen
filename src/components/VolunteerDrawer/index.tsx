import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Volunteer } from '@/server/models/Vol';
import { Divider, Box } from '@mui/material';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';

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
  const colorMap = {
    error: '#d32f2f',
    success: '#388e3c',
    warning: '#f57c00',
    info: '#858585',
    default: '#000000',
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ width: 500, padding: '2rem' }}>
        <Typography align="center" variant="h5" gutterBottom>
          {volunteer.name}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Flags
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {volunteer.flags?.map((flag, index) => (
              <OutlinedFlagIcon
                key={index}
                style={{
                  color: 'transparent',
                  stroke:
                    colorMap[flag.color as keyof typeof colorMap] ||
                    colorMap.default,
                  strokeWidth: '1.5',
                }}
              />
            ))}
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />

        <div className="flex gap-5">
          <div className="w-[300px] h-[150px] rounded-xl p-5 bg-black bg-opacity-50 flex flex-col justify-around">
            <p className="text-neutral-300">Total Hours</p>
            <p className="text-white text-[40px]">10.5</p>
          </div>

          <div className="w-[300px] h-[150px] rounded-xl p-5 bg-black bg-opacity-50 flex flex-col justify-around">
            <p className="text-neutral-300">Average Session</p>
            <p className="text-white text-[40px]">2 Hours</p>
          </div>
        </div>
        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Sessions
        </Typography>
        {volunteer.sessions && volunteer.sessions.length > 0 ? (
          volunteer.sessions.map((session, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                p: 1,
                borderRadius: '8px',
                mb: 1,
              }}
            >
              <Typography>
                <strong>Date:</strong>{' '}
                {new Date(session.date).toLocaleDateString('en-US')}
              </Typography>
              <Typography>
                <strong>Length:</strong> {session.length} hours
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No sessions available.</Typography>
        )}
      </div>
    </Drawer>
  );
};

export default VolunteerDrawer;
