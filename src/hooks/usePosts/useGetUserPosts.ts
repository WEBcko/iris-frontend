import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../service/posts/posts";

export const useUserPosts = (userId?: string) => {
    return useQuery({
      queryKey: ["userPosts", userId],
      queryFn: () => userId ? getUserPosts(userId) : Promise.reject("No user ID"),
      enabled: !!userId, 
    });
  };
