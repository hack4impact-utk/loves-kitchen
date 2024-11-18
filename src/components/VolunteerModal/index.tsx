import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Brightness1SharpIcon from '@mui/icons-material/Brightness1Sharp';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

type Flag = {
  description: string;
  color: string;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const colorMap = {
  error: '#d32f2f',
  success: '#388e3c',
  warning: '#f57c00',
  info: '#1976d2',
};


export default function VolunteerModal() {
  const [open, setOpen] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [flag, setFlag] = useState<Flag>({ description: '', color: ''});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /* Hardcoded volunteer data */
  const volunteer = {
    name: 'Jane Harris',
    age: 29,
    accountCreated: '2023-05-01',
  };

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setFlag({ ...flag, description: event.target.value });
  }

  function addFlag(color: string) {
    if (flag.description) {
      console.log(color);
      setFlags((prev) => {
        return [...prev, {description: flag?.description, color: color}];
      });

      setFlag({ description: '', color: '' });
    }
  }

  function deleteFlag(id: number) {
    const filtered = flags.filter((_, index) => index !== id);
    setFlags(filtered);
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ backgroundColor: 'white', color: 'green', zIndex: 1000 }}
      >
        Open Volunteer Info
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Volunteer Information
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Name:</strong> {volunteer.name}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Age:</strong> {volunteer.age}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Account Created:</strong> {volunteer.accountCreated}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Flags</strong>
          </Typography>
          {flags.map((flag, index) => (
            <Box key={index} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Typography
                sx={{
                  color: colorMap[flag.color as keyof typeof colorMap] || 'black', 
                  border: `2px solid ${colorMap[flag.color as keyof typeof colorMap] || 'black'}`,
                  width: '90%',
                  padding: '3px',
                  wordBreak: 'break-word',
                  mt: 1, 
                }}
              >
                {flag.description}
              </Typography>
              <IconButton
                size="small"
                onClick={() => deleteFlag(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          {inputOpen && (
            <Box
              sx={{
                borderRadius: 2,
                mt: 2,
              }}
            >
              <TextareaAutosize
                placeholder="Add your comment here"
                minRows={3}
                maxRows={5}
                style={{ width: '100%' }}
                onChange={handleInput}
                value={flag.description}
              />
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <IconButton
                  color="success"
                  onClick={() => {
                    setFlag(prev => ({ ...prev, color: 'success' }));
                    addFlag("success");
                  }}
                >
                  <Brightness1SharpIcon/>
                </IconButton>
                <IconButton
                  color="warning"
                  onClick={() => {
                    setFlag(prev => ({ ...prev, color: 'warning' }));
                    addFlag("warning");
                  }}
                >
                  <Brightness1SharpIcon/>
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setFlag(prev => ({ ...prev, color: 'error' }));
                    addFlag("error");
                  }}
                >
                  <Brightness1SharpIcon/>
                </IconButton>  
                <IconButton
                  color="default"
                  onClick={() => {
                    setFlag(prev => ({ ...prev, color: 'default' }));
                    addFlag("default");
                  }}
                >
                  <Brightness1SharpIcon/>
                </IconButton>
              </div>
            </Box>
          )}
          <IconButton
            color="success"
            onClick={() => setInputOpen(prev => !prev)}
            sx={{display: 'block'}}
          >
            {inputOpen ? <RemoveCircleOutlineIcon fontSize='large'/> : <AddCircleOutlineIcon fontSize='large'/>}
          </IconButton>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
