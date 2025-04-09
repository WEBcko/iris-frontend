import { useQuery } from "@tanstack/react-query";
import { getCommentsByPostId } from "../../service/posts/posts";
import { Comment } from "../../types/posts/index";
export const useListComments = (postId: number | null) => {
    return useQuery<Comment[], Error>({
      queryKey: ["comments", postId],
      queryFn: async (): Promise<Comment[]> => {
        if (!postId) return [];
        return getCommentsByPostId({ postId });
      },
      enabled: !!postId, 
    });
  };
  