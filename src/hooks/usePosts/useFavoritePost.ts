import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritePost } from "../../service/posts/posts";

export const useFavoritePost = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: favoritePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getFavoritePosts"] }); 
    },
    onError: (error) => {
      console.error("Erro ao favoritar post:", error);
    },
  });
};
