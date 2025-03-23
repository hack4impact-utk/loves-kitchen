'use client';

import lktheme from '@/types/colors';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Typography } from '@mui/material';
import React from 'react';

const UserGreet = () => {
  const { user, error, isLoading } = useUser();
  if (error) return <div>{error.message}</div>;

  return (
    <>
      {/* If user is logged in. */}
      {user && user.email && user.name ? (
        // User logged in
        <>
          <Box className="text-center p-5">
            <Typography
              variant="h5"
              className="text-2xl"
              sx={{ color: lktheme.brown }}
            >
              Hello, {user.name}!
            </Typography>
          </Box>
        </>
      ) : // Auth0 still loading?
      isLoading ? (
        // Is still loading!
        <>
          <Box className="text-center p-5">
            <Typography
              variant="h5"
              className="text-2xl"
              sx={{ color: lktheme.brown }}
            >
              Loading...
            </Typography>
          </Box>
        </>
      ) : (
        // Loaded, user not logged in
        <Box className="text-center p-5">
          <Typography
            variant="h5"
            className="text-2xl"
            sx={{ color: lktheme.brown }}
          >
            Please{' '}
            <a
              href="/api/auth/login"
              className="text-green-500 underline underline-offset-6"
            >
              log in
            </a>{' '}
            to view your profile.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default UserGreet;
