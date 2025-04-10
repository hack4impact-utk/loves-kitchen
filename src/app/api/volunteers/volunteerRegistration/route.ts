import { getRoles } from '@/server/actions/auth0m';
import { IVolunteer, Volunteer } from '@/server/models/Volunteer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const toAdd: IVolunteer = await req.json();

    // check whether corresponding auth0 user is a staff member
    if ((await getRoles(toAdd.authID)).includes('Staff')) {
      toAdd.is_staff = true;
    }

    // check if volunteer already exists by authID
    let search = await Volunteer.find({
      authID: toAdd.authID,
    });
    if (search.length == 1) {
      console.error('Registered volunteer already exists.');
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }

    // check if volunteer already exists by email
    search = await Volunteer.find({
      email: toAdd.email,
    });
    if (search.length == 1) {
      console.error('Email already exists.');
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }

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
