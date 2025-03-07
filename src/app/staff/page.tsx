'use client';

import React, { useState, useEffect } from 'react';
import SessionTable from '@/components/SessionTable';
import VolunteersTable from '@/components/VolunteerTable';
import VolunteerDrawer from '@/components/VolunteerDrawer'; // Updated sidepage component
import NavBar from '@/components/NavBar';
import { IVolunteer } from '@/server/models/Volunteer';
import { ISession } from '@/server/models/Session';
import Divider from '@mui/material/Divider';
import theme from '@/types/colors';
import lktheme from '@/types/colors';
import { Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getRoles } from '@/server/actions/auth0m';
import { useRouter } from 'next/navigation';

const Staff = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkRoles = async () => {
      if (user?.sub && router) {
        const roles = await getRoles(user.sub!);
        if (!roles.includes('Staff')) {
          router.push('/');
        }
      }
    };

    if (user) {
      checkRoles();
    }
  }, [user, router]);

  const [sessions, setSessions] = useState<ISession[]>([]);
  const [volunteers, setVolunteers] = useState<IVolunteer[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<IVolunteer | null>(
    null
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Drawer state

  // Fetch volunteers from the server
  useEffect(() => {
    const fetchVolunteers = async () => {
      const response = await fetch('/api/volunteers');
      const data = await response.json();
      if (data.success) {
        setVolunteers(data.volunteers);
      } else {
        console.error('Failed to fetch volunteers:', data.error);
      }
    };

    const fetchSessions = async () => {
      const response = await fetch('api/volunteers/all/sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      } else {
        console.error('Failed to fetch sessions:', data.error);
      }
    };

    fetchVolunteers();
    fetchSessions();
  }, []);

  // Open the drawer with the selected volunteer
  const handleViewVolunteer = (volunteer: IVolunteer) => {
    // console.log('Opening drawer for:', volunteer); // Debugging log
    setSelectedVolunteer(volunteer); // Set the selected volunteer
    setDrawerOpen(true); // Open the drawer
  };

  // Delete a session and actively update session list
  const deleteSession = async (sessionId: string): Promise<void> => {
    const response = await fetch('api/volunteers/all/sessions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const data = await response.json();

    if (data.success) {
      setSessions(sessions.filter((session) => session._id != sessionId));
    } else {
      alert('Failed to delete session');
      console.error(data.error);
    }
  };

  // Add a session and actively update session list
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addSession = async (data: any): Promise<void> => {
    const { workedBy, startTime, length } = data;
    const response = await fetch('api/volunteers/all/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workedBy,
        length,
        startTime,
      }),
    });
    const result = await response.json();
    console.log(result);

    if (result.success) {
      setSessions([...sessions, result.session]);
    } else {
      alert('Failed to add session');
      console.error(data.error);
    }
  };

  return (
    <div style={{ backgroundColor: theme.offWhite, minHeight: '100vh' }}>
      <NavBar />
      <div
        style={{
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          marginTop: '50px',
        }}
      >
        <div
          style={{
            backgroundColor: lktheme.brownRGBA(1),
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
          }}
        >
          <Button
            href="/staff/qr"
            sx={{ color: 'white', textDecoration: 'underline' }}
          >
            Generate QR Code
          </Button>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#fff',
            }}
          >
            Volunteers
          </h1>
          <Divider sx={{ marginBottom: '1rem', backgroundColor: 'white' }} />
          <VolunteersTable
            volunteers={volunteers}
            onView={handleViewVolunteer} // Use the drawer open function
          />
        </div>

        {/* Sidepage (Drawer) for Viewing Volunteer Details */}
        {selectedVolunteer && (
          <VolunteerDrawer
            open={isDrawerOpen} // Controlled by state
            onClose={() => setDrawerOpen(false)} // Close the drawer
            volunteer={selectedVolunteer} // Pass the selected volunteer
            setSelectedVol={setSelectedVolunteer}
            setVolunteers={setVolunteers}
          />
        )}

        <Divider sx={{ marginBottom: '1rem' }} />
        <SessionTable
          sessions={sessions}
          staff={true}
          onDeleteSession={deleteSession}
          onAddSession={addSession}
        />
      </div>
    </div>
  );
};

export default Staff;
