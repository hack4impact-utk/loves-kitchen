'use client';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import { Volunteer } from '@/server/models/Vol';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';

interface VolunteersTableProps {
  volunteers: Volunteer[];
  onView: (volunteer: Volunteer) => void;
  onFlags: (volunteer: Volunteer) => void;
}

export default function VolunteersTable({
  volunteers,
  onView,
  onFlags,
}: VolunteersTableProps) {
  const colorMap = {
    error: '#d32f2f',
    success: '#388e3c',
    warning: '#f57c00',
    info: '#858585',
    default: '#000000',
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 150 },
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
            <OutlinedFlagIcon
              key={index}
              style={{
                color: 'transparent',
                stroke:
                  colorMap[flag.color as keyof typeof colorMap] ||
                  colorMap.default,
                strokeWidth: '1',
              }}
            />
          ))}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton
            sx={{
              color: '#478c8c',
            }}
            onClick={() => onView(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            sx={{
              color: '#62392b',
            }}
            onClick={() => onFlags(params.row)}
          >
            <FlagIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = volunteers.map((volunteer) => ({
    ...volunteer,
    id: volunteer._id,
    createdAt: new Date(volunteer.createdAt).toLocaleDateString('en-US'),
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
