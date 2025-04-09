import { useMutation, useQuery } from "@tanstack/react-query";
import { listMyPosts } from "../../service/posts/posts";

export const useListMyPosts = () => {
  return useQuery({
    queryKey: ["useListMyPosts"],
    queryFn: listMyPosts,
  });
}; 
