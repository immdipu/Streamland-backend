export interface userSchemaTypes {
  fullName: string;
  email: string;
  password: string;
  username: string;
  profilePic: string;
  email_verified: boolean;
  loggedInWithGoogle: boolean;
}

export interface googlePayloadTypes {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  username: string;
  email_verified: boolean;
}
