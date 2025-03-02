'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import lktheme from '@/types/colors';

const withinTime = (time: string, hours: number) => {
  const startTime = new Date(time);
  const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);
  const currentTime = new Date();

  return currentTime >= startTime && currentTime <= endTime;
};

const UserInfo = () => {
  const { user, error, isLoading } = useUser();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  useEffect(() => {
    const checkSignedIn = async () => {
      if (user != undefined) {
        const response = await fetch(`api/volunteers/${user.sub}/sessions`);
        const data = await response.json();

        if (!data.success) {
            alert('Failed to get sessions');
            return;
        }

        if (data.sessions.length != 0) {
          const session = data.sessions[0];
          withinTime(session.startTime, session.length)
            ? setIsCheckedIn(true)
            : setIsCheckedIn(false);
        }
      }
    };
    
    checkSignedIn();
  }, [user]);

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
