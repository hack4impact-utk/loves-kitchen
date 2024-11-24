import { NextResponse } from 'next/server';
import { volModel } from '@/server/models/Vol';
import dbConnect from '@/utils/dbconnect';

export const GET = async function () {
  await dbConnect();

  try {
    const volunteers = await volModel.find({});
    console.log('Fetched volunteers from DB:', volunteers);
    return NextResponse.json({ success: true, volunteers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
};

export const POST = async function (req: Request) {
  await dbConnect();

  try {
    const { volunteerId, flag } = await req.json();

    if (!volunteerId || !flag) {
      return NextResponse.json(
        { success: false, error: 'Volunteer ID or flag data is missing' },
        { status: 400 }
      );
    }

    const updatedVolunteer = await volModel.findByIdAndUpdate(
      volunteerId,
      { $push: { flags: flag } },
      { new: true }
    );

    if (!updatedVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, volunteer: updatedVolunteer },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding flag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add flag' },
      { status: 500 }
    );
  }
};

export const DELETE = async function (req: Request) {
  await dbConnect();

  try {
    const { volunteerId, flagIndex } = await req.json();

    if (!volunteerId || flagIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Volunteer ID or flag index is missing' },
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

    if (
      !volunteer.flags ||
      flagIndex < 0 ||
      flagIndex >= volunteer.flags.length
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid flag index' },
        { status: 400 }
      );
    }

    volunteer.flags.splice(flagIndex, 1);
    await volunteer.save();

    return NextResponse.json({ success: true, volunteer }, { status: 200 });
  } catch (error) {
    console.error('Error removing flag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove flag' },
      { status: 500 }
    );
  }
};
