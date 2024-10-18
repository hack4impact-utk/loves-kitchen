'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Image
            src="/lk-logo.jpg"
            alt="Love Kitchen Logo"
            width={100}
            height={40}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
