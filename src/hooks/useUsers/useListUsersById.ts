import { useQuery } from "@tanstack/react-query";
import { listUsersById } from "../../service/users";

export const useListUsersById = (userId: string) => {
  return useQuery({
    queryKey: ["useListUsersById", userId],
    queryFn: () => listUsersById(userId),
    enabled: !!userId,
  });
};
