'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface AccountMenuProps {
  user: UserProfile | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

export default function AccountMenu(props: AccountMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { push } = useRouter();
  const handleClose = (route: string) => {
    if (route != '') push(route);
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {typeof props.user != 'undefined' ? (
          <>
            {' '}
            {/* USER LOADED SUCCESSFULLY */}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Image
                  src={props.user.picture ?? ''}
                  alt={props.user.name ?? ''}
                  width={32}
                  height={32}
                  priority
                  className="rounded-full"
                />
              </IconButton>
            </Tooltip>
          </>
        ) : props.isLoading ? (
          <>
            {' '}
            {/* USER LOADING */}
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </>
        ) : (
          <>
            {' '}
            {/* NOT SIGNED IN OR ERROR */}
            <Button
              color="inherit"
              href="/api/auth/login"
              sx={{ color: 'white' }}
            >
              Log In
            </Button>
          </>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={() => {
          handleClose('');
        }}
        onClick={() => {
          handleClose('');
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleClose('');
          }}
        >
          {typeof props.user != 'undefined' ? props.user.name : 'Name'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose('');
          }}
        >
          {typeof props.user != 'undefined' ? props.user.email : 'Email'}
        </MenuItem>

        <a href="/api/auth/logout">
          <MenuItem>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </a>
      </Menu>
    </React.Fragment>
  );
}
