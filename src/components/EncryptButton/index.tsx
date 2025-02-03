import { QRData } from '@/types/qrobject';
import { encrypt, decrypt } from '@/utils/secret';
import React from 'react';

const EncryptButton = () => {
  const DUMMY_KEY = '2HXMU8ZZjr0WDwnhh5dyNOcUNyGjj9KpPlCPRnl1IOQ=';
  const DUMMY_IV = 'VpF96kO8DdN4kQyP3hXyCQ==';
  const TO_ENCRYPT: QRData = {
    someDecimal: 1.3,
    someString: 'test str',
  };

  function test() {
    const src = JSON.stringify(TO_ENCRYPT);

    const encrypted = encrypt(src, DUMMY_KEY, DUMMY_IV);
    console.log(encrypted);

    const decrypted = decrypt(encrypted, DUMMY_KEY, DUMMY_IV);
    console.log(decrypted);
  }

  return (
    <div>
      <button
        onClick={() => test()}
        className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg text-white"
      >
        Send
      </button>
    </div>
  );
};

export default EncryptButton;
