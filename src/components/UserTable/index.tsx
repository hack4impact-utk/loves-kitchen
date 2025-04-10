'use client';
import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IVolunteer } from '@/server/models/Volunteer';
import lktheme, { browntable, cyantable } from '@/types/colors';
import { Divider, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UserCreateModal from '../UserCreateModal';
import FlagIcon from '@mui/icons-material/Flag';
import VolSearchBar from '../VolSearchBar';
import { UserRow } from '@/app/staff/page';

interface UserTableProps {
  is_admin: boolean;
  shows_staff: boolean;
  volunteers: IVolunteer[];
  rows: UserRow[];
  setRows: React.Dispatch<React.SetStateAction<UserRow[]>>;
  onView: (volunteer: IVolunteer) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddUser?: (data: any) => Promise<void>;
}

export default function UserTable({
  is_admin,
  shows_staff,
  volunteers,
  rows,
  setRows,
  onView,
  onAddUser,
}: UserTableProps) {
  const colorMap = {
    red: '#d32f2f',
    green: '#388e3c',
    orange: '#f57c00',
    gray: '#ffffff',
    default: '#000000',
  };

  const [modalOpen, setModalOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First', width: 100 },
    { field: 'lastName', headerName: 'Last', width: 100 },
    { field: 'email', headerName: 'Email', width: 160 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'createdAt', headerName: 'Date Created', width: 150 },
    {
      field: 'flags',
      headerName: 'Flags',
      width: 180,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '100%',
          }}
        >
          {params.row.flags?.map((flag: { color: string }, index: number) => (
            <FlagIcon
              key={index}
              sx={{ color: colorMap[flag.color as keyof typeof colorMap] }}
            />
          ))}
        </div>
      ),
    },
    {
      field: 'checked_in',
      headerName: 'Checked In',
      width: 150,
      renderCell: (params) => {
        const volData: IVolunteer = params.row;
        return (
          <div className="flex items-center justify-center h-full">
            {volData.checked_in ? (
              <div className="px-3 rounded-lg bg-green-600 hover:bg-green-500">
                <p className="leading-[30px]">True</p>
              </div>
            ) : (
              <div className="px-3 rounded-lg bg-red-600 hover:bg-red-500">
                <p className="leading-[30px]">False</p>
              </div>
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
          backgroundColor: shows_staff
            ? lktheme.darkCyanRGBA(1)
            : lktheme.brownRGBA(1),
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
        }}
      >
        {/* Header for the actual table */}
        {is_admin ? (
          <>
            <div className="w-full flex justify-between">
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: '#fff',
                }}
              >
                {shows_staff ? 'Staff' : 'Volunteers'}
              </h1>
              <IconButton onClick={() => setModalOpen(true)}>
                <AddCircleOutlineIcon fontSize="large" className="text-white" />
              </IconButton>
            </div>
          </>
        ) : (
          <>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#fff',
              }}
            >
              {shows_staff ? 'Staff' : 'Volunteers'}
            </h1>
          </>
        )}
        <Divider sx={{ marginBottom: '1rem', backgroundColor: 'white' }} />

        {/* the actual table */}
        <div style={{ width: '100%' }}>
          <VolSearchBar
            volunteers={volunteers}
            setData={(data: IVolunteer[]) => {
              setRows(
                data.map((row) => ({
                  ...row,
                  id: row._id,
                  createdAt: new Date(row.createdAt).toLocaleDateString(
                    'en-US'
                  ),
                }))
              );
            }}
          />
          <DataGrid
            rows={rows.filter((row) =>
              shows_staff ? row.is_staff : !row.is_staff
            )}
            columns={columns}
            onRowClick={(params) => {
              console.log('Row clicked:', params.row);
              onView(params.row);
            }}
            sx={shows_staff ? cyantable : browntable}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
          />
        </div>
      </div>

      {is_admin && (
        <>
          <UserCreateModal
            is_updater={false}
            is_staff={shows_staff}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            createVolunteer={onAddUser || (() => Promise.resolve())}
          />
        </>
      )}
    </>
  );
}
