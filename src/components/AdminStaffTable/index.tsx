'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IFlag, IVolunteer } from '@/server/models/Volunteer';
import lktheme, { cyantable } from '@/types/colors';
import { Divider, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UserCreateModal from '../UserCreateModal';
import FlagIcon from '@mui/icons-material/Flag';

interface VolunteersTableProps {
  volunteers: IVolunteer[];
  onView: (volunteer: IVolunteer) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddUser?: (data: any) => Promise<void>;
}

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

export default function AdminVolTable({
  volunteers,
  onView,
  onAddUser,
}: VolunteersTableProps) {
  const colorMap = {
    red: '#d32f2f',
    green: '#388e3c',
    orange: '#f57c00',
    gray: '#ffffff',
    default: '#000000',
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState<UserRow[]>([]);

  useEffect(() => {
    const tmpRows: UserRow[] = [];
    volunteers.forEach((volunteer) =>
      tmpRows.push({
        ...volunteer,
        id: volunteer.authID,
        createdAt: new Date(volunteer.createdAt).toLocaleDateString('en-US'),
      })
    );
    setRows(tmpRows);
  }, [volunteers]);

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First', width: 100 },
    { field: 'lastName', headerName: 'Last', width: 100 },
    { field: 'age', headerName: 'Age', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'createdAt', headerName: 'Date Created', width: 200 },
    {
      field: 'flags',
      headerName: 'Flags',
      width: 200,
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
        <div className="w-full flex justify-between">
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#fff',
            }}
          >
            Staff
          </h1>
          <IconButton onClick={() => setModalOpen(true)}>
            <AddCircleOutlineIcon fontSize="large" className="text-white" />
          </IconButton>
        </div>
        <Divider sx={{ marginBottom: '1rem', backgroundColor: 'white' }} />
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            onRowClick={(params) => {
              console.log('Row clicked:', params.row);
              onView(params.row);
            }}
            sx={cyantable}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
          />
        </div>
      </div>

      <UserCreateModal
        is_staff={true}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        createVolunteer={onAddUser || (() => Promise.resolve())}
      />
    </>
  );
}
