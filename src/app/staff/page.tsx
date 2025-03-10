'use client';

import React, { useState, useEffect } from 'react';
import VolunteersTable from '@/components/VolunteerTable';
import VolunteerDrawer from '@/components/VolunteerDrawer'; // Updated sidepage component
import NavBar from '@/components/NavBar';
import { IVolunteer } from '@/server/models/Volunteer';
import Divider from '@mui/material/Divider';
import theme from '@/types/colors';
import lktheme from '@/types/colors';
import { Button } from '@mui/material';
//import { useUser } from '@auth0/nextjs-auth0/client';
//import { getRoles } from '@/server/actions/roles';
//import { useRouter } from 'next/navigation';

const Staff = () => {
  //const { user } = useUser();
  //const router = useRouter();

  /*useEffect(() => {
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
  }, [user, router]);*/

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

    fetchVolunteers();
  }, []);

  // Open the drawer with the selected volunteer
  const handleViewVolunteer = (volunteer: IVolunteer) => {
    // console.log('Opening drawer for:', volunteer); // Debugging log
    setSelectedVolunteer(volunteer); // Set the selected volunteer
    setDrawerOpen(true); // Open the drawer
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
      </div>
    </div>
  );
};

export default Staff;
