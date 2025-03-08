'use client';

import React, { useState, useEffect } from 'react';
import AdminVolTable from '@/components/AdminVolTable';
import VolunteerDrawer from '@/components/VolunteerDrawer'; // Updated sidepage component
import NavBar from '@/components/NavBar';
import { IVolunteer } from '@/server/models/Volunteer';
import theme from '@/types/colors';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getRoles } from '@/server/actions/auth0m';
import { useRouter } from 'next/navigation';

const Admin = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkRoles = async () => {
      if (user?.sub && router) {
        const roles = await getRoles(user.sub!);
        if (!roles.includes('Admin')) {
          router.push('/');
        }
      }
    };

    if (user) {
      checkRoles();
    }
  }, [user, router]);

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

  const handleAddVolunteer = async (volunteer: IVolunteer) => {
    await fetch('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(volunteer),
    });
  };

  return (
    <div
      style={{
        backgroundColor: theme.offWhite,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <NavBar />
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <AdminVolTable
          volunteers={volunteers}
          onView={handleViewVolunteer} // Use the drawer open function
          onAddVolunteer={handleAddVolunteer}
        />

        {/* Sidepage (Drawer) for Viewing Volunteer Details */}
        {selectedVolunteer && (
          <VolunteerDrawer
            admin={true}
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

export default Admin;
