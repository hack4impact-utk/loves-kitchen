import {useState, useRef} from 'react';
import {
    Box,
    Grow,
    Paper,
    Popper,
    Divider,
    MenuItem,
    MenuList,
    ListItemIcon,
    ClickAwayListener
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface DropDownProps {
    email: string;
    name: string;
}
// email, name, logout, picture
const DropDown = (props: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);


  return (
    <div className="fixed top-5 right-5">
      <Box
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onMouseEnter={() => setOpen(true)}
      >
        Profile
        <ArrowDropDownIcon />
      </Box>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          onMouseLeave={() => setOpen(false)}
        >
        {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  <MenuItem>
                    <ListItemIcon>
                      <EmailIcon fontSize="small"/>
                    </ListItemIcon>
                    {props.email}
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <PersonIcon fontSize="small"/>
                    </ListItemIcon>
                    {props.name}
                  </MenuItem>
                  <Divider/>
                  <MenuItem>
                    <a
                      href="/api/auth/logout"
                      className="bg-red-500 hover:bg-red-600 block rounded-md p-2 text-white"
                    >
                       Log Out
                    </a>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
        </Popper>
    </div>
  );
};


export default DropDown;
