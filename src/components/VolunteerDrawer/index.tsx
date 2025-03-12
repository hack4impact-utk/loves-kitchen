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
  admin: boolean;
  open: boolean;
  onClose: () => void;
  volunteer: IVolunteer;
  setSelectedVol: React.Dispatch<React.SetStateAction<IVolunteer | null>>;
  setVolunteers: React.Dispatch<React.SetStateAction<IVolunteer[]>>;
}

const VolunteerDrawer: React.FC<VolunteerDrawerProps> = ({
  admin,
  open,
  onClose,
  volunteer,
  setSelectedVol,
  setVolunteers,
}) => {
  const [isFlagModalOpen, setFlagModalOpen] = useState(false);
  const [sessions, setSessions] = useState<ISession[]>([]);

  // Delete a session and actively update session list
  const deleteSession = async (toDelete: ISession): Promise<void> => {
    const response = await fetch('api/volunteers/all/sessions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: toDelete._id }),
    });
    const data = await response.json();

    // if session hasn't been checked out of, we need to check out the volunteer!
    if (!toDelete.checked_out) {
      // check out volunteer as well
      const tmpVol = volunteer;
      tmpVol.checked_in = false;

      // update volunteer
      await fetch(`/api/volunteers/${volunteer.authID}`, {
        method: 'PUT',
        body: JSON.stringify(tmpVol),
      });
      setSelectedVol(tmpVol);
      setVolunteers((prev) => [
        ...prev.filter((vol) => vol.authID != volunteer.authID),
        tmpVol,
      ]);
    }

    if (data.success) {
      setSessions(sessions.filter((session) => session._id != toDelete._id));
    } else {
      alert('Failed to delete session');
      console.error(data.error);
    }
  };

  const deleteVolunteer = async (volunteer: IVolunteer): Promise<void> => {
    await fetch(`/api/volunteers/${volunteer.authID}`, {
      method: 'DELETE',
    });
    setVolunteers((prev) =>
      prev.filter((filterVol) => filterVol.authID != volunteer.authID)
    );
    setSelectedVol(null);
  };

  const promoteVolunteer = async (volunteer: IVolunteer): Promise<void> => {
    const putData: IVolunteer = volunteer;
    putData.is_staff = true;

    await fetch(`/api/volunteers/${volunteer.authID}`, {
      method: 'PUT',
      body: JSON.stringify(putData),
    });

    setSelectedVol(putData);
    setVolunteers((prev) => [
      ...prev.filter((oldVolunteer) => oldVolunteer.authID != volunteer.authID),
      putData,
    ]);
  };

  const demoteVolunteer = async (volunteer: IVolunteer): Promise<void> => {
    const putData: IVolunteer = volunteer;
    putData.is_staff = false;

    await fetch(`/api/volunteers/${volunteer.authID}`, {
      method: 'PUT',
      body: JSON.stringify(putData),
    });

    setSelectedVol(putData);
    setVolunteers((prev) => [
      ...prev.filter((oldVolunteer) => oldVolunteer.authID != volunteer.authID),
      putData,
    ]);
  };

  // Add a session and actively update session list
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addSession = async (data: any): Promise<void> => {
    const { startTime, length, checked_out } = data;
    const response = await fetch(
      `api/volunteers/${volunteer.authID}/sessions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          length,
          startTime,
          checked_out,
        }),
      }
    );
    const result = await response.json();

    if (result.success) {
      setSessions([result.session, ...sessions]);
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
            minHeight: '100vh',
          }}
        >
          <div
            style={{
              padding: '2rem',
              backgroundColor: lktheme.offWhite,
              minHeight: '100%',
            }}
          >
            <VolDisplay
              volunteer={volunteer}
              admin={admin}
              setVolunteer={setSelectedVol}
            />

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

            {admin && (
              <>
                <Divider sx={{ my: 2 }} />

                <div className="w-full flex justify-center gap-10 pb-20">
                  {volunteer.is_staff ? (
                    <>
                      <button
                        onClick={() => demoteVolunteer(volunteer)}
                        className="bg-orange-500 hover:bg-orange-600 px-3 py-2 rounded-lg text-white"
                      >
                        Demote
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => promoteVolunteer(volunteer)}
                        className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg text-white"
                      >
                        Promote
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteVolunteer(volunteer)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-white"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default VolunteerDrawer;
