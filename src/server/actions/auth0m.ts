'use server';

import {
  IAuth0User,
  IAuth0UserCreate,
  IAuth0UserUpdate,
  IAuth0Role,
} from '@/types/authTypes';

export async function getAuth0AccessToken(): Promise<string> {
  const restoken = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/oauth/token?`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID!,
        client_secret: process.env.AUTH0_CLIENT_SECRET!,
        audience: `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/`,
      }).toString(),
    }
  );

  const token = await restoken.json();
  return token.access_token ?? '';
}

export async function getAuth0Users(): Promise<IAuth0User[]> {
  const token = await getAuth0AccessToken();

  const res = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return await res.json();
}

export async function addAuth0User(
  user: IAuth0UserCreate
): Promise<IAuth0User | undefined> {
  const token = await getAuth0AccessToken();
  const res = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }
  );
  const data = await res.json();
  if (data.error) {
    console.log(data);
    return undefined;
  }
  console.log('Successfully added Auth0 user.');
  return data;
}

export async function delAuth0User(authID: string): Promise<void> {
  const token = await getAuth0AccessToken();
  const res = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users/${authID}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  try {
    const data = await res.json();
    console.log(data);
  } catch {
    console.log('Successfully deleted Auth0 user.');
  }
}

export async function putAuth0User(
  volunteer: IAuth0UserUpdate,
  authID: string
): Promise<void> {
  const token = await getAuth0AccessToken();

  // first update everything BUT password
  await fetch(`${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users/${authID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: volunteer.email,
      given_name: volunteer.given_name,
      family_name: volunteer.family_name,
      name: volunteer.name,
      nickname: volunteer.nickname,
    }),
  });

  // then update password
  if (volunteer.password) {
    await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users/${authID}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: volunteer.password,
        }),
      }
    );
  }
}

export async function getRoles(userid: string): Promise<string[]> {
  const token = await getAuth0AccessToken();

  const res = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users/${userid}/roles`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const roles = await res.json();

  const rolesStrs = [];
  for (let i = 0; i < roles.length; ++i) {
    rolesStrs.push(roles[i].name);
  }

  return rolesStrs;
}

export async function setRoles(userid: string, roles: string[]): Promise<void> {
  const token = await getAuth0AccessToken();

  // get ALL roles
  const rolesListRes = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/roles`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const rolesList: IAuth0Role[] = await rolesListRes.json();

  // get user's current roles
  const currentRoles = await getRoles(userid);

  // get roles which need to be added (those in new roles list but NOT in current roles list)
  const toAdd: string[] = [];
  for (let i = 0; i < roles.length; ++i) {
    if (currentRoles.find((role) => role == roles[i]) == undefined) {
      toAdd.push(roles[i]);
    }
  }

  // get roles which need to be removed (those in NOT new roles list but in current roles list)
  const toRemove: string[] = [];
  for (let i = 0; i < currentRoles.length; ++i) {
    if (
      roles.find((role) => role == currentRoles[i]) == undefined &&
      currentRoles[i] != 'Admin'
    ) {
      toRemove.push(currentRoles[i]);
    }
  }

  // convert each list of roles to their corresponding list of role IDs
  const toAddIDs: string[] = [];
  for (let i = 0; i < toAdd.length; ++i) {
    const role = rolesList.find((role) => role.name == toAdd[i]);
    if (!role) {
      throw new Error(
        `Error: Auth0 application does not have "${toAdd[i]}" role.`
      );
    }
    toAddIDs.push(role.id);
  }

  const toRemoveIDs: string[] = [];
  for (let i = 0; i < toRemove.length; ++i) {
    const role = rolesList.find((role) => role.name == toRemove[i]);
    if (!role) {
      throw new Error(
        `Error: Auth0 application does not have "${toRemove[i]}" role.`
      );
    }
    toRemoveIDs.push(role.id);
  }

  // console.log(roles);
  // console.log(currentRoles);
  // console.log(rolesList);
  // console.log(toAdd);
  // console.log(toAddIDs);
  // console.log(toRemove);
  // console.log(toRemoveIDs);

  await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users/${userid}/roles`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roles: toAddIDs,
      }),
    }
  );
  // try {
  //   let data = await res.json();
  //   console.log(data);
  // } catch {
  //   console.log("Empty response.");
  // }

  await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL!}/api/v2/users/${userid}/roles`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roles: toRemoveIDs,
      }),
    }
  );
  // try {
  //   let data = await res.json();
  //   console.log(data);
  // } catch {
  //   console.log("Empty response.");
  // }
}
