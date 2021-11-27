export type User = {
  id: string;
  username: string;
  name: string;
};

export type UserNotRegistered = {
  username: string;
  name?: string;
  password: string;
};

export type UserRegistered = {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
};
