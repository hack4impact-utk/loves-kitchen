'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IFlag, IVolunteer } from '@/server/models/Volunteer';
import lktheme, { cyantable } from '@/types/colors';
import { Divider } from '@mui/material';

interface UserRow {
  id: string;
  _id: string;
  is_staff: boolean;
  authID: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  flags?: IFlag[];
}

export default function CheckinTable() {
  const [rows, setRows] = useState<UserRow[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/volunteers', {
        method: 'GET',
      });
      const volunteers: IVolunteer[] = (await res.json()).volunteers;
      const tmpRows: UserRow[] = [];
      volunteers.forEach((volunteer) =>
        tmpRows.push({
          ...volunteer,
          id: volunteer.authID,
          createdAt: new Date(volunteer.createdAt).toLocaleDateString('en-US'),
        })
      );
      setRows(tmpRows);
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
            {volData.firstName.length > 5 ? (
              <>
                <button
                  onClick={() => {
                    console.log(volData);
                  }}
                  className="px-3 rounded-lg bg-green-600 hover:bg-green-500"
                >
                  <p className="leading-[30px]">Check In</p>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    console.log(volData);
                  }}
                  className="px-3 rounded-lg bg-red-600 hover:bg-red-500"
                >
                  <p className="leading-[30px]">Check Out</p>
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
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
  );
}
