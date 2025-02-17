import React from 'react';
import NavBar from '@/components/NavBar';
import UserInfo from '@/components/UserInfo';
import SessionTable from '@/components/SessionTable';
import { Session } from '@/server/models/Session';
import lktheme from '@/types/colors';

const User = () => {
  const currentTime = new Date(Date.now());

  // use the map function to fetch the data on the volunteers from server
  const sessions: Session[] = [
    {
      _id: '',
      workedBy: 'John Smith',
      startTime: currentTime.toISOString(),
      length: 24,
    },
    {
      _id: '',
      workedBy: 'John Smith',
      startTime: currentTime.toISOString(),
      length: 24,
    },
    {
      _id: '',
      workedBy: 'John Smith',
      startTime: currentTime.toISOString(),
      length: 24,
    },
  ];

  return (
    <>
      <NavBar />
      <div
        className="flex flex-col items-center p-5 gap-10 pt-[100px]"
        style={{ backgroundColor: lktheme.offWhiteRGBA(1) }}
      >
        <UserInfo />

        <div className="flex gap-5">
          <div
            className="w-[300px] h-[150px] rounded-xl p-5 flex flex-col justify-around"
            style={{ backgroundColor: lktheme.darkCyanRGBA(0.8) }}
          >
            <p className="text-neutral-300">Total Hours</p>
            <p className="text-white text-[40px]">10.5</p>
          </div>

          <div
            className="w-[300px] h-[150px] rounded-xl p-5 flex flex-col justify-around"
            style={{ backgroundColor: lktheme.darkCyanRGBA(0.8) }}
          >
            <p className="text-neutral-300">Average Session</p>
            <p className="text-white text-[40px]">2 Hours</p>
          </div>
        </div>

        <SessionTable sessions={sessions} />
      </div>
    </>
  );
};

export default User;
