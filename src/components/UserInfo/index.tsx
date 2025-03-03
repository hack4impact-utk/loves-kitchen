'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import lktheme from '@/types/colors';
import VolunteerUpdate from '../VolunteerUpdate';

const UserInfo = () => {
  const { user, error, isLoading } = useUser();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const toggleCheckIn = () => {
    setIsCheckedIn((prev) => !prev);
  };

  if (error) {
    console.log('Error: failed to load user credentials.');
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1e88d4', // Primary color for MUI components
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {typeof user != 'undefined' ? (
        <>
          <Box
            className={
              'flex flex-col items-center px-3 py-5 rounded-xl w-[50vw] relative'
            }
            sx={{
              backgroundColor: lktheme.brown,
            }}
          >
            {/* LOGIN SUCCESSFULL */}
            {/* <VolunteerUpdate authID = {user.sub!} /> */}
            <VolunteerUpdate authID={user.sub ?? ''} />

            <Image
              src={user.picture ?? ''}
              alt={user.name ?? ''}
              width={100}
              height={100}
              priority
              className="rounded-full m-5"
            />
            <Typography variant="h5" className="mt-2 text-2xl text-white">
              {user.name}
            </Typography>
            <Typography variant="body1" className="text-[#a7a7a7]">
              {user.email}
            </Typography>
            {/* Alert using MUI that displays if a user is checked in. */}
            <Alert
              icon={
                isCheckedIn ? (
                  <CheckIcon fontSize="inherit" />
                ) : (
                  <ErrorIcon fontSize="inherit" />
                )
              }
              className="my-3"
              severity={isCheckedIn ? 'success' : 'warning'} // Change severity based on status
            >
              {isCheckedIn ? 'Checked in.' : 'Not checked in.'}{' '}
              {/* Change display message */}
            </Alert>
            <Button
              variant="contained"
              onClick={toggleCheckIn}
              className="absolute bottom-5 left-5"
              sx={{
                backgroundColor: lktheme.darkCyan,
              }}
            >
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </Button>
          </Box>
        </>
      ) : isLoading ? (
        <>
          {' '}
          {/* LOGIN PENDING */}
          <Box
            className="flex flex-col items-center px-3 py-5 rounded-xl w-[50vw] relative min-h-[316px]"
            sx={{ backgroundColor: lktheme.brown }}
          />
        </>
      ) : (
        <>
          {' '}
          {/* ERROR OR LOGGED OUT */}
          <Box
            className="flex flex-col items-center px-3 py-5 rounded-xl w-[50vw] relative min-h-[316px]"
            sx={{ backgroundColor: lktheme.brown }}
          >
            <Typography variant="h5" className="text-2xl text-white">
              Loading...
            </Typography>
            {/* Add any loading spinner or animation */}
            <Typography variant="body1" className="text-[#a7a7a7]">
              Please wait, we are loading your information.
            </Typography>
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default UserInfo;
