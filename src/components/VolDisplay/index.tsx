'use client';

import { IVolunteer, IVolunteerCreate } from '@/server/models/Volunteer';
import lktheme from '@/types/colors';
import React, { Dispatch, SetStateAction, useState } from 'react';
import UserCreateModal from '../UserCreateModal';

interface VolDisplayProps {
  volunteer: IVolunteer;
  admin: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setVolunteer: Dispatch<SetStateAction<IVolunteer | null>>;
}

const VolDisplay = (props: VolDisplayProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const vol = props.volunteer;

  async function handleUpdateUser(newVol: IVolunteerCreate) {
    await fetch(`/api/volunteers/${props.volunteer.authID}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...newVol,
        authID: props.volunteer.authID,
        checked_in: props.volunteer.checked_in,
      }),
    });

    props.setVolunteer({
      _id: props.volunteer._id,
      checked_in: props.volunteer.checked_in,
      authID: props.volunteer.authID,
      createdAt: props.volunteer.createdAt,
      flags: props.volunteer.flags,
      is_staff: props.volunteer.is_staff,
      firstName: newVol.firstName,
      lastName: newVol.lastName,
      age: newVol.age,
      email: newVol.email,
      phone: newVol.phone,
      address: newVol.address,
    });
  }

  return (
    <div
      className="w-full p-5 rounded-2xl text-white"
      style={{ backgroundColor: lktheme.brown }}
    >
      <p className="text-3xl text-center">{`${vol.firstName} ${vol.lastName}`}</p>
      <p className="text-lg text-center text-neutral-400">
        {vol.authID}
        <br />
        {vol.email} | {vol.phone}
        <br />
        <i>{vol.address}</i>
      </p>

      {props.admin && (
        <>
          <div className="w-full flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
            >
              Edit Volunteer
            </button>
          </div>

          <UserCreateModal
            is_updater={true}
            is_staff={props.volunteer.is_staff}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            createVolunteer={handleUpdateUser || (() => Promise.resolve())}
            volunteer={props.volunteer}
          />
        </>
      )}
    </div>
  );
};

export default VolDisplay;
