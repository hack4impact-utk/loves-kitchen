import { decrypt } from '@/server/actions/secret';
import { NextResponse } from 'next/server';
import { ISession, sessionModel } from '@/server/models/Session';

const MONGODB_URI = process.env.MONGODB_URI;

function beforeSessionEnd(session: ISession): boolean {
  const endTime = new Date(session.startTime);
  endTime.setHours(endTime.getHours() + session.length);

  const currentTime = new Date();

  return currentTime < endTime;
}

export async function POST(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    if (!MONGODB_URI) {
      throw new Error('Missing MONGODB_URI environment variable');
    }

    // Read encrypted code from request
    const code = params.code;
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No code provided' },
        { status: 400 }
      );
    }

    let authID: string;
    try {
      const body = await req.json();
      authID = body.authID;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to get authID from body' },
        { status: 400 }
      );
    }

    // Decrypt the QR code data
    const session: ISession = JSON.parse(await decrypt(code));
    session.workedBy = authID;

    // Validate session timing
    const validTime = beforeSessionEnd(session);

    if (!validTime) {
      return NextResponse.json(
        { success: false, error: 'Session has expired' },
        { status: 400 }
      );
    }

    // Check if session already exists
    const existingSession = await sessionModel.findOne({
      workedBy: session.workedBy,
      startTime: session.startTime,
      length: session.length,
    });

    if (existingSession) {
      return NextResponse.json(
        { success: false, error: 'Session already exists' },
        { status: 400 }
      );
    }

    // Save new session
    const newSession = new sessionModel({
      workedBy: session.workedBy,
      startTime: session.startTime,
      length: session.length,
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
