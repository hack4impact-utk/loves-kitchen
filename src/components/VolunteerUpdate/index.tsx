import React, { useState, useEffect } from 'react';

interface VolunteerUpdateProps {
  authID: string;
}

const VolunteerUpdate = (props: VolunteerUpdateProps) => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // You could fetch current address/phone here if needed
    // Example: Fetch volunteer details by authID (optional)
  }, [props.authID]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/volunteers/${props.authID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          phone: phone,
        }),
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
  };

  return (
    <div>
      <h3>Update Your Information</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter new address"
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter new phone number"
          />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default VolunteerUpdate;
