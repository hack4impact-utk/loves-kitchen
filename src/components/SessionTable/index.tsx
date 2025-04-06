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
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ISession } from '@/server/models/Session';
import { parseISOString } from '@/utils/isoParse';
import lktheme, { cyantable } from '@/types/colors';

interface SessionTableProps {
  sessions: ISession[];
  staff: boolean;
  onDeleteSession?: (session: ISession) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddSession?: (data: any) => Promise<void>;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
};

const SessionTable = (props: SessionTableProps) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedSession, setSelected] = useState<ISession | undefined>(
    undefined
  );

  const handleDelete = async (session: ISession) => {
    setDeleteLoading(true);
    if (props.onDeleteSession) await props.onDeleteSession(session);

    setDeleteLoading(false);
    setSelected(undefined);
    setDeleteModalOpen(false);
  };

  // use the map function to fetch the data on the sessions from server
  const rows: GridValidRowModel[] = props.sessions.map((session) => ({
    id: session._id,
    _id: session._id,
    checked_out: session.checked_out,
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
    { field: 'startTime', headerName: 'Start Time', width: 300 },
    // { field: 'length', headerName: 'Length', width: 200 },
    { field: 'endTime', headerName: 'End Time', width: 200 },
    {
      field: 'id',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setDeleteModalOpen(true);
            setSelected(params.row);
          }}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      ),
    },
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
      className="p-5 rounded-lg w-full"
      style={{ backgroundColor: lktheme.darkCyanRGBA(1) }}
    >
      <div className="text-2xl border-b border-b-neutral-300 pb-4 mb-4 w-full flex items-center justify-between">
        <p className="text-white">
          <b>Sessions</b>
        </p>
        {props.staff && (
          <IconButton onClick={() => setAddModalOpen(true)}>
            <AddCircleOutlineIcon fontSize="large" className="text-white" />
          </IconButton>
        )}
      </div>

      <ThemeProvider theme={theme}>
        <DataGrid
          onRowClick={handleRowClick}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          sx={cyantable}
        />
      </ThemeProvider>

      <SessionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        createSession={props.onAddSession || (() => Promise.resolve())}
      />

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={modalStyle}>
          <p className="mb-4">Are you sure you want to delete this session?</p>
          <div className="flex justify-center space-x-2">
            <Button
              variant="outlined"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedSession) {
                  handleDelete(selectedSession);
                }
              }}
              variant="outlined"
              color="error"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Confirm'}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SessionTable;
