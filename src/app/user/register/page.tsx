'use client';

import VolunteerRegistrationForm from '@/components/VolunteerRegistrationForm/';
import lktheme from '@/types/colors';
import NavBar from '@/components/NavBar';
import VerifyLayout, {
  PageVerifyType,
  VerifyContextType,
} from '@/components/VerifyLayout';

export default function RegisterPage() {
  function verify(vcontext: VerifyContextType): PageVerifyType {
    const out: PageVerifyType = {
      accepted: false,
      url: '/user',
      rejectMsg: 'Invalid permissions!',
    };
    if (!vcontext.vol) {
      out.accepted = true;
    }
    return out;
  }

  return (
    // verifylayout to kick out any already registered vols
    <VerifyLayout doGetRoles={false} doGetVol={true} verify={verify}>
      <NavBar />
      <div
        className="flex flex-col justify-center items-center min-h-full w-full pb-[100px]"
        style={{
          backgroundColor: lktheme.offWhite,
        }}
      >
        <VolunteerRegistrationForm />
      </div>
    </VerifyLayout>
  );
}

/*
one song from bocchi the rock
https://www.youtube.com/watch?v=fYBQJfPBmRg&list=PLvi9TpO58STKqVnkDbjzjJkOxX8Ch0KEQ&index=5
*/
