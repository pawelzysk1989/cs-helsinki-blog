export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginResponseBody {
  id: string;
  username: string;
  name?: string;
  token: string;
}
