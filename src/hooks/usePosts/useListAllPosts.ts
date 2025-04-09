import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../service/posts/posts";

export const useListAllPosts = () => {
  return useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });
};
