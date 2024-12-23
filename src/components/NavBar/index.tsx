'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';
import Button from '@mui/material/Button';
import AccountMenu from '../AccountMenu';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface ButtonAppBarProps {
  user: UserProfile | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

export default function ButtonAppBar(props: ButtonAppBarProps) {
  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          padding: 2,
          borderRadius: 4,
          zIndex: 1,
        }}
        onClick={() => (window.location.href = '/')}
      >
        <Image
          src="/lk-logo.jpg"
          alt="Love Kitchen Logo"
          width={200}
          height={40}
          layout="intrinsic"
        />
      </Box>

      <AppBar position="static" color="inherit">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" href="/user">
              user
            </Button>
            <Button color="inherit" href="/staff">
              staff
            </Button>
            <Button color="inherit" href="/">
              home
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AccountMenu
              user={props.user}
              error={props.error}
              isLoading={props.isLoading}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
