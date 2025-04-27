'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decrypt } from '@/server/actions/secret';
import NavBar from '@/components/NavBar';
import CheckinModal from '@/components/CheckinModal';
import { Box, Button, Typography } from '@mui/material';
import lktheme from '@/types/colors';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ISession } from '@/server/models/Session';
import Image from 'next/image';

interface CheckinData {
  end_time: string;
}

const containerStyle = {
  textAlign: 'center',
  padding: '1.25rem',        
  borderWidth: '2px',        
  borderColor: lktheme.brown,       
  borderRadius: '0.5rem',    
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
}


export default function CheckInPage() {
  const { code } = useParams<{ code: string }>();
  const url_decoded = decodeURIComponent(code);
  const { user } = useUser();
  console.log(user);
  /* Ensuring this is a string as this was throwing a lot of errors. */
  const codeString = Array.isArray(url_decoded) ? url_decoded[0] : url_decoded;

  const [modalOpen, setModalOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateSessionTime() {
      try {
        if (!codeString) return;
        const decrypted = await decrypt(codeString);

        const now = new Date();
        const day = new Date(decrypted); 
        const sixHoursInMs = 6 * 60 * 60 * 1000;

        if (now < day || now.getTime() - day.getTime() > sixHoursInMs) {
          setError('Session has expired or is invalid');
          return;
        }
                
      } catch (err) {
        setError('Invalid QR code');
      } finally {
        setLoading(false);
      }
    }
    validateSessionTime();
  }, [codeString]);

  const handleCheckIn = async (data: CheckinData, length: number) => {
    if (user != undefined) {
      const res = await fetch(`/api/checkin`, {
        method: 'POST',
        body: JSON.stringify({
          authID: user.sub,
          length: length
        }),
      });
      const obj = await res.json();
      // console.log(obj);

      if (obj.success) {
        alert('Checked in successfully.');
        setCheckedIn(true);
      } else {
        alert(obj.error);
      }
    }
  };

  const handleClick = async () => {
    if (!checkedIn) {
      setModalOpen(true);
      return;
    }

    if (user == undefined) return;
    // get sessions not checked out from
    const res = await fetch(`/api/volunteers/${user.sub}/sessions`, {
      method: 'GET',
    });
    const sessions: ISession[] = (await res.json()).sessions;
    const notCheckedOutSeshs = sessions.filter(
      (session) => !session.checked_out
    );

    // if more than one session, panic
    if (notCheckedOutSeshs.length > 1) {
      alert(
        'You have more than one session checked in. Please contact an admin.'
      );
      return;
    }

    // otherwise just change it
    if (notCheckedOutSeshs.length == 1) {
      const toUpdate = notCheckedOutSeshs[0];
      toUpdate.checked_out = true;

      const endTime = new Date();
      const length =
        (endTime.getTime() - new Date(toUpdate.startTime).getTime()) /
        (1000 * 60 * 60);

      if (length < 1) {
        if (
          confirm('Session length is less than 1 hour. Delete session data?')
        ) {
          await fetch(`/api/volunteers/${user.sub}/sessions`, {
            method: 'DELETE',
            body: JSON.stringify({
              sessionId: toUpdate._id,
            }),
          });
        } else {
          return;
        }
      } else {
        // update session in database
        await fetch(`/api/volunteers/${user.sub}/sessions`, {
          method: 'PUT',
          body: JSON.stringify({
            sessionId: toUpdate._id,
            length: length,
            checked_out: true,
          }),
        });
      }

      setCheckedIn(false);
    }
  }

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center text-neutral-800 h-[100vh] p-2"
        style={{ backgroundColor: lktheme.offWhite}}
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin opacity-60">
            <Image
              width={80}
              height={80}
              alt="loading webpage..."
              src="/loading.svg"
              priority
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <NavBar />
      <div
        className="flex flex-col items-center justify-center text-neutral-800 h-[100vh] p-2"
        style={{ backgroundColor: lktheme.offWhite}}
      >
        {!error ? (
          <Box sx={containerStyle}>
            <Typography variant="h4" sx={{ color: lktheme.brown, marginBottom: 2 }}>
              {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',  
                  year: 'numeric',  
                  month: 'long',    
                  day: 'numeric'    
                })
              }
            </Typography>
            <Button
              variant='contained'
              color={checkedIn ? 'error' : 'success'}
              onClick={handleClick}
            >
              {checkedIn ? "Check-out" : "Check-in"}
            </Button>
          </Box>
        ) : 
          <Box className="text-center p-5">
            <Typography variant="h4" sx={{ color: lktheme.brown }}>
              {error}
            </Typography>
          </Box>
        }
      </div>
      <CheckinModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCheckIn={handleCheckIn}
      />
    </>
  );
}
