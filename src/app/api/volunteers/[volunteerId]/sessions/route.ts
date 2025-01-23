import { NextResponse } from 'next/server';
import { volModel } from '@/server/models/Vol';
import { sessionModel } from '@/server/models/Session';
import dbConnect from '@/utils/dbconnect';

// Create a new session, keyed by volunteer
export const POST = async function (
  req: Request,
  { params }: { params: { volunteerId: string } }
) {
  await dbConnect();
  
  try {
    const {length, startTime} = await req.json();
    const { volunteerId } = params;

    if (!length || !startTime) {
      return NextResponse.json(
        { success: false, error: 'Session data is missing' },
        { status: 400 }
      );
    }

    const volunteer = await volModel.findById(volunteerId);

    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    const session = await sessionModel.create({
      workedBy: volunteer.name,
      startTime: startTime,
      length: length
    });

    return NextResponse.json(
      { success: true, session},
      { status: 200 }
    );

  } catch (error) {
    console.error('Error adding session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add session' },
      { status: 500 }
    );
  }

}

// Delete a session
export const DELETE = async function (
  req: Request
) {
  await dbConnect();

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is missing' },
        { status: 400 }
      );
    }

    await sessionModel.findByIdAndDelete(sessionId);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete session' },
      { status: 500 }
    );
  }
};

// Return all sessions
export const GET = async function () {
  await dbConnect();

  try {
    const sessions = await sessionModel.find({});
    return NextResponse.json({ success: true, sessions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
};