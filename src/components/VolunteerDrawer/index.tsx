'use client';
import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { IVolunteer } from '@/server/models/Volunteer';
import { Divider, Box } from '@mui/material';
import FlagModal from '../FlagModal';
import { ISession } from '@/server/models/Session';
import SessionTable from '../SessionTable';
import lktheme from '@/types/colors';
import UserSeshStats from '../UserSeshStats';
import VolDisplay from '../VolDisplay';
import FlagDisplay from '../FlagDisplay';

interface VolunteerDrawerProps {
  open: boolean;
  onClose: () => void;
  volunteer: IVolunteer;
  setSelectedVol: React.Dispatch<React.SetStateAction<IVolunteer | null>>;
  setVolunteers: React.Dispatch<React.SetStateAction<IVolunteer[]>>;
}

const VolunteerDrawer: React.FC<VolunteerDrawerProps> = ({
  open,
  onClose,
  volunteer,
  setSelectedVol,
  setVolunteers,
}) => {
  const [isFlagModalOpen, setFlagModalOpen] = useState(false);
  const [sessions, setSessions] = useState<ISession[]>([]);

  // Delete a session and actively update session list
  const deleteSession = async (sessionId: string): Promise<void> => {
    const response = await fetch('api/volunteers/all/sessions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const data = await response.json();

    if (data.success) {
      setSessions(sessions.filter((session) => session._id != sessionId));
    } else {
      alert('Failed to delete session');
      console.error(data.error);
    }
  };

  // Add a session and actively update session list
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addSession = async (data: any): Promise<void> => {
    const { workedBy, startTime, length } = data;
    const response = await fetch('api/volunteers/all/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workedBy,
        length,
        startTime,
      }),
    });
    const result = await response.json();
    console.log(result);

    if (result.success) {
      setSessions([...sessions, result.session]);
    } else {
      alert('Failed to add session');
      console.error(data.error);
    }
  };

  useEffect(() => {
    (async () => {
      const seshRes = await fetch(
        `/api/volunteers/${volunteer.authID}/sessions`
      );
      const seshData = await seshRes.json();
      setSessions(seshData.sessions);
    })();
  }, [volunteer]);

  const updateVolunteerFlags = (updatedVolunteer: IVolunteer) => {
    setVolunteers((prev) =>
      prev.map((vol) =>
        vol._id === updatedVolunteer._id ? updatedVolunteer : vol
      )
    );
    setSelectedVol(updatedVolunteer);
  };

  return (
    <>
      <FlagModal
        open={isFlagModalOpen}
        handleClose={() => setFlagModalOpen(false)}
        volunteer={volunteer}
        updateVolunteer={updateVolunteerFlags}
      />

      <Drawer anchor="left" open={open} onClose={onClose}>
        <div
          style={{
            width: 900,
            padding: '2rem',
            backgroundColor: lktheme.offWhite,
          }}
        >
          <VolDisplay volunteer={volunteer} />

          <Divider sx={{ my: 2 }} />

          <Box>
            <FlagDisplay flags={volunteer.flags!} />
          </Box>

          <div className="w-full flex justify-center mt-10">
            <button
              onClick={() => setFlagModalOpen(true)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              Edit Flags
            </button>
          </div>

          <Divider sx={{ my: 2 }} />

          <UserSeshStats sessions={sessions} />

          <Divider sx={{ my: 2 }} />

          <SessionTable
            sessions={sessions}
            staff
            onAddSession={addSession}
            onDeleteSession={deleteSession}
          />
        </div>
      </Drawer>
    </>
  );
};

export default VolunteerDrawer;
