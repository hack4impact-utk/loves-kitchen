'use client';

import React, { useState, useEffect } from 'react';
import VolunteerDrawer from '@/components/VolunteerDrawer'; // Updated sidepage component
import NavBar from '@/components/NavBar';
import { IFlag, IVolunteer } from '@/server/models/Volunteer';
import theme from '@/types/colors';
import UserTable from '@/components/UserTable';
import VerifyLayout, {
  PageVerifyType,
  VerifyContextType,
} from '@/components/VerifyLayout';

export interface UserRow {
  id: string;
  _id: string;
  is_staff: boolean;
  authID: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  flags?: IFlag[];
}

const Staff = () => {
  const [volunteers, setVolunteers] = useState<IVolunteer[]>([]);
  const [newRows, setNewRows] = useState<UserRow[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<IVolunteer | null>(
    null
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Drawer state

  function verify(vcontext: VerifyContextType): PageVerifyType {
    const out: PageVerifyType = {
      accepted: false,
      url: '/',
      rejectMsg: 'Invalid permissions!',
    };
    if (vcontext.roles && vcontext.roles.includes('Staff')) {
      out.accepted = true;
    }
    return out;
  }

  // Fetch volunteers from the server
  useEffect(() => {
    const fetchVolunteers = async () => {
      const response = await fetch('/api/volunteers');
      const data = await response.json();
      if (data.success) {
        setVolunteers(data.volunteers);
        setNewRows(
          data.volunteers.map((row: IVolunteer) => ({
            ...row,
            id: row.authID,
            createdAt: new Date(row.createdAt).toLocaleDateString('en-US'),
          }))
        );
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
    <VerifyLayout verify={verify} doGetRoles={true} doGetVol={false}>
      <div style={{ backgroundColor: theme.offWhite, minHeight: '100vh' }}>
        <NavBar />
        <div className="flex flex-col items-center justify-center pt-[164px] pb-20 gap-10">
          <UserTable
            is_admin={false}
            shows_staff={false}
            volunteers={volunteers}
            rows={newRows}
            setRows={setNewRows}
            onView={handleViewVolunteer} // Use the drawer open function
          />

          <UserTable
            is_admin={false}
            shows_staff={true}
            volunteers={volunteers}
            rows={newRows}
            setRows={setNewRows}
            onView={handleViewVolunteer} // Use the drawer open function
          />
        </div>

        {/* Sidepage (Drawer) for Viewing Volunteer Details */}
        {selectedVolunteer && (
          <VolunteerDrawer
            admin={false}
            open={isDrawerOpen} // Controlled by state
            onClose={() => setDrawerOpen(false)} // Close the drawer
            volunteer={selectedVolunteer} // Pass the selected volunteer
            setSelectedVol={setSelectedVolunteer}
            setVolunteers={setVolunteers}
            setRows={setNewRows}
          />
        )}
      </div>
    </VerifyLayout>
  );
};

export default Staff;
