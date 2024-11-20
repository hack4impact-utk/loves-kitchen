'use client';
import React, { useState, useEffect } from 'react';
import VolunteersTable from '@/components/VolunteerTable';
import VolunteerModal from '@/components/VolunteerModal';
import FlagModal from '@/components/FlagModal';
import NavBar from '@/components/NavBar';
import { Volunteer } from '@/server/models/Vol';
import Divider from '@mui/material/Divider';

const Staff = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [isVolunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [isFlagModalOpen, setFlagModalOpen] = useState(false);

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

  const handleView = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setVolunteerModalOpen(true);
  };

  const handleFlags = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setFlagModalOpen(true);
  };

  const updateVolunteerFlags = (updatedVolunteer: Volunteer) => {
    setVolunteers((prev) =>
      prev.map((vol) =>
        vol._id === updatedVolunteer._id ? updatedVolunteer : vol
      )
    );
  };

  return (
    <div style={{ backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
      <NavBar />
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
            onView={handleView}
            onFlags={handleFlags}
          />
        </div>
        {selectedVolunteer && (
          <>
            <VolunteerModal
              open={isVolunteerModalOpen}
              handleClose={() => setVolunteerModalOpen(false)}
              volunteer={selectedVolunteer}
            />
            <FlagModal
              open={isFlagModalOpen}
              handleClose={() => setFlagModalOpen(false)}
              volunteer={selectedVolunteer}
              updateVolunteer={updateVolunteerFlags}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Staff;
