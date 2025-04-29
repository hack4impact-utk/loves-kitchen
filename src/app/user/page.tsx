'use client';

import React from 'react';
import NavBar from '@/components/NavBar';
import UserInfo from '@/components/UserInfo';
import lktheme from '@/types/colors';
import UserSeshStats from '@/components/UserSeshInfo';
import VerifyLayout, {
  PageVerifyType,
  VerifyContextType,
} from '@/components/VerifyLayout';

const User = () => {
  function verify(vcontext: VerifyContextType): PageVerifyType {
    const out: PageVerifyType = {
      accepted: false,
      url: '/',
      rejectMsg: 'Invalid permissions!',
    };
    if (!vcontext.vol) {
      out.url = '/user/register';
      return out;
    }
    if (vcontext.roles && !vcontext.roles.includes('Tablet')) {
      out.accepted = true;
    }
    return out;
  }

  return (
    <VerifyLayout verify={verify} doGetRoles={true} doGetVol={true}>
      <NavBar />
      <div
        className="flex flex-col items-center p-5 gap-10 pt-[164px] pb-[64px] min-h-[100vh]"
        style={{ backgroundColor: lktheme.offWhiteRGBA(1) }}
      >
        <UserInfo />

        <UserSeshStats />
      </div>
    </VerifyLayout>
  );
};

export default User;
