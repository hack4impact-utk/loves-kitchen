export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { IVolunteer, Volunteer } from '@/server/models/Volunteer';
import dbConnect from '@/utils/dbconnect';
import { delAuth0User, putAuth0User, setRoles } from '@/server/actions/auth0m';
import { IAuth0UserUpdate } from '@/types/authTypes';
import { sessionModel } from '@/server/models/Session';

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

export const DELETE = async function (
  req: Request,
  { params }: { params: { authID: string } }
) {
  await dbConnect();

  try {
    await Volunteer.deleteOne({ authID: params.authID });

    await delAuth0User(params.authID);

    await sessionModel.deleteMany({ workedBy: params.authID });

    return NextResponse.json(
      { success: true, message: 'Deleted volunteer successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `Failed to delete volunteer with authID ${params.authID}`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: `Failed to delete volunteer with authID ${params.authID}`,
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
    // console.log(body);

    // update mongo database
    await Volunteer.updateOne(
      { authID: authID },

      {
        checked_in: body.checked_in,
        is_staff: body.is_staff,
        firstName: body.firstName,
        lastName: body.lastName,
        age: body.age,
        email: body.email,
        phone: body.phone,
        address: body.address,
      }
    );

    const rolesArr = [];
    if (body.is_staff) {
      rolesArr.push('Staff');
    }
    setRoles(authID, rolesArr);

    // update auth0 database
    let patchData: IAuth0UserUpdate;
    if (body.password == undefined || body.password == '') {
      patchData = {
        email: body.email,
        given_name: body.firstName,
        family_name: body.lastName,
        name: `${body.firstName} ${body.lastName}`,
        nickname: body.email.split('@')[0],
      };
    } else {
      patchData = {
        email: body.email,
        given_name: body.firstName,
        family_name: body.lastName,
        name: `${body.firstName} ${body.lastName}`,
        nickname: body.email.split('@')[0],
        password: body.password,
      };
    }

    await putAuth0User(patchData, body.authID);

    return NextResponse.json({ success: true, toUpdate }, { status: 200 });
  } catch (error) {
    console.error('the number 1', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
};
