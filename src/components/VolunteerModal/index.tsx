import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { IVolunteer } from '@/server/models/Volunteer';

type VolunteerModalProps = {
  open: boolean;
  handleClose: () => void;
  volunteer: IVolunteer;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
};

const sessionStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 2,
  p: 1,
  bgcolor: 'rgba(0, 0, 0, 0.03)',
  borderRadius: '8px',
};

const mockSessions = [
  {
    date: '2024-01-01T00:00:00.000Z',
    length: 3,
    note: 'Assisted with event setup.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    length: 4.5,
    note: 'Managed registration booth.',
  },
];

export default function VolunteerModal({
  open,
  handleClose,
  volunteer,
}: VolunteerModalProps) {
  const [sessions, setSessions] = useState(mockSessions);
  const [newNote, setNewNote] = useState('');
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<
    number | null
  >(null);

  const handleAddNote = () => {
    if (selectedSessionIndex !== null && newNote.trim() !== '') {
      const updatedSessions = [...sessions];
      updatedSessions[selectedSessionIndex].note = newNote;
      setSessions(updatedSessions);
      setNewNote('');
      setSelectedSessionIndex(null);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {`${volunteer.firstName} ${volunteer.lastName}'s Information`}
        </Typography>
        <Divider />
        <Typography sx={{ mt: 2, fontSize: '18px', fontWeight: 'bold' }}>
          General Information
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Emergency Contact:</strong> {volunteer.emergencyContact}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Account Created:</strong>{' '}
          {new Date(volunteer.createdAt).toLocaleDateString('en-US')}
        </Typography>
        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ mt: 2, fontSize: '18px', fontWeight: 'bold' }}>
          Sessions
        </Typography>
        {sessions.map((session, index) => (
          <Box key={index} sx={sessionStyle}>
            <Box>
              <Typography>
                <strong>Date:</strong>{' '}
                {new Date(session.date).toLocaleDateString('en-US')}
              </Typography>
              <Typography>
                <strong>Length:</strong> {session.length} hours
              </Typography>
              {session.note && (
                <Typography sx={{ mt: 1 }}>
                  <strong>Note:</strong> {session.note}
                </Typography>
              )}
            </Box>
            <Button
              sx={{
                color: '#478c8c',
                borderColor: '#478c8c',
                '&:hover': {
                  backgroundColor: 'rgba(71, 140, 140, 0.1)',
                  borderColor: '#478c8c',
                },
              }}
              variant="outlined"
              size="small"
              onClick={() => setSelectedSessionIndex(index)}
            >
              Add Note
            </Button>
          </Box>
        ))}
        {selectedSessionIndex !== null && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ mb: 1 }}>Add a note for this session:</Typography>
            <TextareaAutosize
              minRows={3}
              maxRows={5}
              placeholder="Enter your note here"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.3)',
              }}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: '#62392b',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#502d24',
                },
              }}
              onClick={handleAddNote}
              disabled={!newNote.trim()}
            >
              Save Note
            </Button>
          </Box>
        )}
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            mt: 3,
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
}
