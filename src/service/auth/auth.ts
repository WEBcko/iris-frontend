import { AxiosRequestConfig } from "axios";
import { apiRequestWithoutToken } from "../../config/api";
import {
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse,
} from "../../types/auth";

export const signIn = async (input: SignInInput): Promise<SignInResponse> => {
  const config: AxiosRequestConfig = {
    url: "/api/login",
    method: "POST",
    data: input,
  };
  return apiRequestWithoutToken<SignInResponse>(config);
};
export const signUp = async (input: SignUpInput): Promise<SignUpResponse> => {
  const config: AxiosRequestConfig = {
    url: "/api/register",
    method: "POST",
    data: input,
  };
  return apiRequestWithoutToken<SignUpResponse>(config);
};
