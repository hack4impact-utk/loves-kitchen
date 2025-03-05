export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { IVolunteer, Volunteer } from '@/server/models/Volunteer';
import dbConnect from '@/utils/dbconnect';

export const GET = async function (
  req: Request,
  { params }: { params: { authID: string } }
) {
  await dbConnect();

  try {
    const volunteer = await Volunteer.findOne({ authID: params.authID });
    // console.log('Fetched volunteers from DB:', volunteers);
    return NextResponse.json({ success: true, volunteer }, { status: 200 });
  } catch (error) {
    console.error(
      `Failed to fetch volunteer with authID ${params.authID}`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch volunteer with authID ${params.authID}`,
      },
      { status: 500 }
    );
  }
};

export const PUT = async function (
  req: Request,
  { params }: { params: { authID: string } }
) {
  await dbConnect();

  try {
    const { authID } = params;
    const toUpdate: IVolunteer | null | undefined = await Volunteer.findOne({
      authID: authID,
    });

    if (toUpdate == undefined) {
      throw new Error('User does not exist.');
    }

    const body = await req.json();

    await Volunteer.updateOne(
      { authID: authID },

      {
        address: body.address,
        phone: body.phone,
      }
    );
    // console.log('Fetched volunteers from DB:', volunteers);
    return NextResponse.json({ success: true, toUpdate }, { status: 200 });
  } catch (error) {
    console.error('the number 1', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
};
