import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Brightness1SharpIcon from '@mui/icons-material/Brightness1Sharp';
import DeleteIcon from '@mui/icons-material/Delete';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IVolunteer, IFlag } from '@/server/models/Volunteer';

const colorMap: Record<'red' | 'green' | 'orange' | 'gray', string> = {
  red: '#d32f2f',
  green: '#388e3c',
  orange: '#f57c00',
  gray: '#858585',
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
};

type FlagModalProps = {
  open: boolean;
  handleClose: () => void;
  volunteer: IVolunteer;
  updateVolunteer: (updatedVolunteer: IVolunteer) => void;
};

const FlagModal: React.FC<FlagModalProps> = ({
  open,
  handleClose,
  volunteer,
  updateVolunteer,
}) => {
  const [flags, setFlags] = useState<IFlag[]>(volunteer.flags || []);
  const [flag, setFlag] = useState<IFlag>({ description: '', color: '' });
  const [inputOpen, setInputOpen] = useState(false);

  // Sync local flags state with the volunteer's flags when the modal opens
  useEffect(() => {
    setFlags(volunteer.flags || []);
    setInputOpen(false);
  }, [volunteer, open]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setFlag({ ...flag, description: event.target.value });
  };

  const addFlag = async (
    color: 'red' | 'green' | 'orange' | 'gray'
  ): Promise<void> => {
    if (!flag.description) return;

    const response = await fetch(`/api/volunteers/${volunteer.authID}/flags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flag: {
          description: flag.description,
          color,
        },
      }),
    });

    if (response.ok) {
      const { volunteer: updatedVolunteer } = await response.json();
      setFlags(updatedVolunteer.flags || []);
      updateVolunteer(updatedVolunteer);
      setFlag({ description: '', color: '' });
    } else {
      console.error('Failed to add flag:', await response.text());
    }
  };

  const deleteFlag = async (index: number): Promise<void> => {
    const response = await fetch(`/api/volunteers/${volunteer.authID}/flags`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagIndex: index }),
    });

    if (response.ok) {
      const { volunteer: updatedVolunteer } = await response.json();
      setFlags(updatedVolunteer.flags || []);
      updateVolunteer(updatedVolunteer);
    } else {
      console.error('Failed to delete flag:', await response.text());
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Flags for {`${volunteer.firstName} ${volunteer.lastName}`}
        </Typography>

        <Typography id="modal-description" sx={{ mt: 2 }}>
          Manage flags for this volunteer:
        </Typography>

        {/* Display Flags */}
        {flags.map((flag, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Typography
              sx={{
                color: colorMap[flag.color as keyof typeof colorMap] || 'black',
                border: `2px solid ${
                  colorMap[flag.color as keyof typeof colorMap] || 'black'
                }`,
                width: '90%',
                padding: '3px',
                wordBreak: 'break-word',
              }}
            >
              {flag.description}
            </Typography>
            <IconButton size="small" onClick={() => deleteFlag(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* Add Flag Section */}
        {inputOpen && (
          <Box>
            <Box
              sx={{
                borderRadius: 2,
                mt: 2,
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <TextareaAutosize
                placeholder="Add your comment here"
                minRows={3}
                maxRows={5}
                style={{
                  width: '100%',
                  outline: 'none',
                  padding: '8px',
                  border: 'none',
                  resize: 'none',
                }}
                onChange={handleInput}
                value={flag.description}
              />
            </Box>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '8px',
              }}
            >
              {Object.keys(colorMap).map((color) => (
                <IconButton
                  key={color}
                  onClick={() =>
                    addFlag(color as 'red' | 'green' | 'orange' | 'gray')
                  }
                >
                  <Brightness1SharpIcon
                    sx={{
                      color:
                        colorMap[color as keyof typeof colorMap] ||
                        'transparent',
                      stroke:
                        colorMap[color as keyof typeof colorMap] || 'black',
                      strokeWidth: 2,
                    }}
                  />
                </IconButton>
              ))}
            </div>
          </Box>
        )}

        {/* Toggle Input */}
        <IconButton
          color="success"
          onClick={() => setInputOpen((prev) => !prev)}
          sx={{ display: 'block', mb: 3 }}
        >
          {inputOpen ? (
            <RemoveCircleOutlineIcon fontSize="large" />
          ) : (
            <AddCircleOutlineIcon fontSize="large" />
          )}
        </IconButton>

        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            mt: 2,
            color: '#478c8c',
            borderColor: '#478c8c',
            '&:hover': {
              backgroundColor: 'rgba(71, 140, 140, 0.1)',
              borderColor: '#478c8c',
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default FlagModal;
