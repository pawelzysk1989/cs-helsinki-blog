export type UserNotRegistered = {
  username: string;
  name?: string;
  password: string;
};

export type UserRegistered = {
  username: string;
  name: string;
  passwordHash: string;
};
