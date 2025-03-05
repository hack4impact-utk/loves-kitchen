'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decrypt } from '@/server/actions/secret';
import NavBar from '@/components/NavBar';
import { Box, Button, Typography } from '@mui/material';
import lktheme from '@/types/colors';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function CheckInPage() {
  const { code } = useParams<{ code: string }>();
  const url_decoded = decodeURIComponent(code);
  const { user } = useUser();
  /* Ensuring this is a string as this was throwing a lot of errors. */
  const codeString = Array.isArray(url_decoded) ? url_decoded[0] : url_decoded;
  /* Commented this out. Uncomment if needed. */
  // const router = useRouter();

  interface Session {
    startTime: string;
    length: number;
  }

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        if (!codeString) return;
        const decrypted = await decrypt(codeString);
        const sessionData: Session = JSON.parse(decrypted);
        setSession(sessionData);
      } catch (err) {
        setError('Failed to load session details.');
        setSession(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [codeString]);

  const handleCheckIn = async () => {
    if (user != undefined) {
      const res = await fetch(`/api/checkin/${code}`, {
        method: 'POST',
        body: JSON.stringify({
          authID: user.sub,
        }),
      });
      const obj = await res.json();
      // console.log(obj);

      if (obj.success) {
        alert('Checked in successfully.');
      } else {
        alert('Failed to check in :(');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!session) return <div>No session found.</div>;

  return (
    <>
      <NavBar />
      <div
        className="flex flex-col items-center justify-center text-neutral-800 h-[100vh]"
        style={{ backgroundColor: lktheme.offWhite }}
      >
        <Box className="text-center p-5">
          <Typography variant="h4" sx={{ color: lktheme.brown }}>
            Check-In Session Details
          </Typography>
          <Typography variant="h6">
            Start Time: {new Date(session.startTime).toLocaleString()}
          </Typography>
          <Typography variant="h6">Length: {session.length} hours</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: lktheme.darkCyan }}
            onClick={handleCheckIn}
          >
            Confirm Check-In
          </Button>
        </Box>
      </div>
    </>
  );
}
