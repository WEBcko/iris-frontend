import { UserType } from "./user";

export type SignInInput = {
  email: string;
  password: string;
};
export type SignInResponse = {
  access_token: string;
  user: UserType;
};
export type SignUpInput = {
  username: string;
  email: string;
  password: string;
};
export type SignUpResponse = {
  message: string;
};
