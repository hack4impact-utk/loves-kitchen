'use client';
import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IVolunteer } from '@/server/models/Volunteer';
import lktheme, { browntable } from '@/types/colors';
import { Divider, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UserCreateModal from '../UserCreateModal';

interface VolunteersTableProps {
  volunteers: IVolunteer[];
  onView: (volunteer: IVolunteer) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddVolunteer?: (data: any) => Promise<void>;
}

export default function AdminVolTable({
  volunteers,
  onView,
  onAddVolunteer,
}: VolunteersTableProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First', width: 100 },
    { field: 'lastName', headerName: 'Last', width: 100 },
    { field: 'age', headerName: 'Age', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'createdAt', headerName: 'Date Created', width: 200 },
  ];

  const rows = volunteers.map((volunteer) => ({
    ...volunteer,
    id: volunteer._id,
    createdAt: new Date(volunteer.createdAt).toLocaleDateString('en-US'),
  }));

  return (
    <>
      <div
        style={{
          backgroundColor: lktheme.brownRGBA(1),
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
            Volunteers
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
            sx={browntable}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
          />
        </div>
      </div>

      <UserCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        createVolunteer={onAddVolunteer || (() => Promise.resolve())}
      />
    </>
  );
}
