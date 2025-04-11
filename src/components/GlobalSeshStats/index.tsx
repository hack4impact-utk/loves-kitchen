import lktheme from '@/types/colors';
import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface GlobalSeshStatsProps {
  stats: {
    avg: number;
    total: number;
  };
  setStats: React.Dispatch<
    React.SetStateAction<{
      avg: number;
      total: number;
    }>
  >;
  globalTimes: {
    startTimeISO: string;
    endTimeISO: string;
  };
  setGlobalTimes: React.Dispatch<
    React.SetStateAction<{
      startTimeISO: string;
      endTimeISO: string;
    }>
  >;
}

const GlobalSeshStats = (props: GlobalSeshStatsProps) => {
  const [tempTimes, setTempTimes] = useState({
    startTimeISO: props.globalTimes.startTimeISO,
    endTimeISO: props.globalTimes.endTimeISO,
  });
  const hasRun = useRef(false);

  async function refreshStats() {
    const res = await fetch(
      '/api/volunteers/global/sessions/stats?' +
        new URLSearchParams({
          startTimeISO: tempTimes.startTimeISO,
          endTimeISO: tempTimes.endTimeISO,
        })
    );
    const data = await res.json();

    if (data.success) {
      props.setStats({
        total: data.total,
        avg: data.avg,
      });
    }
  }

  useEffect(() => {
    if (!hasRun.current) {
      (async () => {
        const res = await fetch(
          '/api/volunteers/global/sessions/stats?' +
            new URLSearchParams({
              startTimeISO: props.globalTimes.startTimeISO,
              endTimeISO: props.globalTimes.endTimeISO,
            })
        );
        const data = await res.json();

        if (data.success) {
          props.setStats({
            total: data.total,
            avg: data.avg,
          });
        }
      })();
      hasRun.current = true;
    }
  }, [props]);

  return (
    <div>
      <div className="flex justify-center w-full gap-5">
        <div
          className="w-[300px] h-[150px] rounded-xl p-5 flex flex-col justify-around"
          style={{ backgroundColor: lktheme.darkCyanRGBA(0.8) }}
        >
          <p className="text-neutral-300">Total Hours</p>
          <p className="text-white text-[40px]">
            {props.stats.total.toFixed(1)}
          </p>
        </div>

        <div
          className="w-[300px] h-[150px] rounded-xl p-5 flex flex-col justify-around"
          style={{ backgroundColor: lktheme.darkCyanRGBA(0.8) }}
        >
          <p className="text-neutral-300">Average Session</p>
          <p className="text-white text-[40px]">
            {props.stats.avg.toFixed(1)} Hours
          </p>
        </div>
      </div>

      <div
        className="p-5 rounded-xl mt-5"
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
            onClick={() => {
              props.setGlobalTimes(tempTimes);
              refreshStats();
            }}
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSeshStats;
