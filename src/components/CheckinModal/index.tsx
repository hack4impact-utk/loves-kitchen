import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
};

interface CheckinData {
  end_time: string;
}

interface CheckinModalProps {
  open: boolean;
  onClose: () => void;
  onCheckIn: (data: CheckinData, length: number) => Promise<void>;
}

const CheckinModal = (props: CheckinModalProps) => {
  const [data, setData] = useState<CheckinData>({
    end_time: '',
  });

  const [startTimeInput, setStartTimeInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTimeInput || !data.end_time) {
      alert('Please fill out both start and end times.');
      return;
    }

    // Convert times to Date objects on a dummy day
    const startTime = new Date(`2000-01-01T${startTimeInput}:00`);
    const endTime = new Date(`2000-01-01T${data.end_time}:00`);

    const length = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours

    if (length <= 0) {
      alert('End time must be after start time.');
      return;
    }

    setLoading(true);
    await props.onCheckIn(data, length);
    setData({ end_time: '' });
    setStartTimeInput('');
    setLoading(false);
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={modalStyle}>
        <h2 className="text-xl font-bold mb-4">Check In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-5">
            <TextField
              label="Start Time"
              name="start_time"
              type="time"
              value={startTimeInput}
              onChange={(e) => setStartTimeInput(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              name="end_time"
              type="time"
              value={data.end_time}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </div>
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
              {loading ? 'Adding' : 'Confirm'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CheckinModal;
