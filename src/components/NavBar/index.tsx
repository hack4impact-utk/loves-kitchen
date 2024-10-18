'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Button from '@mui/material/Button';
// import { Link } from '@mui/material';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit">Link 1</Button>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {/* <Link href="/" passHref> */}
            <Image
              src="/lk-logo.jpg"
              alt="Love Kitchen Logo"
              width={100}
              height={40}
              layout="intrinsic"
            />
            {/* </Link> */}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit">Link 2</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
