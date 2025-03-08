'use client';

import React, { useState, useEffect } from 'react';
import AdminVolTable from '@/components/AdminVolTable';
import AdminStaffTable from '@/components/AdminStaffTable';
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

  const handleAddUser = async (user: IVolunteer) => {
    const res = await fetch('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    const data = (await res.json()).volunteer;

    if (data) {
      user.authID = data.authID;
      user.createdAt = data.createdAt;
      setVolunteers((prev) => [...prev, user]);
    }
  };

  return (
    <div
      className="min-h-[100vh]"
      style={{
        backgroundColor: theme.offWhite,
      }}
    >
      <NavBar />
      <div className="flex flex-col items-center justify-center pt-[100px] pb-20 gap-10">
        <AdminVolTable
          volunteers={volunteers.filter((volunteer) => !volunteer.is_staff)}
          onView={handleViewVolunteer} // Use the drawer open function
          onAddUser={handleAddUser}
        />

        <AdminStaffTable
          volunteers={volunteers.filter((volunteer) => volunteer.is_staff)}
          onView={handleViewVolunteer} // Use the drawer open function
          onAddUser={handleAddUser}
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
