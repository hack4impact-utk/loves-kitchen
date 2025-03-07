export interface IAuth0UserCreate {
  email: string;
  user_metadata: object;
  blocked: boolean;
  email_verified: boolean;
  app_metadata: object;
  given_name: string;
  family_name: string;
  name: string;
  nickname: string;
  picture: string;
  user_id: string;
  connection: string;
  password: string;
  verify_email: boolean;
}

export interface IAuth0User {
  app_metadata: object;
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: object[];
  last_password_reset: string;
  multifactor: string[];
  name: string;
  nickname: string;
  permissions: string;
  phone_number: string;
  phone_verified: boolean;
  picture: string;
  updated_at: string;
  user_id: string;
  user_metadata: object;
  username: string;
}
