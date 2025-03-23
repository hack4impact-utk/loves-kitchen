'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';
import Button from '@mui/material/Button';
import AccountMenu from '../AccountMenu';
import lktheme from '@/types/colors';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function ButtonAppBar() {
  const { user, error, isLoading } = useUser();

  return (
    <Box
      sx={{ height: '64px', flexGrow: 1, position: 'relative', width: '100%' }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: 100,
          backgroundColor: lktheme.darkCyan,
          padding: 2,
          paddingTop: 5,
          borderRadius: 4,
          boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
          zIndex: 2,
          cursor: 'pointer',
        }}
        onClick={() => (window.location.href = '/')}
      >
        <Image
          src="/lk-logo-transparent.png"
          alt="Love Kitchen Logo"
          width={200}
          height={40}
          priority
          style={{ width: 'auto', height: 'auto' }}
        />
      </Box>

      <AppBar position="static" color="inherit">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: lktheme.brown,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, paddingLeft: 35 }}>
            <Button color="inherit" href="/user" sx={{ color: 'white' }}>
              user
            </Button>
            <Button color="inherit" href="/staff" sx={{ color: 'white' }}>
              staff
            </Button>
            <Button color="inherit" href="/" sx={{ color: 'white' }}>
              home
            </Button>
          </Box>

          <Box sx={{ marginLeft: 'auto' }}>
            <AccountMenu user={user} error={error} isLoading={isLoading} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
