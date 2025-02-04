'use client';
import { TestSessionObject } from '@/types/qrobject';
import { encrypt } from '@/server/actions/secret';
import React, { useState } from 'react';

const EncryptButton = () => {
  const [response, setResponse] = useState<string>('');

  async function getResponse() {
    // encrypt the thingy on the server-side
    const TO_ENCRYPT: TestSessionObject = {
      startTime: new Date().toISOString(),
      someDecimal: 1.3,
      someString: 'test str',
    };
    const src = JSON.stringify(TO_ENCRYPT);
    const encrypted = await encrypt(src);

    // get response from server
    const res = await fetch(
      '/api/checkin?' +
        new URLSearchParams({
          code: encrypted,
        }),
      {
        method: 'GET',
      }
    );
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
