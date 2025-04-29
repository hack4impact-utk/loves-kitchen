import { NextResponse } from 'next/server';
import { Volunteer } from '@/server/models/Volunteer';
import { sessionModel } from '@/server/models/Session';

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(
  req: Request
) {
  try {
    if (!MONGODB_URI) {
      throw new Error('Missing MONGODB_URI environment variable');
    }

    const body = await req.json();
    const {authID, length} = body;

    if (!authID || !length || length < 1) {
      return NextResponse.json(
        { success: false, error: 'Failed to get valid authID or length from body' },
        { status: 400 }
      );
    }

    const checkedIn = await sessionModel.findOne(
      { checked_out: false, workedBy: authID }
    );

    if (checkedIn) {
      return NextResponse.json(
        { success: false, error: 'User already checked in for a session' },
        { status: 400 }
      );
    }

    // Save new session
    const newSession = new sessionModel({
      workedBy: authID,
      startTime: new Date(),
      length: length,
      checked_out: false
    });
    await newSession.save();

    await Volunteer.updateOne(
      { authID: authID },
      { checked_in: true }
    );

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