'use client';

import React, { useEffect, useState } from 'react';
import QRDisplay from '../QRDisplay';
import { encrypt } from '@/server/actions/secret';
import { getBaseURL } from '@/server/actions/qrurl';
import Image from 'next/image';

const DailyQR = () => {
  const [qrData, setQrData] = useState<string>('');

  useEffect(() => {
    (async () => {
      // get and encrypt current day
      const todayStr = new Date().toISOString();
      const todayCode = await encrypt(todayStr);
      const checkinURL =
        (await getBaseURL()) + `/user/checkin/${encodeURIComponent(todayCode)}`;
      setQrData(checkinURL);
    })();
  }, []);

  return (
    <div>
      {qrData == '' ? (
        <>
          <div className="w-[400px] h-[400px] bg-white flex items-center justify-center">
            <div className="animate-spin opacity-60">
              <Image
                width={80}
                height={80}
                alt="preparing QR code..."
                src="/loading.svg"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <QRDisplay url={qrData} width={400} />
        </>
      )}
    </div>
  );
};

export default DailyQR;
