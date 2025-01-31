import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Volunteer } from '@/server/models/Vol';
import { Divider, Box } from '@mui/material';

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
  const colorMap: Record<'red' | 'green' | 'orange' | 'gray', string> = {
    red: '#d32f2f',
    green: '#388e3c',
    orange: '#f57c00',
    gray: '#858585',
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ width: 500, padding: '2rem' }}>
        <Typography align="center" variant="h5" gutterBottom>
          {volunteer.name}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box>
          {volunteer.flags?.map((flag, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <Typography
                sx={{
                  color:
                    colorMap[flag.color as keyof typeof colorMap] || 'black',
                  border: `2px solid ${
                    colorMap[flag.color as keyof typeof colorMap] || 'black'
                  }`,
                  width: '90%',
                  padding: '3px',
                  wordBreak: 'break-word',
                }}
              >
                {flag.description}
              </Typography>
            </Box>
          ))}
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
