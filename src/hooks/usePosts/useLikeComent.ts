import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  likeComment } from "../../service/posts/posts";

export const useLikeComent = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: likeComment,
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (error) => {
      console.error("Erro ao enviar comentário:", error);
    },
  });
};
