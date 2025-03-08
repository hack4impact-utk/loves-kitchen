import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { IVolunteer, IVolunteerCreate } from '@/server/models/Volunteer';

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

interface UserCreateModalProps {
  open: boolean;
  is_updater: boolean;
  is_staff: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createVolunteer: (data: any) => Promise<void>;
  volunteer?: IVolunteer;
}

const UserCreateModal = (props: UserCreateModalProps) => {
  const [data, setData] = useState<IVolunteerCreate>(
    props.volunteer
      ? {
          is_staff: props.is_staff,
          firstName: props.volunteer.firstName,
          lastName: props.volunteer.lastName,
          age: props.volunteer.age,
          email: props.volunteer.email,
          phone: props.volunteer.phone,
          address: props.volunteer.address,
          password: '',
        }
      : {
          is_staff: props.is_staff,
          firstName: 'Tanguy',
          lastName: 'Abbott',
          age: 66,
          email: 'tabbott@gmail.com',
          phone: '1112223333',
          address: '111 Drive Dr',
          password: 'fakeH4Iuser!',
        }
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'number') {
      if (parseInt(e.target.value) < 0) return;
    }

    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let t: keyof IVolunteerCreate;
    for (t in data) {
      if (typeof data[t] == 'string' && data[t] === '' && t != 'password')
        return;
      if (typeof data[t] == 'number' && Number(data[t]) <= 0) return;
    }

    setLoading((prev) => !prev);
    data.age = Number(data.age);
    await props.createVolunteer(data);
    if (!props.volunteer) {
      setData({
        is_staff: props.is_staff,
        firstName: 'Tanguy',
        lastName: 'Abbott',
        age: 66,
        email: 'tabbott@gmail.com',
        phone: '1112223333',
        address: '111 Drive Dr',
        password: 'fakeH4Iuser!',
      });
    }
    setLoading((prev) => !prev);
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={modalStyle}>
        <h2 className="text-xl font-bold mb-4">
          {props.is_updater ? 'Update' : 'Create a New'}{' '}
          {props.is_staff ? 'Staff' : 'Volunteer'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-5">
            <TextField
              label="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="First Name"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={data.age}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={data.address}
              onChange={handleChange}
              fullWidth
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
              {loading ? 'Saving' : 'Save'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default UserCreateModal;

/*
firstName: string;
lastName: string;
age: number;
email: string;
phone: string;
address: string;
*/
