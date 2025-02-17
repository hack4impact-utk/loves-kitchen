'use client';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridValidRowModel,
} from '@mui/x-data-grid';
import SessionModal from '@/components/SessionModal';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Session } from '@/server/models/Session';
import { parseISOString } from '@/utils/isoParse';
import lktheme, { cyantable } from '@/types/colors';

interface SessionTableProps {
  sessions: Session[];
  staff: boolean;
  onDeleteSession?: (sessionId: string) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddSession?: (data: any) => Promise<void>;
}

const SessionTable = (props: SessionTableProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  // use the map function to fetch the data on the sessions from server
  const rows: GridValidRowModel[] = props.sessions.map((session) => ({
    id: session._id, 
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
    { 
      field: 'id', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params) => (
        <IconButton onClick={() => props.onDeleteSession && props.onDeleteSession(params.row.id)}>
          <DeleteIcon color='error'/>
        </IconButton>
      )
    }
  ];

  if (!props.staff) columns.pop();

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
    <div
      className="p-5 rounded-lg w-[55vw]"
      style={{ backgroundColor: lktheme.darkCyanRGBA(1) }}
    >
      <div className="text-2xl border-b border-b-neutral-300 pb-4 mb-4 w-full flex items-center justify-between">
        <p className="text-white"><b>Sessions</b></p>
        {props.staff &&
          <IconButton onClick={() => setModalOpen(true)}>
            <AddCircleOutlineIcon fontSize="large" className="text-white"/>
          </IconButton>
        }
      </div>

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
          sx={cyantable}
        />
      </ThemeProvider>
      {modalOpen && 
        <SessionModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)}
          createSession={props.onAddSession || (() => Promise.resolve())}
        />
      }
    </div>
  );
};

export default SessionTable;
