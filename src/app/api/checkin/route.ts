import { decrypt } from '@/server/actions/secret';
import { NextResponse } from 'next/server'; // Next.js utility for handling responses
import { TestSessionObject } from '@/types/qrobject';

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
    const session: TestSessionObject = JSON.parse(await decrypt(code));

    // Validate the session object
    const currentDate = new Date();
    const sessionDate = new Date(session.startTime);

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
      { success: true, session: session },
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
