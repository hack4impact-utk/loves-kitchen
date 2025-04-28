import { ISession } from '@/server/models/Session';
import lktheme from '@/types/colors';
import { getStats } from '@/utils/stats';
import React from 'react';

interface UserSeshStatsProps {
  sessions: ISession[];
  drawerTimes?: {
    startTimeISO: string;
    endTimeISO: string;
  };
}

const UserSeshStats = (props: UserSeshStatsProps) => {
  const { sum, avg } = getStats(props.sessions, props.drawerTimes);

  return (
    <div className="flex flex-col md:flex-row justify-center w-full gap-5">
      <div
        className="w-[300px] h-[150px] rounded-xl p-5 flex flex-col justify-around"
        style={{ backgroundColor: lktheme.darkCyanRGBA(0.8) }}
      >
        <p className="text-neutral-300">Total Hours</p>
        <p className="text-white text-[40px]">{sum.toFixed(1)}</p>
      </div>

      <div
        className="w-[300px] h-[150px] rounded-xl p-5 flex flex-col justify-around"
        style={{ backgroundColor: lktheme.darkCyanRGBA(0.8) }}
      >
        <p className="text-neutral-300">Average Session</p>
        <p className="text-white text-[40px]">{avg.toFixed(1)} Hours</p>
      </div>
    </div>
  );
};

export default UserSeshStats;
