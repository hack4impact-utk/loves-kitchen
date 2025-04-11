export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { IVolunteerCreate, Volunteer } from '@/server/models/Volunteer';
import dbConnect from '@/utils/dbconnect';
import { IAuth0User, IAuth0UserCreate } from '@/types/authTypes';
import { addAuth0User, setRoles } from '@/server/actions/auth0m';

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

export const POST = async function (req: NextRequest) {
  await dbConnect();

  // just assume that the body's values are valid lol
  const body: IVolunteerCreate = await req.json();
  // console.log(body);

  // add this boi to the auth0 user database
  const auth0user: IAuth0UserCreate = {
    email: body.email,
    user_metadata: {},
    blocked: false,
    email_verified: false,
    app_metadata: {},
    given_name: body.firstName,
    family_name: body.lastName,
    name: `${body.firstName} ${body.lastName}`,
    nickname: body.email.split('@')[0],
    picture:
      'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    user_id: '',
    connection: 'Username-Password-Authentication',
    password: body.password,
    verify_email: false,
  };

  let addedUser: IAuth0User | undefined;
  try {
    addedUser = await addAuth0User(auth0user);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add user to Auth0 database.',
      },
      { status: 501 }
    );
  }
  // console.log(addedUser);

  if (!addedUser) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add user to Auth0 database.',
      },
      { status: 502 }
    );
  }

  setRoles(addedUser.user_id, body.is_staff ? ['Staff'] : []);

  // added to auth0 database, add to volunteer database
  const jsonVol = {
    is_staff: body.is_staff,
    checked_in: false,
    authID: addedUser.user_id,
    firstName: addedUser.given_name,
    lastName: addedUser.family_name,
    emergencyContact: body.emergencyContact,
    email: addedUser.email,
    phone: body.phone,
    address: body.address,
    createdAt: new Date().toISOString(),
    flags: [],
  };

  // console.log(jsonVol);

  const volunteer = new Volunteer(jsonVol);
  await volunteer.save();

  return NextResponse.json(
    {
      success: true,
      volunteer: jsonVol,
    },
    { status: 200 }
  );
};
