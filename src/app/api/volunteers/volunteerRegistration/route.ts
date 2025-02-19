import { IVolunteer, Volunteer } from '@/server/models/Volunteer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const toAdd: IVolunteer = await req.json();

    const volunteer = new Volunteer(toAdd);
    await volunteer.save();

    return NextResponse.json(
      { message: 'Volunteer registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving volunteer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
