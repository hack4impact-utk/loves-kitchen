'use client';

import React from 'react';
import NavBar from '@/components/NavBar';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Typography } from '@mui/material';
import lktheme from '@/types/colors';

const Main = () => {
  // get auth0 server information and make basic loading screen

  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <NavBar />
      <div
        className="flex flex-col items-center text-white min-h-screen"
        style={{ backgroundColor: lktheme.offWhite }}
      >
        <Box
          sx={{
            mt: 0,
            mb: 2,
            width: '100%',
            height: 700,
            backgroundImage: 'url(/realest.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <a
            href="https://thelovekitchen.com"
            className="rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[105%] hover:shadow-xl text-white text-xl font-bold"
          >
            Visit Love Kitchen
          </a>
        </Box>

        {/* If user is logged in. */}
        {user && user.email && user.name ? (
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
        ) : (
          // Render an else statement, e.g., a message to log in
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

        <Box
          className="flex flex-col px-6 py-5 rounded-xl"
          sx={{
            width: '50%', // Set the width to 50% of the page
            backgroundColor: lktheme.darkCyan,
          }}
        >
          <Typography variant="h5" className="mt-2 text-2xl text-left">
            About
          </Typography>
          <Typography
            variant="body1"
            className="text-neutral-300 items-center"
            sx={{ lineHeight: '2', letterSpacing: '0.5px' }}
          >
            The Love Kitchen provides meals and emergency food packages to
            homebound, homeless, and unemployed people of all races and faiths.
            We work with local agencies to provide meals and donate services in
            the hope of promoting the self-sufficiency of those we serve.{' '}
            <br></br> Our purpose is to provide nourishment for anyone who is
            hungry and to establish a community center to serve as a haven
            supporting area children and their families. We could not accomplish
            this mission without the thousands of people who have graciously
            given their time and services over the last three decades.
          </Typography>
        </Box>
      </div>
    </>
  );
};

export default Main;
