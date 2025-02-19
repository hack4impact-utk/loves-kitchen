import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import { IVolunteer, Volunteer } from '@/server/models/Volunteer';

// Add a flag to a specific volunteer
export const POST = async function (
  req: Request,
  { params }: { params: { authID: string } }
) {
  await dbConnect();

  try {
    const { flag } = await req.json();
    const { authID } = params;

    if (!flag) {
      return NextResponse.json(
        { success: false, error: 'Flag data is missing' },
        { status: 400 }
      );
    }

    const toUpdate: IVolunteer | null | undefined = await Volunteer.findOne({
      authID: authID,
    });

    if (!toUpdate) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    toUpdate.flags?.push(flag);
    await Volunteer.updateOne(
      { authID: authID },
      {
        flags: toUpdate.flags,
      }
    );

    return NextResponse.json(
      { success: true, volunteer: toUpdate },
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
  { params }: { params: { authID: string } }
) {
  await dbConnect();

  try {
    const { flagIndex } = await req.json();
    const { authID } = params;

    if (flagIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Flag index is missing' },
        { status: 400 }
      );
    }

    const volunteer = await Volunteer.findOne({
      authID: authID,
    });

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
