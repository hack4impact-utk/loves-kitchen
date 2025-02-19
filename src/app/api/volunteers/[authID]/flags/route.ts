import { NextResponse } from 'next/server';
import { volModel } from '@/server/models/Vol';
import dbConnect from '@/utils/dbconnect';

// Add a flag to a specific volunteer
export const POST = async function (
  req: Request,
  { params }: { params: { volunteerId: string } }
) {
  await dbConnect();

  try {
    const { flag } = await req.json();
    const { volunteerId } = params;

    if (!flag) {
      return NextResponse.json(
        { success: false, error: 'Flag data is missing' },
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

// Remove a flag from a specific volunteer
export const DELETE = async function (
  req: Request,
  { params }: { params: { volunteerId: string } }
) {
  await dbConnect();

  try {
    const { flagIndex } = await req.json();
    const { volunteerId } = params;

    if (flagIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Flag index is missing' },
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
