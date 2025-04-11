'use client';
import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { IVolunteer } from '@/server/models/Volunteer';
import { Divider, Box } from '@mui/material';
import FlagModal from '../FlagModal';
import { ISession } from '@/server/models/Session';
import SessionTable, { SessionRow } from '../SessionTable';
import lktheme from '@/types/colors';
import UserSeshStats from '../UserSeshStats';
import VolDisplay from '../VolDisplay';
import FlagDisplay from '../FlagDisplay';
import { UserRow } from '@/app/staff/page';
import { useUser } from '@auth0/nextjs-auth0/client';
import DrawerTimesForm from '../DrawerTimesForm';

interface VolunteerDrawerProps {
  admin: boolean;
  open: boolean;
  onClose: () => void;
  volunteer: IVolunteer;
  setSelectedVol: React.Dispatch<React.SetStateAction<IVolunteer | null>>;
  setVolunteers: React.Dispatch<React.SetStateAction<IVolunteer[]>>;
  setUserRows: React.Dispatch<React.SetStateAction<UserRow[]>>;
  setStaffRows: React.Dispatch<React.SetStateAction<UserRow[]>>;
  setGlobSeshStats?: React.Dispatch<
    React.SetStateAction<{
      avg: number;
      total: number;
    }>
  >;
  globSeshStats?: {
    avg: number;
    total: number;
  };
  globalTimes?: {
    startTimeISO: string;
    endTimeISO: string;
  };
}

const VolunteerDrawer: React.FC<VolunteerDrawerProps> = ({
  admin,
  open,
  onClose,
  volunteer,
  setSelectedVol,
  setVolunteers,
  setUserRows,
  setStaffRows,
  setGlobSeshStats,
  globSeshStats,
  globalTimes,
}) => {
  const [isFlagModalOpen, setFlagModalOpen] = useState(false);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [drawerTimes, setDrawerTimes] = useState({
    startTimeISO: '1986-02-14T00:00',
    endTimeISO: new Date().toISOString().split('T')[0] + 'T23:59',
  });
  const { user } = useUser();

  // Delete a session and actively update session list
  const deleteSession = async (toDelete: SessionRow): Promise<void> => {
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

      if (tmpVol.is_staff) {
        setStaffRows((prev) => [
          ...prev.filter((vol) => vol.authID != volunteer.authID),
          {
            ...tmpVol,
            id: tmpVol._id,
          },
        ]);
      } else {
        setUserRows((prev) => [
          ...prev.filter((vol) => vol.authID != volunteer.authID),
          {
            ...tmpVol,
            id: tmpVol._id,
          },
        ]);
      }
    }

    if (data.success) {
      // update global session stats if necessary
      if (
        globalTimes &&
        globSeshStats &&
        setGlobSeshStats &&
        !volunteer.is_staff
      ) {
        sessions.find((sesh) => sesh.workedBy == toDelete.workedBy);
        const present = new Date(toDelete.rawStartTime).getTime();
        const endTime = new Date(globalTimes.endTimeISO).getTime();
        const startTime = new Date(globalTimes.startTimeISO).getTime();
        if (present < endTime && present > startTime) {
          setGlobSeshStats((prev) => {
            const len = prev.total / prev.avg;
            return {
              total: len != 1 ? prev.total - toDelete.length : 0,
              avg: len != 1 ? (prev.total - toDelete.length) / (len - 1) : 0,
            };
          });
        }
      }

      setSessions(sessions.filter((session) => session._id != toDelete._id));
    } else {
      alert('Failed to delete session');
      console.error(data.error);
    }
  };

  const deleteVolunteer = async (volunteer: IVolunteer): Promise<void> => {
    if (!confirm(`Delete ${volunteer.firstName} ${volunteer.lastName}?`)) {
      return;
    }

    await fetch(`/api/volunteers/${volunteer.authID}`, {
      method: 'DELETE',
    });
    setVolunteers((prev) =>
      prev.filter((filterVol) => filterVol.authID != volunteer.authID)
    );
    if (volunteer.is_staff) {
      setStaffRows((prev) =>
        prev.filter((filterRow) => filterRow.authID != volunteer.authID)
      );
    } else {
      setUserRows((prev) =>
        prev.filter((filterRow) => filterRow.authID != volunteer.authID)
      );
    }
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
    setUserRows((prev) =>
      prev.filter((oldRow) => oldRow.authID != volunteer.authID)
    );
    setStaffRows((prev) => [
      ...prev.filter((oldRow) => oldRow.authID != volunteer.authID),
      {
        ...putData,
        id: putData._id,
      },
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
    setUserRows((prev) => [
      ...prev.filter((oldRow) => oldRow.authID != volunteer.authID),
      {
        ...putData,
        id: putData._id,
      },
    ]);
    setStaffRows((prev) =>
      prev.filter((oldRow) => oldRow.authID != volunteer.authID)
    );
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
      // update global session stats if necessary
      if (
        globalTimes &&
        globSeshStats &&
        setGlobSeshStats &&
        !volunteer.is_staff
      ) {
        const present = new Date(data.startTime).getTime();
        const endTime = new Date(globalTimes.endTimeISO).getTime();
        const startTime = new Date(globalTimes.startTimeISO).getTime();
        if (present < endTime && present > startTime) {
          setGlobSeshStats((prev) => {
            const len = prev.avg != 0 ? prev.total / prev.avg : 0;
            return {
              total: prev.total + data.length,
              avg: (prev.total + data.length) / (len + 1),
            };
          });
        }
      }
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

  const updateVolunteer = (updatedVolunteer: IVolunteer) => {
    if (!updatedVolunteer._id) {
      updatedVolunteer._id =
        updatedVolunteer.firstName +
        updatedVolunteer.lastName +
        updatedVolunteer.email;
    }
    setVolunteers((prev) =>
      prev.map((vol) =>
        vol._id === updatedVolunteer._id ? updatedVolunteer : vol
      )
    );
    if (updatedVolunteer.is_staff) {
      setStaffRows((prev) =>
        prev.map((row) =>
          row._id === updatedVolunteer._id
            ? { ...updatedVolunteer, id: updatedVolunteer._id }
            : row
        )
      );
    } else {
      setUserRows((prev) =>
        prev.map((row) =>
          row._id === updatedVolunteer._id
            ? { ...updatedVolunteer, id: updatedVolunteer._id }
            : row
        )
      );
    }
    setSelectedVol(updatedVolunteer);
  };

  return (
    <>
      <FlagModal
        open={isFlagModalOpen}
        handleClose={() => setFlagModalOpen(false)}
        volunteer={volunteer}
        updateVolunteer={updateVolunteer}
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
              setVolunteer={(vol: IVolunteer) => updateVolunteer(vol)}
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

            {admin ? (
              <>
                <UserSeshStats sessions={sessions} drawerTimes={drawerTimes} />
                <DrawerTimesForm
                  drawerTimes={drawerTimes}
                  setDrawerTimes={setDrawerTimes}
                />
              </>
            ) : (
              <>
                <UserSeshStats sessions={sessions} />
              </>
            )}

            <Divider sx={{ my: 2 }} />

            <SessionTable
              sessions={
                !admin
                  ? sessions
                  : sessions.filter((sesh) => {
                      const present = new Date(sesh.startTime).getTime();
                      const endTime = new Date(
                        drawerTimes.endTimeISO
                      ).getTime();
                      const startTime = new Date(
                        drawerTimes.startTimeISO
                      ).getTime();
                      return present < endTime && present > startTime;
                    })
              }
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
                    style={{
                      opacity: user && user.email == volunteer.email ? 0.6 : 1,
                    }}
                    disabled={user && user.email == volunteer.email}
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
