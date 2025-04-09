import { AxiosRequestConfig } from "axios";
import { apiRequestWithOptionalToken, apiRequestWithToken } from "../../config/api";

type GetUserByIdResponse = {
  user_image: string;
  username: string;
  is_following: boolean;
  followers_number: number;
  following_number: number;
};


export const getUserById = async (userId: string): Promise<GetUserByIdResponse> => {
  const config: AxiosRequestConfig = {
    url: `/api/user/get-user-by-id/${userId}`,
    method: "GET",
  };

  return apiRequestWithToken<GetUserByIdResponse>(config);
};

export const followUser = async (userId: string): Promise<GetUserByIdResponse> => {
  const config: AxiosRequestConfig = {
    url: `/api/user/follow/${userId}`,
    method: "POST",
  };

  return apiRequestWithToken<GetUserByIdResponse>(config);
};
