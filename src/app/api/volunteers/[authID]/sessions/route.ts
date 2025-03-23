import { NextResponse } from 'next/server';
import { sessionModel } from '@/server/models/Session';
import dbConnect from '@/utils/dbconnect';
import { Volunteer } from '@/server/models/Volunteer';

// Create a new session, keyed by volunteer
export const POST = async function (
  req: Request,
  { params }: { params: { authID: string } }
) {
  await dbConnect();

  try {
    const { authID } = params;
    const { length, startTime, checked_out } = await req.json();

    if (!length || !startTime) {
      return NextResponse.json(
        { success: false, error: 'Session data is missing' },
        { status: 400 }
      );
    }

    const volunteer = await Volunteer.findOne({ authID: authID });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    const session = await sessionModel.create({
      workedBy: volunteer.authID,
      startTime: startTime,
      length: length,
      checked_out: checked_out,
    });

    return NextResponse.json({ success: true, session }, { status: 200 });
  } catch (error) {
    console.error('Error adding session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add session' },
      { status: 500 }
    );
  }
};

// Delete a session
export const DELETE = async function (req: Request) {
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete session' },
      { status: 500 }
    );
  }
};

// Update a session
export const PUT = async function (req: Request) {
  await dbConnect();

  try {
    const { sessionId, length, checked_out } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is missing' },
        { status: 400 }
      );
    }

    await sessionModel.findOneAndUpdate(
      { _id: sessionId },
      {
        length: length,
        checked_out: checked_out,
      }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete session' },
      { status: 500 }
    );
  }
};

// Getting sessions of one or all volunteers from most recent to least recent
export const GET = async function (
  req: Request,
  { params }: { params: { authID: string } }
) {
  await dbConnect();

  // all volunteers?
  if (params.authID == 'all') {
    try {
      const sessions = await sessionModel.find({}).sort({ startTime: -1 });
      return NextResponse.json({ success: true, sessions }, { status: 200 });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }
  }

  // one volunteer
  try {
    const sessions = await sessionModel
      .find({ workedBy: params.authID })
      .sort({ startTime: -1 });
    return NextResponse.json({ success: true, sessions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
};
