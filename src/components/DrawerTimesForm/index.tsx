import lktheme from '@/types/colors';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface DrawerTimesFormProps {
  drawerTimes: {
    startTimeISO: string;
    endTimeISO: string;
  };
  setDrawerTimes: React.Dispatch<
    React.SetStateAction<{
      startTimeISO: string;
      endTimeISO: string;
    }>
  >;
}

const DrawerTimesForm = (props: DrawerTimesFormProps) => {
  const [tempTimes, setTempTimes] = useState({
    startTimeISO: props.drawerTimes.startTimeISO,
    endTimeISO: props.drawerTimes.endTimeISO,
  });

  return (
    <div
      className="p-5 rounded-xl mt-5 w-[620px] mx-auto"
      style={{ backgroundColor: lktheme.darkCyanRGBA(0.8) }}
    >
      <div className="flex items-center justify-center gap-5">
        <div>
          <p className="text-white mb-2">From</p>
          <TextField
            label=""
            name="startTime"
            type="datetime-local"
            value={tempTimes.startTimeISO}
            onChange={(e) => {
              setTempTimes((prev) => ({
                startTimeISO: e.target.value,
                endTimeISO: prev.endTimeISO,
              }));
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: 'white' }}
          />
        </div>

        <div>
          <p className="text-white mb-2">To</p>
          <TextField
            label=""
            name="startTime"
            type="datetime-local"
            value={tempTimes.endTimeISO}
            onChange={(e) => {
              setTempTimes((prev) => ({
                startTimeISO: prev.startTimeISO,
                endTimeISO: e.target.value,
              }));
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: 'white' }}
          />
        </div>
      </div>

      <div className="w-full flex justify-center mt-5">
        <button
          className="bg-white p-2 h-min w-[50%] my-auto rounded-lg hover:bg-neutral-100"
          onClick={() => props.setDrawerTimes(tempTimes)}
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default DrawerTimesForm;
