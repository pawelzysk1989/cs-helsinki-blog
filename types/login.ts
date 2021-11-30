export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginResponseBody {
  username: string;
  name?: string;
  token: string;
}
