'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';
import Button from '@mui/material/Button';
import AccountMenu from '../AccountMenu';
import BurgerDrawer from '../BurgerDrawer';
import lktheme from '@/types/colors';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useMediaQuery } from '@mui/material';
import OtherLinks from '../OtherLinks';

export default function ButtonAppBar() {
  const { user, error, isLoading } = useUser();
  const isMobile = useMediaQuery('(max-width: 770px)'); // can be adjusted

  return (
    // Seemingly redundant box allows for navbar not to take up vertical space
    <Box sx={{ height: 0, position: 'relative', width: '100%' }}>
      {/* Absolute positioning allows for navbar child to be taller than parent */}
      <Box
        sx={{
          minHeight: '64px',
          flexGrow: 1,
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
        }}
      >
        {/* What logo to show depending on if mobile */}
        {isMobile ? (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: -48,
                left: -37,
                backgroundColor: lktheme.darkCyan,
                padding: 2,
                paddingTop: 6,
                boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                zIndex: 2,
                borderRadius: 4,
                cursor: 'pointer',
                scale: 96 / 149,
              }}
              onClick={() => (window.location.href = '/')}
            >
              <Image
                src="/lk-logo-transparent.png"
                alt="Love Kitchen Logo"
                width={285}
                height={117}
                priority
                style={{ width: 'auto', height: 'auto' }}
                unoptimized
              />
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: 50,
                backgroundColor: lktheme.darkCyan,
                padding: 2,
                paddingTop: 5,
                borderRadius: 4,
                boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                zIndex: 2,
                cursor: 'pointer',
                scale: 1,
              }}
              onClick={() => (window.location.href = '/')}
            >
              <Image
                src="/lk-logo-transparent.png"
                alt="Love Kitchen Logo"
                width={285}
                height={117}
                priority
                style={{ width: 'auto', height: 'auto' }}
                unoptimized
              />
            </Box>
          </>
        )}

        <AppBar position="static" color="inherit">
          <Toolbar
            sx={{
              minHeight: '64px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: lktheme.brown,
            }}
          >
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, paddingLeft: 46 }}>
                <Button color="inherit" href="/" sx={{ color: 'white' }}>
                  home
                </Button>
                <Button color="inherit" href="/user" sx={{ color: 'white' }}>
                  user
                </Button>
                <OtherLinks />
              </Box>
            )}

            <Box
              sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
            >
              {isMobile ? (
                <BurgerDrawer />
              ) : (
                <AccountMenu user={user} error={error} isLoading={isLoading} />
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );
}
