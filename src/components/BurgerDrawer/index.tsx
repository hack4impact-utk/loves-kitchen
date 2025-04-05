import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function TopDrawer() {
  const { user } = useUser();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setOpen(open);
    };

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const DrawerList = (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#F9F9F9',
        color: 'black',
        padding: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {['user', 'staff', 'home'].map((text) => (
          <React.Fragment key={text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  handleNavigation(text === 'home' ? '/' : `/${text}`)
                }
              >
                <ListItemText
                  primary={text}
                  sx={{
                    textAlign: 'left',
                    color: '#6F4E44',
                    fontWeight: 500, // Matches button font-weight
                    fontSize: '1rem', // Matches button font size
                    textTransform: 'uppercase', // Similar to default button style
                  }}
                />
              </ListItemButton>
            </ListItem>
            {/* Add a divider between each item, except after the last item */}
            <Divider sx={{ backgroundColor: '#ccc', margin: '5px 0' }} />
          </React.Fragment>
        ))}

        {/* login/logout */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              handleNavigation(user ? '/api/auth/logout' : '/api/auth/login')
            }
          >
            <ListItemText
              primary={user ? 'logout' : 'login'}
              sx={{
                textAlign: 'left',
                color: '#6F4E44',
                fontWeight: 500, // Matches button font-weight
                fontSize: '1rem', // Matches button font size
                textTransform: 'uppercase', // Similar to default button style
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)} color="inherit">
        <MenuIcon sx={{ color: 'white' }} />
      </IconButton>
      <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
