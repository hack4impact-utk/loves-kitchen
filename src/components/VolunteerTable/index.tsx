'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IVolunteer } from '@/server/models/Volunteer';
import FlagIcon from '@mui/icons-material/Flag';
import { browntable } from '@/types/colors';
import SearchBar from '../SearchBar';
interface VolunteersTableProps {
  volunteers: IVolunteer[];
  onView: (volunteer: IVolunteer) => void;
}

export default function VolunteersTable({
  volunteers,
  onView,
}: VolunteersTableProps) {
  const colorMap = {
    red: '#d32f2f',
    green: '#388e3c',
    orange: '#f57c00',
    gray: '#ffffff',
    default: '#000000',
  };

  useEffect(() => {
    console.log(volunteers);
    setDisplay(
      volunteers.map((volunteer) => ({
        ...volunteer,
        id: volunteer._id,
        createdAt: new Date(volunteer.createdAt).toLocaleDateString('en-US'),
      }))
    );
  }, [volunteers]);

  const [toDisplay, setDisplay] = useState<IVolunteer[]>([]);

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
    <div style={{ width: '100%' }}>
      <SearchBar
        volunteers={volunteers}
        setData={(data: IVolunteer[]) => {
          setDisplay(
            data.map((row) => ({
              ...row,
              id: row._id,
              createdAt: new Date(row.createdAt).toLocaleDateString('en-US'),
            }))
          );
        }}
      />
      <DataGrid
        rows={toDisplay}
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
  );
}
