import { decrypt } from '@/server/actions/secret';
import { NextResponse } from 'next/server';
import { sessionModel } from '@/server/models/Session';

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(req: Request) {
  try {
    if (!MONGODB_URI) {
      throw new Error('Missing MONGODB_URI environment variable');
    }

    // Read encrypted code from request
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No code provided' },
        { status: 400 }
      );
    }

    // Decrypt the QR code data
    const sessionData = JSON.parse(await decrypt(code));

    // Validate session timing
    const sessionEndTime = new Date(sessionData.startTime);
    sessionEndTime.setHours(sessionEndTime.getHours() + sessionData.length);

    if (new Date() > sessionEndTime) {
      return NextResponse.json(
        { success: false, error: 'Session has expired' },
        { status: 400 }
      );
    }

    // Check if session already exists
    // const existingSession = await sessionModel.findOne({
    //   _id: sessionData._id,
    // });
    // if (existingSession) {
    //   return NextResponse.json(
    //     { success: false, error: 'Session already exists' },
    //     { status: 400 }
    //   );
    // }

    // Save new session
    const newSession = new sessionModel({
      //_id: sessionData._id,
      workedBy: sessionData.authID,
      startTime: sessionData.startTime,
      length: sessionData.length,
    });
    await newSession.save();

    return NextResponse.json(
      { success: true, session: newSession },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing session:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
