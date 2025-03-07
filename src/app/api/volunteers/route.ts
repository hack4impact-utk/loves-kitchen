export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Volunteer } from '@/server/models/Volunteer';
import dbConnect from '@/utils/dbconnect';

export const GET = async function () {
  await dbConnect();

  try {
    const volunteers = await Volunteer.find({});
    // console.log('Fetched volunteers from DB:', volunteers);
    return NextResponse.json({ success: true, volunteers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
};
