'use client';

import { getRoles } from '@/server/actions/auth0m';
import { IVolunteer } from '@/server/models/Volunteer';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import lktheme from '@/types/colors';

export interface VerifyContextType {
  roles?: string[];
  vol?: IVolunteer;
}

export interface PageVerifyType {
  accepted: boolean;
  url: string | undefined; // if undefined, don't redirect
  rejectMsg: string; // must be defined if accepted == false
}

interface VerifyLayoutProps {
  verify: (vcontext: VerifyContextType) => PageVerifyType;
  doGetRoles: boolean; // "roles" argument will be null in verify() if set to false
  doGetVol: boolean; // "vol" argument will be null in verify() if set to false
  children: React.ReactNode;
}

const VerifyLayout = (props: VerifyLayoutProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [valid, setValid] = useState<PageVerifyType | undefined>(undefined);

  useEffect(() => {
    // only run validation when user and router have loaded
    if (user && router && props && !valid) {
      (async () => {
        // get roles if needed
        let roles = undefined;
        if (props.doGetRoles) {
          roles = await getRoles(user.sub!);
        }

        // get volunteer if needed
        let vol = undefined;
        if (props.doGetVol) {
          const res = await fetch(`/api/volunteers/${user.sub}`, {
            method: 'GET',
          });
          vol = await res.json();
        }

        // actually get validity
        const validity = props.verify({ roles, vol });
        if (!validity.accepted && validity.url) {
          router.push(validity.url);
        } else {
          setValid(validity);
        }
      })();
    }
  }, [user, router, props, valid]);

  return (
    <>
      {!valid && (
        <div
          className="w-screen h-screen flex items-center justify-center"
          style={{ backgroundColor: lktheme.offWhite }}
        >
          {/* If loading, show spinning wheel */}
          <div className="animate-spin opacity-60">
            <Image
              width={80}
              height={80}
              alt="preparing QR code..."
              src="/loading.svg"
            />
          </div>
        </div>
      )}

      {valid?.accepted && props.children}

      {valid && !valid.accepted && (
        <div
          className="w-screen h-screen flex items-center justify-center"
          style={{ backgroundColor: lktheme.offWhite }}
        >
          {/* If denied, show some error display */}
          <div className="flex flex-col justify-center items-center gap-2 border-red-500 p-3 rounded-lg text-white">
            <ErrorOutlineIcon color="error" />
            <p className="w-fit text-red-600">{valid?.rejectMsg}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyLayout;
