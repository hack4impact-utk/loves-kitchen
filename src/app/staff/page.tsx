import React from 'react';
import NavBar from '@/components/NavBar';
import { useUser } from '@auth0/nextjs-auth0/client';

const User = () => {
  const { user, error, isLoading } = useUser();

  return (
    <>
      <NavBar user={user} error={error} isLoading={isLoading} />
      <p className="text-white">Welcome to the staff page!</p>
    </>
  );
};

export default User;
