import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function TopDrawer() {
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
        backgroundColor: '#333',
        color: 'white',
        padding: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {['user', 'staff', 'home'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() =>
                handleNavigation(text === 'home' ? '/' : `/${text}`)
              }
            >
              <ListItemText
                primary={text}
                sx={{ textAlign: 'center', color: 'white' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Menu</Button>
      <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
