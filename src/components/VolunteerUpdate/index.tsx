import { IVolunteer } from '@/server/models/Volunteer';
import React, { useState, useEffect } from 'react';

interface VolunteerUpdateProps {
  vol: IVolunteer | undefined;
  authID: string;
}

const VolunteerUpdate = (props: VolunteerUpdateProps) => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // You could fetch current address/phone here if needed
    // Example: Fetch volunteer details by authID (optional)
    if (props.vol != undefined) {
      setAddress(props.vol.address);
      setPhone(props.vol.phone);
    }
  }, [props.vol]);

  const handleSubmit = async () => {
    if (props.vol) {
      try {
        const newVol = props.vol;
        newVol.address = address;
        newVol.phone = phone;
        const response = await fetch(`/api/volunteers/${props.authID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVol),
        });

        const result = await response.json();
        if (result.success) {
          setMessage('Update successful!');
        } else {
          setMessage('Update failed.');
        }
      } catch (error) {
        console.error(error);
        setMessage('An error occurred during update.');
      }
    }
  };

  return (
    <>
      {/* <h3 className='text-2xl'>Update Your Information</h3> */}
      <div className="flex flex-col items-center text-white gap-5 mt-5">
        <label>
          {/* Address: */}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter new address"
            className="bg-transparent border-b-2 border-b-neutral-400 focus:border-b-white outline-none"
          />
        </label>

        <label>
          {/* Phone: */}
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter new phone number"
            className="bg-transparent border-b-2 border-b-neutral-400 focus:border-b-white outline-none"
          />
        </label>

        <button
          onClick={handleSubmit}
          className="px-3 py-2 hover:bg-green-500 bg-green-600 rounded-lg"
        >
          Update
        </button>
      </div>

      <p className="text-white">{message}</p>
    </>
  );
};

export default VolunteerUpdate;
