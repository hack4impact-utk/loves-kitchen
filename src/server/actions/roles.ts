'use server';

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

export async function getRoles(userid: string): Promise<string[]> {
  const token = await getAuth0AccessToken();
  console.log(userid);

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
