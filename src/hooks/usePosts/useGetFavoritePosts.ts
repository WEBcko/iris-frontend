import { useMutation, useQuery } from "@tanstack/react-query";
import { getFavoritePosts,  } from "../../service/posts/posts";

export const useGetFavoritePosts = () => {
  return useQuery({
    queryKey: ["getFavoritePosts"],
    queryFn: getFavoritePosts,
  });
};
