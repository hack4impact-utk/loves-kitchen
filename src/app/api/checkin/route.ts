import { NextResponse } from 'next/server'; // Next.js utility for handling responses

// Define the structure of the session object
interface SessionObject {
  startTime: string; // ISO string format
  someDecimal: number;
  someString: string;
}

//  decryption function
function decrypt(data: string): string {
  // Decode base64 encoded string
  return Buffer.from(data, 'base64').toString('utf-8');
}

export async function GET(req: Request) {
  try {
    // Extract the encoded object from the URL query parameters
    const url = new URL(req.url);
    const code = url.searchParams.get('code'); // Get the 'code' parameter from the URL

    if (!code) {
      // If no code is provided, return an error
      return NextResponse.json(
        { success: false, error: 'No code provided in the URL' },
        { status: 400 }
      );
    }

    // Decode the encrypted string
    const decodedString = decrypt(code);
    const sessionObject: SessionObject = JSON.parse(decodedString); // Parse the decoded string into an object

    // Validate the session object
    const currentDate = new Date();
    const sessionDate = new Date(sessionObject.startTime);

    if (sessionDate.toDateString() !== currentDate.toDateString()) {
      // If the session start time is not within the current day, return an error
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid QR code: Session start time is not within the current day.',
        },
        { status: 400 }
      );
    }

    // If validation passes, return the decoded session object
    return NextResponse.json(
      { success: true, session: sessionObject },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing QR code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process QR code' },
      { status: 500 }
    );
  }
}
