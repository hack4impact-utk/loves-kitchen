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
import { UserProfile } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import lktheme from '@/types/colors';

interface UserInfoProps {
  user: UserProfile | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

const UserInfo = (props: UserInfoProps) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const toggleCheckIn = () => {
    setIsCheckedIn((prev) => !prev);
  };

  if (props.error) {
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
      {typeof props.user != 'undefined' ? (
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
              src={props.user.picture ?? ''}
              alt={props.user.name ?? ''}
              width={100}
              height={100}
              priority
              className="rounded-full m-5"
            />
            <Typography variant="h5" className="mt-2 text-2xl text-white">
              {props.user.name}
            </Typography>
            <Typography variant="body1" className="text-[#a7a7a7]">
              {props.user.email}
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
      ) : props.isLoading ? (
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
            className="flex flex-col items-center justify-center px-3 py-5 rounded-xl w-[50vw] relative min-h-[316px]"
            sx={{ backgroundColor: lktheme.brown }}
          >
            <SearchIcon fontSize="large" color="primary" />
            <Typography className="text-2xl text-white">
              Hmm, can&apos;t tell who you are.
            </Typography>
            <Typography className="text-lg text-neutral-300 mb-5">
              Try logging in!
            </Typography>
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default UserInfo;
