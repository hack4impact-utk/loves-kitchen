import { IVolunteer } from '@/server/models/Volunteer';
import { ISession } from '@/server/models/Session';

async function randomizeCheckin() {
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
}

export async function register() {
  const baseURL = process.env.AUTH0_BASE_URL;
  
  async function checkOutSessions(authId: string) {
    const response = await fetch (`${baseURL}/api/volunteers/${authId}/sessions`);
    const data = await response.json();

    if (data.success) {
      const checkedInSesh: ISession[] = data.sessions.filter((sesh: ISession) => !sesh.checked_out);

      for (const session of checkedInSesh) {
        await fetch(`${baseURL}/api/volunteers/${authId}/sessions`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: session._id,
              length: session.length,
              checked_out: true
            }),
          })
      }

    } else {
      console.log('Faliled to fetch sessions');
    }
  }

  async function checkOutVolunteers() {
    const response = await fetch(`${baseURL}/api/volunteers`);
    const data = await response.json();

    if (data.success) {
      const checkedInVols: IVolunteer[] = data.volunteers.filter((v: IVolunteer) => v.checked_in);

      for (const v of checkedInVols) {
        await checkOutSessions(v.authID);
        await fetch(`${baseURL}/api/volunteers/${v.authID}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              checked_in: false,
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
    } else {
      console.log('Failed to fetch volunteers');
      return [];
    }

    const updatedResponse = await fetch(`${baseURL}/api/volunteers`);
    const updatedData = await updatedResponse.json();
    return updatedData.volunteers;
  }

  
  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { schedule } = await import('node-cron');
    schedule('0 * * * * *',  async () => {
      console.log('Randomizing volunteers...');
      //await randomizeCheckin();
      console.log("CHECKING OUT VOLS");
      //await sleep(20000);
      const vols: IVolunteer[] = await checkOutVolunteers();
      const val = vols.some(v => v.checked_in);
      val ? console.log("FAILURE") : console.log("SUCCESS");
      //console.log('CHECKED OUT!!');
    });
  }
}
