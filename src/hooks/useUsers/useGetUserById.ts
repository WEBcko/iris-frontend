import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../service/user/user";

export const useUserById = (userId?: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userId ? getUserById(userId) : Promise.reject("No user ID"),
    enabled: !!userId, 
  });
};