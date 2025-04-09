import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../service/posts/posts";

export const useCreateComment = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      console.log("Comentário enviado com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (error) => {
      console.error("Erro ao enviar comentário:", error);
    },
  });
};
