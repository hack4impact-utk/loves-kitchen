import React from 'react';
import NavBar from '@/components/NavBar';
import lktheme from '@/types/colors';
import DailyQR from '@/components/DailyQR';
import CheckinTable from '@/components/CheckinTable';

const checkin = () => {
  return (
    <div
      className="min-h-[100vh]"
      style={{ backgroundColor: lktheme.offWhite }}
    >
      <NavBar />

      <div className="flex flex-col items-center justify-center pt-[164px] pb-20 gap-10">
        <DailyQR />
        <div className="w-[600px]">
          <CheckinTable />
        </div>
      </div>
    </div>
  );
};

export default checkin;
