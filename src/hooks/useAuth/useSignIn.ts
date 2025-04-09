import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../service/auth/auth";
import { showSnackbar } from "../../context/snackbarContext";
import axios, { AxiosError } from "axios";
//teste pipeline

export const useSignIn = () => {
  return useMutation({
    mutationKey: ["useSignIn"],
    mutationFn: signIn,
    onError: (error: unknown) => {
      let errorMessage = "Erro ao fazer login";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error;
      }

      showSnackbar(errorMessage, "error");
    },
    onSuccess: () => {
      showSnackbar("Login realizado com sucesso!", "success");
    },
  });
};
