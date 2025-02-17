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
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: lktheme.darkCyan, //random color from colors.ts
          padding: 2,
          borderRadius: 4,
          zIndex: 1,
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
          <Box sx={{ display: 'flex', gap: 2 }}>
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

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AccountMenu user={user} error={error} isLoading={isLoading} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
