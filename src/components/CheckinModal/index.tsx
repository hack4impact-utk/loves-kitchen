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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.end_time == '') return;

    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(
      parseInt(data.end_time.split(':')[0]),
      parseInt(data.end_time.split(':')[1])
    );
    const length = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (length <= 0) {
      alert('You must provide a time in the future!');
      return;
    }

    setLoading((prev) => !prev);
    await props.onCheckIn(data, length);
    setData({
      end_time: '',
    });
    setLoading((prev) => !prev);
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={modalStyle}>
        <h2 className="text-xl font-bold mb-4">Check In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-5">
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
