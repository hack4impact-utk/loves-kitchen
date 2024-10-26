/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  getConnection,
  findVol,
  addVol,
  delVol,
} from '@/server/actions/actions';
import { Volunteer } from '@/server/models/Vol';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Reset from '@/components/Reset';
import NavBar from '@/components/NavBar';

import CheckIcon from '@mui/icons-material/Check';
import { Box, Typography, Alert, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const Main = () => {
  const firstLoad = useRef<boolean>(false);
  const [volInput, setInput] = useState<any>({
    name: '',
    age: '',
  });

  // Temporary check in state for developers
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Change check-in states
  const toggleCheckIn = () => {
    setIsCheckedIn((prev) => !prev);
  };

  const [vols, setVols] = useState<Volunteer[]>([]);
  useEffect(() => {
    if (!firstLoad.current) {
      const fetchData = async () => {
        console.log(await getConnection());
        const data = await findVol();
        setVols(data);
      };
      fetchData();
      firstLoad.current = true;
    }
  });

  // get auth0 server information and make basic loading screen
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    toggleCheckIn();
    const target = e.target as HTMLInputElement;
    if (target.id === 'name') {
      setInput({
        name: target.value,
        age: volInput.age,
        major: volInput.major,
        gpa: volInput.gpa,
      });
    } else {
      setInput({
        name: volInput.name,
        age: target.value,
        major: volInput.major,
        gpa: volInput.gpa,
      });
    }
  }

  return (
    <>
      <div className="flex flex-col items-center bg-slate-900 text-white">
        <Button variant="contained" onClick={toggleCheckIn} sx={{ m: 2 }}>
          {isCheckedIn ? 'Check Out' : 'Check In'}
        </Button>

        {/* If user is logged in. */}
        {user && (
        <Box>
          {/* Display user's name */}

          <Typography
            variant="h2"
            className="mt-20 md:mt-10 lg:mt-5 text-4xl md:text-3xl lg:text-2xl text-center"
            gutterBottom
          >
            Hello, {user.name}!
          </Typography>

          {/* Add user information. */}

          <Box className="bg-slate-700 flex flex-col items-center px-3 py-5 rounded-xl">
            <Image
              src={user.picture ?? ''}
              alt={user.name ?? ''}
              width={100}
              height={100}
              priority
              className="rounded-full m-5"
            />
            <Typography variant="h5" className="mt-2 text-2xl">
              {user.name}
            </Typography>
            <Typography variant="body1" className="text-neutral-400">
              {user.email}
            </Typography>

            {/* Alert using MUI that displays if a user is checked in. */}

            <Alert
              icon={
                isCheckedIn ? (
                  <CheckIcon fontSize="inherit" />
                ) : (
                  <ErrorIcon fontSize="inherit" />
                )
              }
              className="my-3"
              severity={isCheckedIn ? 'success' : 'warning'} // Change severity based on status
            >
              {isCheckedIn ? 'Checked in.' : 'Not checked in.'}{' '}
              {/* Change display message */}
            </Alert>
          </Box>
        </Box>
      )}
      <div className="flex mt-5">
        <a
          href="/api/auth/login"
          className="py-2 px-7 m-2 bg-green-500 hover:bg-green-600 block rounded-xl"
        >
          Log In
        </a>
        <a
          href="/api/auth/logout"
          className="py-2 px-7 m-2 bg-red-500 hover:bg-red-600 block rounded-xl"
        >
          Log Out
        </a>
      </div>
      <div className="flex flex-row">
        <div className="m-auto w-[20vw] mx-[10vw]">
          <h1 className="text-3xl p-5 w-fit">
            Volunteers <span className="text-gray-400 text-lg">(scroll)</span>
          </h1>
          <div className="h-[80vh] overflow-scroll bg-black rounded-lg border-[2px] border-white scrollbar-none">
            {vols.map((vol) => {
              return (
                <div
                  key={JSON.stringify(vol)}
                  className="p-5 border-gray-700 border-[2px] m-5 rounded-xl hover:bg-neutral-900"
                >
                  <p className="text-2xl">{vol.name}</p>
                  <p className="text-gray-400">
                    Age: {vol.age ? vol.age.toString() : ''}
                  </p>
                  <p className="text-gray-400">
                    Date: {new Date(vol.createdAt).toLocaleString('en-US')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-row">
          <div className="m-auto w-[20vw] mx-[10vw]">
            <h1 className="text-3xl p-5 w-fit">
              Volunteers <span className="text-gray-400 text-lg">(scroll)</span>
            </h1>
            <div className="h-[80vh] overflow-scroll bg-black rounded-lg border-[2px] border-white scrollbar-none">
              {vols.map((vol) => {
                return (
                  <div
                    key={JSON.stringify(vol)}
                    className="p-5 border-gray-700 border-[2px] m-5 rounded-xl hover:bg-neutral-900"
                  >
                    <p className="text-2xl">{vol.name}</p>
                    <p className="text-gray-400">
                      Age: {vol.age ? vol.age.toString() : ''}
                    </p>
                    <p className="text-gray-400">
                      Date: {new Date(vol.createdAt).toLocaleString('en-US')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-[50vw] h-[100vh] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl p-5 w-fit">User Input</h1>
              <div className="flex">
                <input
                  id="name"
                  value={volInput.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="block m-5 p-2 rounded-md text-black"
                ></input>
                <input
                  id="age"
                  value={volInput.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="block m-5 p-2 rounded-md text-black"
                ></input>
              </div>
              <div className="flex justify-around gap-5">
                <button
                  onClick={() => {
                    const temp = volInput;
                    temp.age = parseFloat(temp.age);
                    addVol(temp);
                    const refresh = async () => {
                      setVols([]);
                      setVols(await findVol());
                    };
                    refresh();
                  }}
                  className="bg-green-600 hover:bg-green-400 text-white p-2 w-[75px] rounded-lg"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    delVol({ name: volInput.name });
                    const refresh = async () => {
                      setVols([]);
                      setVols(await findVol());
                    };
                    refresh();
                  }}
                  className="bg-red-600 hover:bg-red-400 text-white p-2 w-[75px] rounded-lg"
                >
                  Delete
                </button>
                <Reset setter={setVols} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
