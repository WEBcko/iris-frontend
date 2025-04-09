import { useMutation } from "@tanstack/react-query";
import { createPost } from "../../service/posts/posts";
import axios from "axios";
import { showSnackbar } from "../../context/snackbarContext";

export const useCreatePost = () => {
  return useMutation({
    mutationKey: ["useCreatePost"],
    mutationFn: createPost,
    onError: (error: unknown) => {
      let errorMessage = "Erro ao Criar Post";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error;
      }

      showSnackbar(errorMessage, "error");
    },
    onSuccess: () => {
      showSnackbar("Post criado com sucesso!", "success");
    },
  });
};
