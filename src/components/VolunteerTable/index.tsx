'use client';
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridToolbar,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Volunteer } from '@/server/models/Vol';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//create interface to pass into the component
interface Props {
  volunteers: Volunteer[];
}

export default function VolunteersTable(props: Props) {
  if (!props.volunteers) {
    return <div>Error: Volunteers data is not available.</div>;
  }

  //use the map function to fetch the data on the volunteers from server
  const rows: GridValidRowModel[] = props.volunteers.map(
    (volunteer, index) => ({
      id: index + 1, //since there is not unique id defined in Vols interface, create my own with index ++
      name: volunteer.name,
      age: volunteer.age,
      createdAt: new Date(volunteer.createdAt).toLocaleDateString('en-US'),
    })
  );

  //define the column headers
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 150 },
    { field: 'createdAt', headerName: 'Date Created', width: 200 },
  ];

  // Modified handleRowClick function to log row data. logs data to console, which can be accessed with dev tools
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    const { name, age, createdAt } = params.row;
    console.log('Row clicked:', {
      name: name,
      age: age,
      createdAt: createdAt,
    });
  };

  // Define custom theme
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

  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        onRowClick={handleRowClick}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            color: 'white', // White text for cells
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: 'rgba(0, 0, 50, 0.6)', // Alternating row color
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
  );
}
