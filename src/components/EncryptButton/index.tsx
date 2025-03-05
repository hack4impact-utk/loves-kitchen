'use client';

import React, { useState } from 'react';
import { ISession } from '@/server/models/Session';
import { encrypt } from '@/server/actions/secret';

const EncryptButton = () => {
  const [response, setResponse] = useState<string>('');

  async function getResponse() {
    // encrypt the thingy on the server-side
    const TO_ENCRYPT: ISession = {
      _id: '',
      startTime: new Date().toISOString(),
      workedBy: 'put our authID here to add to your own sessions list',
      length: 2,
    };
    // const TO_ENCRYPT: ISession = {
    //   _id: "",
    //   startTime: '2001-09-11T18:00',
    //   workedBy: "put our authID here to add to your own sessions list",
    //   length: 2
    // };
    const src = JSON.stringify(TO_ENCRYPT);
    const encrypted = await encrypt(src);
    // console.log(src);
    // console.log(encrypted);

    // get response from server
    const res = await fetch(`/api/checkin/${encodeURIComponent(encrypted)}`, {
      method: 'POST',
    });
    const obj = await res.json();

    // set the state variable with the response
    if (obj['success'] === true) {
      setResponse(JSON.stringify(obj['session'], null, 2));
    }
  }

  return (
    <div>
      <button
        onClick={() => getResponse()}
        className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg text-white"
      >
        Send
      </button>

      {response ? (
        <>
          <div className="text-black">
            <h2>Session Object:</h2>
            <pre>{response}</pre>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EncryptButton;
