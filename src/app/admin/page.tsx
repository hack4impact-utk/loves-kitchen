'use client';

import React, { useState, useEffect } from 'react';
import VolunteerDrawer from '@/components/VolunteerDrawer'; // Updated sidepage component
import NavBar from '@/components/NavBar';
import { IVolunteer } from '@/server/models/Volunteer';
import theme from '@/types/colors';
import UserTable from '@/components/UserTable';
import VerifyLayout, {
  PageVerifyType,
  VerifyContextType,
} from '@/components/VerifyLayout';
import { UserRow } from '../staff/page';
import GlobalSeshStats from '@/components/GlobalSeshStats';

const Admin = () => {
  function verify(vcontext: VerifyContextType): PageVerifyType {
    const out: PageVerifyType = {
      accepted: false,
      url: '/',
      rejectMsg: 'Invalid permissions!',
    };
    if (vcontext.roles && vcontext.roles.includes('Admin')) {
      out.accepted = true;
    }
    return out;
  }

  const [volunteers, setVolunteers] = useState<IVolunteer[]>([]);
  const [userRows, setUserRows] = useState<UserRow[]>([]);
  const [staffRows, setStaffRows] = useState<UserRow[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<IVolunteer | null>(
    null
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Drawer state
  const [globalSeshStatsState, setSeshStats] = useState({ avg: 0, total: 0 });
  const [globalTimes, setGlobalTimes] = useState({
    startTimeISO: '1986-02-14T00:00',
    endTimeISO: new Date().toISOString().split('T')[0] + 'T23:59',
  });

  // Fetch volunteers from the server
  useEffect(() => {
    const fetchVolunteers = async () => {
      const response = await fetch('/api/volunteers');
      const data = await response.json();
      if (data.success) {
        setVolunteers(data.volunteers);
        setUserRows(
          data.volunteers
            .filter((vol: IVolunteer) => !vol.is_staff)
            .map((row: IVolunteer) => ({
              ...row,
              id: row.authID,
              createdAt: new Date(row.createdAt).toLocaleDateString('en-US'),
            }))
        );
        setStaffRows(
          data.volunteers
            .filter((vol: IVolunteer) => vol.is_staff)
            .map((row: IVolunteer) => ({
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

  const handleAddUser = async (user: IVolunteer) => {
    const res = await fetch('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    const data = (await res.json()).volunteer;

    if (data) {
      user.authID = data.authID;
      user.createdAt = data.createdAt;
      setVolunteers((prev) => [user, ...prev]);

      if (user.is_staff) {
        setStaffRows((prev) => [
          {
            ...user,
            id: user.authID,
          },
          ...prev,
        ]);
      } else {
        setUserRows((prev) => [
          {
            ...user,
            id: user.authID,
          },
          ...prev,
        ]);
      }
    }
  };

  return (
    <VerifyLayout verify={verify} doGetRoles={true} doGetVol={false}>
      <div
        className="min-h-[100vh]"
        style={{
          backgroundColor: theme.offWhite,
        }}
      >
        <NavBar />
        <div className="flex flex-col items-center justify-center pt-[164px] pb-20 gap-10">
          <GlobalSeshStats
            stats={globalSeshStatsState}
            setStats={setSeshStats}
            globalTimes={globalTimes}
            setGlobalTimes={setGlobalTimes}
          />

          <UserTable
            is_admin={true}
            shows_staff={false}
            volunteers={volunteers}
            rows={userRows}
            setRows={setUserRows}
            onView={handleViewVolunteer} // Use the drawer open function
            onAddUser={handleAddUser}
          />

          <UserTable
            is_admin={true}
            shows_staff={true}
            volunteers={volunteers}
            rows={staffRows}
            setRows={setStaffRows}
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
              setUserRows={setUserRows}
              setStaffRows={setStaffRows}
              setGlobSeshStats={setSeshStats}
              globSeshStats={globalSeshStatsState}
              globalTimes={globalTimes}
            />
          )}
        </div>
      </div>
    </VerifyLayout>
  );
};

export default Admin;
