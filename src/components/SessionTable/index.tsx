'use client';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Session } from '@/server/models/Session';
import { parseISOString } from '@/utils/isoParse';

interface SessionTableProps {
  sessions: Session[];
}

const SessionTable = (props: SessionTableProps) => {
  // use the map function to fetch the data on the sessions from server
  const rows: GridValidRowModel[] = props.sessions.map((session, index) => ({
    id: index + 1, //since there is not unique id defined in Vols interface, create my own with index ++
    workedBy: session.workedBy,
    startTime: parseISOString(session.startTime).toLocaleTimeString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    length: session.length,
  }));

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Primary color for MUI components
      },
      text: {
        primary: '#000000', // Black text for toolbar
      },
    },
  });

  //define the column headers
  const columns: GridColDef[] = [
    { field: 'workedBy', headerName: 'Worked By', width: 200 },
    { field: 'startTime', headerName: 'Start Time', width: 250 },
    { field: 'length', headerName: 'Length', width: 150 },
  ];

  // Modified handleRowClick function to log row data. logs data to console, which can be accessed with dev tools
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    const { workedBy, startTime, length } = params.row;
    console.log('Row clicked:', {
      workedBy: workedBy,
      startTime: startTime,
      length: length,
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg w-[50vw]">
      <p className="text-2xl border-b border-b-neutral-300 pb-4 mb-4">
        <b>Sessions</b>
      </p>

      <ThemeProvider theme={theme}>
        <DataGrid
          onRowClick={handleRowClick}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              color: 'black', // White text for cells
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: 'rgba(255, 255, 255, 1)', // Alternating row color
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'rgba(255, 255, 255, 1)', // Alternating row color
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'white', // Column headers background
            },
            '& .MuiDataGrid-columnHeader': {
              color: 'black', // Header text color
            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: 'white', // Toolbar background
              color: 'black', // Toolbar text color
            },
            '& .MuiToolbar-root': {
              backgroundColor: 'white', // Ensuring the toolbar has a white background
            },
            '& .MuiDataGrid-toolbarButton': {
              color: 'black', // Toolbar button text color
            },
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default SessionTable;
