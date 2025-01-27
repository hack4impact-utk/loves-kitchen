'use client';

import React, { useState, useEffect } from 'react';
import VolunteersTable from '@/components/VolunteerTable';
import VolunteerDrawer from '@/components/VolunteerDrawer'; // Updated sidepage component
import NavBar from '@/components/NavBar';
import { Volunteer } from '@/server/models/Vol';
import Divider from '@mui/material/Divider';
import { useUser } from '@auth0/nextjs-auth0/client';

const Staff = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Drawer state
  const { user, error, isLoading } = useUser();

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
  const handleViewVolunteer = (volunteer: Volunteer) => {
    console.log('Opening drawer for:', volunteer); // Debugging log
    setSelectedVolunteer(volunteer); // Set the selected volunteer
    setDrawerOpen(true); // Open the drawer
  };

  return (
    <div style={{ backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
      <NavBar user={user} error={error} isLoading={isLoading} />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#333',
            }}
          >
            Volunteers
          </h1>
          <Divider sx={{ marginBottom: '1rem' }} />
          <VolunteersTable
            volunteers={volunteers}
            onView={handleViewVolunteer} // Use the drawer open function
            onFlags={() => {
              console.log('Flags clicked');
            }} // Placeholder for flags
          />
        </div>

        {/* Sidepage (Drawer) for Viewing Volunteer Details */}
        {selectedVolunteer && (
          <VolunteerDrawer
            open={isDrawerOpen} // Controlled by state
            onClose={() => setDrawerOpen(false)} // Close the drawer
            volunteer={selectedVolunteer} // Pass the selected volunteer
          />
        )}
      </div>
    </div>
  );
};

export default Staff;
