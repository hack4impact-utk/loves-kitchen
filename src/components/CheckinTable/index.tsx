'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IFlag, IVolunteer } from '@/server/models/Volunteer';
import lktheme, { cyantable } from '@/types/colors';
import { Divider } from '@mui/material';
import CheckinModal from '../CheckinModal';
import { ISession } from '@/server/models/Session';
import VolSearchBar from '../VolSearchBar';

interface UserRow {
  id?: string;
  _id: string;
  is_staff: boolean;
  authID: string;
  firstName: string;
  lastName: string;
  emergencyContact: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  flags?: IFlag[];
  checked_in: boolean;
}

interface CheckinData {
  end_time: string;
}

export default function CheckinTable() {
  const [allRows, setAllRows] = useState<IVolunteer[]>([]);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedVol, setSelectedVol] = useState<IVolunteer | undefined>();

  function updateRows(newVol: UserRow) {
    // set all rows
    let replaceIdx = -1;
    for (let i = 0; i < allRows.length; ++i) {
      if (allRows[i].authID == newVol.authID) {
        replaceIdx = i;
      }
    }
    if (replaceIdx != -1) {
      setAllRows(() => [
        ...allRows.slice(0, replaceIdx),
        {
          ...newVol,
          id: newVol.authID,
        },
        ...allRows.slice(replaceIdx + 1),
      ]);
    }

    // set current rows
    replaceIdx = -1;
    for (let i = 0; i < rows.length; ++i) {
      if (rows[i].authID == newVol.authID) {
        replaceIdx = i;
      }
    }
    if (replaceIdx != -1) {
      setRows(() => [
        ...rows.slice(0, replaceIdx),
        {
          ...newVol,
          id: newVol.authID,
        },
        ...rows.slice(replaceIdx + 1),
      ]);
    }
  }

  async function handleCheckIn(data: CheckinData, length: number) {
    if (!selectedVol) return;

    const startTime = new Date();

    // dont add session if there's already one that hasn't been checked out
    // get sessions not checked out from
    const res = await fetch(`/api/volunteers/${selectedVol.authID}/sessions`, {
      method: 'GET',
    });
    const sessions: ISession[] = (await res.json()).sessions;
    const notCheckedOutSeshs = sessions.filter(
      (session) => !session.checked_out
    );
    if (notCheckedOutSeshs.length > 1) {
      throw new Error('Error: more than one non checked out session.');
    }
    if (notCheckedOutSeshs.length == 1) return;

    // add session
    await fetch(`/api/volunteers/${selectedVol.authID}/sessions`, {
      method: 'POST',
      body: JSON.stringify({
        startTime: startTime,
        workedBy: selectedVol.authID,
        length: length,
        checked_out: false,
      }),
    });

    const tmpVol = selectedVol;
    tmpVol.checked_in = true;

    // update volunteer
    await fetch(`/api/volunteers/${selectedVol.authID}`, {
      method: 'PUT',
      body: JSON.stringify(tmpVol),
    });

    updateRows(tmpVol);
  }

  async function handleCheckOut(toCheckOut: IVolunteer) {
    if (!toCheckOut) return;

    // get sessions not checked out from
    const res = await fetch(`/api/volunteers/${toCheckOut.authID}/sessions`, {
      method: 'GET',
    });
    const sessions: ISession[] = (await res.json()).sessions;
    const notCheckedOutSeshs = sessions.filter(
      (session) => !session.checked_out
    );

    // if more than one session, panic
    if (notCheckedOutSeshs.length > 1) {
      throw new Error('Error: more than one session not checked out of!');
    }

    // otherwise just change it
    if (notCheckedOutSeshs.length == 1) {
      const toUpdate = notCheckedOutSeshs[0];
      toUpdate.checked_out = true;

      const endTime = new Date();
      const length =
        (endTime.getTime() - new Date(toUpdate.startTime).getTime()) /
        (1000 * 60 * 60);

      if (length < 1) {
        if (
          confirm('Session length is less than 1 hour. Delete session data?')
        ) {
          await fetch(`/api/volunteers/${toCheckOut.authID}/sessions`, {
            method: 'DELETE',
            body: JSON.stringify({
              sessionId: toUpdate._id,
            }),
          });
        } else {
          return;
        }
      } else {
        // update session in database
        await fetch(`/api/volunteers/${toCheckOut.authID}/sessions`, {
          method: 'PUT',
          body: JSON.stringify({
            sessionId: toUpdate._id,
            length: length,
            checked_out: true,
          }),
        });
      }
    }

    // set volunteer to checked out
    const tmpVol = toCheckOut;
    tmpVol.checked_in = false;

    // update volunteer
    await fetch(`/api/volunteers/${toCheckOut.authID}`, {
      method: 'PUT',
      body: JSON.stringify(tmpVol),
    });

    updateRows(tmpVol);
  }

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/volunteers', {
        method: 'GET',
      });
      const tmpVols: IVolunteer[] = (await res.json()).volunteers;
      const tmpRows: UserRow[] = [];
      tmpVols.forEach((volunteer) =>
        tmpRows.push({
          ...volunteer,
          id: volunteer.authID,
          createdAt: new Date(volunteer.createdAt).toLocaleDateString('en-US'),
        })
      );
      setRows(tmpRows);
      setAllRows(tmpRows);
    })();
  }, []);

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First', width: 100 },
    { field: 'lastName', headerName: 'Last', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const volData: IVolunteer = params.row;
        return (
          <div className="flex items-center justify-center h-full">
            {volData.checked_in ? (
              <>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to check out?')) {
                      setSelectedVol(() => {
                        handleCheckOut(volData);
                        return volData;
                      });
                    }
                  }}
                  className="px-3 rounded-lg bg-red-600 hover:bg-red-500"
                >
                  <p className="leading-[30px]">Check Out</p>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedVol(() => volData);
                    setModalOpen(true);
                  }}
                  className="px-3 rounded-lg bg-green-600 hover:bg-green-500"
                >
                  <p className="leading-[30px]">Check In</p>
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          backgroundColor: lktheme.darkCyanRGBA(1),
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
        }}
      >
        <p className="text-3xl text-white pb-5">Check In</p>

        <Divider sx={{ marginBottom: '1rem', backgroundColor: 'white' }} />

        <VolSearchBar volunteers={allRows} setData={setRows} />

        <div style={{ width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            sx={cyantable}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
          />
        </div>
      </div>
      <CheckinModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCheckIn={handleCheckIn}
      />
    </>
  );
}
