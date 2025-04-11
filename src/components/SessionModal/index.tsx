import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const modalStyle = {
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

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createSession: (data: any) => Promise<void>;
}

const SessionModal = (props: SessionModalProps) => {
  const [data, setData] = useState({
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'number') {
      if (parseInt(e.target.value) < 0) return;
    }

    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.startTime === '' || data.endTime === '') return;

    const length =
      (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) /
      (1000 * 60 * 60); // in hours

    if (length <= 0) {
      alert('End time must be after start time.');
      return;
    }

    setLoading((prev) => !prev);
    await props.createSession({
      startTime: data.startTime,
      length: length,
      checked_out: true,
    });
    setData({
      startTime: '',
      endTime: '',
    });
    setLoading((prev) => !prev);
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={modalStyle}>
        <h2 className="text-xl font-bold mb-4">Create a New Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Start Time"
            name="startTime"
            type="datetime-local"
            value={data.startTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time"
            name="endTime"
            type="datetime-local"
            value={data.endTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={props.onClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving' : 'Save'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default SessionModal;
