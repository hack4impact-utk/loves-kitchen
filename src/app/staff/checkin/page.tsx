'use client';

import React from 'react';
import NavBar from '@/components/NavBar';
import lktheme from '@/types/colors';
import DailyQR from '@/components/DailyQR';
import CheckinTable from '@/components/CheckinTable';
import VerifyLayout, {
  PageVerifyType,
  VerifyContextType,
} from '@/components/VerifyLayout';

const checkin = () => {
  function verify(vcontext: VerifyContextType): PageVerifyType {
    const out: PageVerifyType = {
      accepted: false,
      url: '/',
      rejectMsg: 'Invalid permissions!',
    };
    if (vcontext.roles && vcontext.roles.includes('Staff')) {
      out.accepted = true;
    }
    return out;
  }

  return (
    <VerifyLayout verify={verify} doGetRoles={true} doGetVol={false}>
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
    </VerifyLayout>
  );
};

export default checkin;
