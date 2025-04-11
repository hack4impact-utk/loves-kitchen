export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import { ISession, sessionModel } from '@/server/models/Session';
import { IVolunteer, Volunteer } from '@/server/models/Volunteer';

export const GET = async function (
  req: NextRequest,
  { params }: { params: { authID: string } }
) {
  /*
        Given:
            authID through URL (either "global" or {authID}),
            startTimeISO through query,
            endTime through query
        Return:
            {
                avg: number;
                total: number;
            }
    */

  // get start and end times from query parameters
  const searchParams = req.nextUrl.searchParams;
  const startTimeISO = searchParams.get('startTimeISO');
  const endTimeISO = searchParams.get('endTimeISO');

  if (!startTimeISO || !endTimeISO) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid start and end time ISO strings`,
      },
      { status: 500 }
    );
  }

  // get the global or specific vol's sessions
  try {
    const startTime = new Date(startTimeISO).getTime();
    const endTime = new Date(endTimeISO).getTime();

    await dbConnect();
    let totalHours = 0;
    let numSeshs = 0;
    const { authID } = params;
    const filter = authID == 'global' ? {} : { workedBy: authID };
    const sessions: ISession[] = await sessionModel.find(filter);

    // compute statistics
    for (let i = 0; i < sessions.length; ++i) {
      const sesh = sessions[i];
      const vol: IVolunteer | null = await Volunteer.findOne({
        authID: sesh.workedBy,
      });
      if (!vol) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to fetch volunteer with authID ${params.authID}`,
          },
          { status: 500 }
        );
      }

      const currentTime = new Date(sesh.startTime).getTime();
      const inInterval = currentTime < endTime && currentTime > startTime;
      if (inInterval && !vol.is_staff) {
        totalHours += sesh.length;
        ++numSeshs;
      }
    }

    return NextResponse.json(
      {
        success: true,
        total: totalHours,
        avg: numSeshs != 0 ? totalHours / numSeshs : 0,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch volunteer with authID ${params.authID}`,
      },
      { status: 500 }
    );
  }
};
