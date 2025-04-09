import { useQuery } from "@tanstack/react-query";
import { searchUsersByName } from "../../service/users";

export const useSearchUsersByName = (name: string) => {
  return useQuery({
    queryKey: ["useListUsersById", name],
    queryFn: () => searchUsersByName(name),
    enabled: !!name,
    refetchOnWindowFocus: false,
  });
};
