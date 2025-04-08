// Testing purposes?
/*async function randomizeCheckin() {
  const baseURL = process.env.AUTH0_BASE_URL;

  async function checkInSessions(authId: string) {
    const response = await fetch (`${baseURL}/api/volunteers/${authId}/sessions`);
    const data = await response.json();

    if (data.success) {
      await Promise.all(
        data.sessions
          .map((checkedInSesh: ISession) => {
            return (
              fetch(`${baseURL}/api/volunteers/${authId}/sessions`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sessionId: checkedInSesh._id,
                  length: checkedInSesh.length,
                  checked_out: false
                }),
              }
            )
          )
        })
      );
    } else {
      console.log('Faliled to fetch sessions');
    }
  }

  const response = await fetch(`${baseURL}/api/volunteers`);
  const data = await response.json();

  if (data.success) {
    for (const v of data.volunteers) {
      const CHECKED_IN = Math.random() < 0.3;
      if (CHECKED_IN) {
        await checkInSessions(v.authID);
        await fetch(`${baseURL}/api/volunteers/${v.authID}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              checked_in: true,
              authID: v.authID,
              is_staff: v.is_staff,
              firstName: v.firstName,
              lastName: v.lastName,
              age: v.age,
              email: v.email,
              phone: v.phone,
              address: v.address,
            }),
          })
        }
      }
    } else {
      console.log('Failed to fetch volunteers');
    }
}*/

import { IVolunteer } from '@/server/models/Volunteer';
import { Model } from 'mongoose';

export async function register() {
  async function checkOutVolunteers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VolModel: Model<
      any,
      NonNullable<unknown>,
      NonNullable<unknown>,
      NonNullable<unknown>,
      any,
      any
    >,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SessionModel: Model<
      any,
      NonNullable<unknown>,
      NonNullable<unknown>,
      NonNullable<unknown>,
      any,
      any
    >,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db: () => Promise<any>
  ) {
    await db();
    try {
      const checkedInVolunteers = await VolModel.find({
        checked_in: true,
      }).select('authID');

      if (checkedInVolunteers.length === 0) {
        console.log('No volunteers to check out.');
        return;
      }

      const authIDs = checkedInVolunteers.map((v: IVolunteer) => v.authID);

      const checkedInSessions = await SessionModel.find({
        workedBy: { $in: authIDs },
        checked_out: false,
      }).select('_id');

      const sessionIdsToUpdate = checkedInSessions.map(
        (session) => session._id
      );

      // Update all checked in sessions where a volunteer is checked in
      await SessionModel.updateMany(
        { _id: { $in: sessionIdsToUpdate } },
        { $set: { checked_out: true } }
      );

      // Checkout all volunteers
      await VolModel.updateMany(
        { authID: { $in: authIDs } },
        { $set: { checked_in: false } }
      );

      console.log('Successfully checkout out volunteers!');
    } catch (err) {
      console.log('Failed to update volunteers', err);
    }
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { schedule } = await import('node-cron');
    const { default: dbConnect } = await import('@/utils/dbconnect');
    const { sessionModel } = await import('@/server/models/Session');
    const { Volunteer } = await import('@/server/models/Volunteer');

    schedule(
      '0 16 * * *',
      async () => {
        console.log(
          `Running automatic volunteer checkout at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`
        );
        checkOutVolunteers(Volunteer, sessionModel, dbConnect);
      },
      {
        scheduled: true,
        timezone: 'America/New_York',
      }
    );
  }
}
