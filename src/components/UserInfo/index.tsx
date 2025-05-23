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
import VolunteerUpdate from '../VolunteerUpdate';
import { IVolunteer } from '@/server/models/Volunteer';

const UserInfo = () => {
  const { user, error, isLoading } = useUser();
  const [vol, setVol] = useState<IVolunteer>();

  if (error) {
    console.log('Error: failed to load user credentials.');
  }

  useEffect(() => {
    (async () => {
      if (user != undefined) {
        // if user defined, get volunteer based on authID
        const res = await fetch(`/api/volunteers/${user.sub}`, {
          method: 'GET',
        });
        const data = await res.json();

        if (data.volunteer != undefined) {
          setVol(data.volunteer);
        }
      }
    })();
  }, [user]);

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
              'flex flex-col items-center px-3 py-5 rounded-xl w-[80vw] md:w-[50vw] relative'
            }
            sx={{
              backgroundColor: lktheme.brown,
            }}
          >
            <Image
              src={user.picture ?? ''}
              alt={user.name ?? ''}
              width={100}
              height={100}
              priority
              className="rounded-full m-5"
            />
            <Typography variant="h5" className="mt-2 text-2xl text-white">
              {vol ? `${vol.firstName} ${vol.lastName}` : user.name}
            </Typography>
            <Typography variant="body1" className="text-[#a7a7a7]">
              {vol ? vol.email : user.email}
            </Typography>

            {/* Update the address and phone number? */}
            <VolunteerUpdate authID={user.sub ?? ''} vol={vol} />

            {/* Alert using MUI that displays if a user is checked in. */}
            <Alert
              icon={
                vol?.checked_in ? (
                  <CheckIcon fontSize="inherit" />
                ) : (
                  <ErrorIcon fontSize="inherit" />
                )
              }
              className="my-3"
              severity={vol?.checked_in ? 'success' : 'warning'} // Change severity based on status
            >
              {vol?.checked_in ? 'Checked in.' : 'Not checked in.'}{' '}
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
