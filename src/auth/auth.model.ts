export interface LoginCred {
  username: string;
  password: string;
}

export interface LoginRes {
  auth: boolean;
  role?: string;
  token?: string;
}
