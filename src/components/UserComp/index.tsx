'use client';

import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const UserComp = () => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: 600,
        margin: 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">user</Typography>
        <Typography variant="h6">staff</Typography>
        <Button variant="outlined" onClick={() => setIsSignedIn(!isSignedIn)}>
          {isSignedIn ? 'Sign out' : 'Sign in'}
        </Button>
      </Box>

      {isSignedIn ? (
        <Box>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Hello, Evan.
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: 2, color: isCheckedIn ? 'green' : 'red' }}
          >
            {isCheckedIn ? 'Checked in' : 'Checked out'}
          </Typography>
          <Button variant="contained" onClick={handleCheckInOut}>
            {isCheckedIn ? 'Check out' : 'Check in'}
          </Button>

          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Stats
            </Typography>
            <Typography variant="body1">Total hours: 25</Typography>
            <Typography variant="body1">Average hours: 3</Typography>
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Sessions
            </Typography>
            <Typography variant="body1">
              Session 1: 2023-11-01, 3 hours
            </Typography>
            <Typography variant="body1">
              Session 2: 2023-11-03, 5 hours
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 8 }}>
          Please sign in.
        </Typography>
      )}
    </Box>
  );
};

export default UserComp;
