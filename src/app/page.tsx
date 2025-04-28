import React from 'react';
import NavBar from '@/components/NavBar';
import { Box, Typography } from '@mui/material';
import lktheme from '@/types/colors';
import UserGreet from '@/components/UserGreet';

const Main = () => {
  return (
    <>
      <NavBar />
      <div
        className="flex flex-col items-center text-white min-h-screen pb-[64px]"
        style={{ backgroundColor: lktheme.offWhite }}
      >
        <Box
          sx={{
            mt: 0,
            mb: 2,
            width: '100%',
            height: {xs: 300, sm: 500, md: 700 }, //change height with screen size
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
          </a>
        </Box>

        <UserGreet />

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
