'use client';

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import lktheme from '@/types/colors';
import QRDisplay from '@/components/QRDisplay';
import { Session } from '@/server/models/Session';
import { getQRCode } from '@/server/actions/qrurl';

const StaffQR = () => {
  const [sessionLength, setSessionLength] = useState('');
  const [sessionDateTime, setSessionDateTime] = useState('');
  // Evan here, beginning to second guess whether we should have the earliness and lateness stuff?
  // const [checkInEarly, setCheckInEarly] = useState('');
  // const [checkInLate, setCheckInLate] = useState('');
  const [qrData, setQrData] = useState(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ); // do this later

  async function generateQR() {
    const qrSesh: Session = {
      _id: '',
      workedBy: '',
      startTime: sessionDateTime,
      length: parseFloat(sessionLength),
    };

    const qrCode = await getQRCode(qrSesh);
    setQrData(qrCode);
  }

  return (
    <>
      <NavBar />
      <div
        className="min-h-screen flex flex-col items-center p-5 gap-10 pt-[100px]"
        style={{ backgroundColor: lktheme.offWhite }}
      >
        <div className="flex flex-row gap-10">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md w-[400px] h-[400px]">
            <label className="block text-sm font-medium text-gray-700">
              Session Length (hours)
            </label>
            <input
              type="number"
              value={sessionLength}
              onChange={(e) => setSessionLength(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700">
              Session Date & Time
            </label>
            <input
              type="datetime-local"
              value={sessionDateTime}
              onChange={(e) => setSessionDateTime(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />

            {/* Evan here, I'm beginning to second guess whether we should have the earliness and lateness stuff? */}
            {/* <label className="block text-sm font-medium text-gray-700">
              Check-in Opens (minutes before)
            </label>
            <input
              type="number"
              value={checkInEarly}
              onChange={(e) => setCheckInEarly(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700">
              Check-in Closes (minutes after)
            </label>
            <input
              type="number"
              value={checkInLate}
              onChange={(e) => setCheckInLate(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            /> */}

            <button
              onClick={generateQR}
              className="bg-blue-500 text-white p-2 rounded w-full mt-3"
            >
              Generate QR Code
            </button>
          </div>

          <div className="w-[400px] h-[400px] bg-gray-300 flex items-center justify-center text-white">
            <QRDisplay url={qrData} width={400} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffQR;
