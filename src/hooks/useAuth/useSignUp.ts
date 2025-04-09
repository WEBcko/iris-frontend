import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../service/auth/auth";
import axios from "axios";
import { showSnackbar } from "../../context/snackbarContext";

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["useSignUp"],
    mutationFn: signUp,
    onError: (error: unknown) => {
      let errorMessage = "Erro ao fazer Cadastro";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error;
      }

      showSnackbar(errorMessage, "error");
    },
    onSuccess: () => {
      showSnackbar("Cadastro realizado com sucesso!", "success");
    },
  });
};
