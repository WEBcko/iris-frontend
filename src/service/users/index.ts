import { AxiosRequestConfig } from "axios";
import { apiRequestWithToken } from "../../config/api";
import { SearchUsersByNameResponse } from "../../types/users";

export const listUsersById = async (userId: string): Promise<any> => {
  const config: AxiosRequestConfig = {
    url: `/api/user/get-user-by-id/${userId}`,
    method: "GET",
  };

  return apiRequestWithToken<any>(config);
};

export const searchUsersByName = async (
  name: string
): Promise<SearchUsersByNameResponse[]> => {
  const config: AxiosRequestConfig = {
    url: `/api/user/search-users-by-username/${name}`,
    method: "GET",
  };

  return apiRequestWithToken<SearchUsersByNameResponse[]>(config);
};
