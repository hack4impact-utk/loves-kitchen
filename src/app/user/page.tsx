'use client';

import React from 'react';
import NavBar from '@/components/NavBar';
import UserInfo from '@/components/UserInfo';
import lktheme from '@/types/colors';
import UserSeshStats from '@/components/UserSeshInfo';

const User = () => {
  return (
    <>
      <NavBar />
      <div
        className="flex flex-col items-center p-5 gap-10 pt-[100px]"
        style={{ backgroundColor: lktheme.offWhiteRGBA(1) }}
      >
        <UserInfo />

        <UserSeshStats />
      </div>
    </>
  );
};

export default User;
