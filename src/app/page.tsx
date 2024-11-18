'use client';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import NavBar from '@/components/NavBar';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';

const Main = () => {
  // get auth0 server information and make basic loading screen
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-slate-900 text-white min-h-screen">
        <Box
          sx={{
            mt: 20,
            mb: 2,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '12px', // Rounded corners for the box container
            overflow: 'hidden', // Ensure the image doesn't overflow the box with rounded corners
          }}
        >
          {/* Link component for better interactivity */}
          <Link href="/" passHref>
            <Image
              src="/lk-logo.jpg"
              alt="Love Kitchen Logo"
              width={500}
              height={200}
              layout="intrinsic"
              className="rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
              // Adding rounded corners to the image and scaling effect on hover
            />
          </Link>
        </Box>

        {/* If user is logged in. */}
        {user && user.email && user.name ? (
          <>
            <Box className="text-center p-5">
              <Typography variant="h5" className="text-2xl">
                Hello, {user.name}!
              </Typography>
            </Box>
          </>
        ) : (
          // Render an else statement, e.g., a message to log in
          <Box className="text-center p-5">
            <Typography variant="h5" className="text-2xl">
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
          className="bg-slate-700 flex flex-col px-6 py-5 rounded-xl"
          sx={{
            width: '50%', // Set the width to 50% of the page
          }}
        >
          <Typography variant="h5" className="mt-2 text-2xl text-left">
            About
          </Typography>
          <Typography
            variant="body1"
            className="text-neutral-400 items-center"
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

        {/* login logout buttons */}
        <div className="flex mt-5">
          <a
            href="/api/auth/login"
            className="py-2 px-7 m-2 bg-green-500 hover:bg-green-600 block rounded-xl"
          >
            Log In
          </a>
          <a
            href="/api/auth/logout"
            className="py-2 px-7 m-2 bg-red-500 hover:bg-red-600 block rounded-xl"
          >
            Log Out
          </a>
        </div>
      </div>
    </>
  );
};

export default Main;
