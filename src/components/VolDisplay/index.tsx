import { IVolunteer } from '@/server/models/Volunteer';
import lktheme from '@/types/colors';
import React from 'react';

interface VolDisplayProps {
  volunteer: IVolunteer;
}

const VolDisplay = (props: VolDisplayProps) => {
  const vol = props.volunteer;

  return (
    <div
      className="w-full p-5 rounded-2xl text-white"
      style={{ backgroundColor: lktheme.brown }}
    >
      <p className="text-3xl text-center">{`${vol.firstName} ${vol.lastName}`}</p>
      <p className="text-lg text-center text-neutral-400">
        {vol.email} | {vol.phone}
        <br />
        <i>{vol.address}</i>
      </p>
    </div>
  );
};

export default VolDisplay;
