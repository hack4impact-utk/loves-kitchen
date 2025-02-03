'use client';

import React from 'react';
import NavBar from '@/components/NavBar';
import UserInfo from '@/components/UserInfo';
import SessionTable from '@/components/SessionTable';
import { Session } from '@/server/models/Session';
import { useUser } from '@auth0/nextjs-auth0/client';

const User = () => {
  const { user, error, isLoading } = useUser();
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
      <NavBar user={user} error={error} isLoading={isLoading} />
      <div className="bg-slate-900 flex flex-col items-center p-5 gap-10">
        <div className="flex gap-5">
          <a
            href="/api/auth/logout"
            className="text-white px-5 py-2 bg-red-500 hover:bg-red-600 block transition-all rounded-md"
          >
            Log Out
          </a>
          <a
            href="/api/auth/login"
            className="text-white px-5 py-2 bg-green-500 hover:bg-green-600 block transition-all rounded-md"
          >
            Log In
          </a>
        </div>

        <UserInfo user={user} error={error} isLoading={isLoading} />

        <div className="flex gap-5">
          <div className="w-[300px] h-[150px] rounded-xl p-5 bg-black bg-opacity-50 flex flex-col justify-around">
            <p className="text-neutral-300">Total Hours</p>
            <p className="text-white text-[40px]">10.5</p>
          </div>

          <div className="w-[300px] h-[150px] rounded-xl p-5 bg-black bg-opacity-50 flex flex-col justify-around">
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
