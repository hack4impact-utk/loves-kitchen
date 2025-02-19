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

  // const colorMap: Record<'red' | 'green' | 'orange' | 'gray', string> = {
  //   red: '#d32f2f',
  //   green: '#388e3c',
  //   orange: '#f57c00',
  //   gray: '#858585',
  // };

  async function refreshSessions() {
    const seshRes = await fetch(`/api/volunteers/${volunteer.authID}/sessions`);
    const seshData = await seshRes.json();
    setSessions(seshData.sessions);
  }

  useEffect(() => {
    refreshSessions();
  }, [volunteer, refreshSessions]);

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
          <button
            onClick={() => setFlagModalOpen(true)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          >
            Modify
          </button>

          <Divider sx={{ my: 2 }} />

          <UserSeshStats sessions={sessions} />

          <Divider sx={{ my: 2 }} />

          <SessionTable sessions={sessions} staff />
        </div>
      </Drawer>
    </>
  );
};

export default VolunteerDrawer;
