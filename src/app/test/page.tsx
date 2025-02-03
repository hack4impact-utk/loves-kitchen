// /src/app/test/page.tsx
'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hardcoded session object
    const sessionObject = {
      startTime: new Date().toISOString(), // Current time
      someDecimal: 123.45,
      someString: 'example',
    };

    // Mock encryption function
    function encrypt(data: string): string {
      return Buffer.from(data).toString('base64');
    }

    // Convert the object to a JSON string and encrypt it
    const jsonString = JSON.stringify(sessionObject);
    const encryptedString = encrypt(jsonString);

    // Make a GET request to the server
    fetch(`/api/checkin?code=${encryptedString}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Received:', data);
        if (data.success) {
          setResponse(data.session);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Failed to fetch data');
      });
  }, []);

  return (
    <div>
      <h1>Test API Route</h1>
      {response ? (
        <div>
          <h2>Session Object:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      ) : error ? (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
