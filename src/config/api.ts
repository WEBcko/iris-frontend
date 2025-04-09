import axios, { AxiosRequestConfig } from "axios";
import { getDecryptedToken } from "../utils/encryption";
import { storeAuthData } from "../context/auth";

const baseUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: baseUrl,
});

export const apiRequestWithToken = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const token = getDecryptedToken();

  if (!token) {
    storeAuthData({ token: null, user: null });
    window.location.href = "/login";
    throw new Error("Token not found");
  }

  const configWithAuth: AxiosRequestConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api(configWithAuth);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Token expirado ou inválido");
        // Limpa os dados de autenticação e redireciona
        storeAuthData({ token: null, user: null });
        window.location.href = "/login"; // Ou a rota desejada
        throw new Error("Token expirado");
      }
      console.error("Erro na requisição:", error.message);
      throw error;
    }
    console.error("Erro inesperado:", error);
    throw error;
  }
};

export const apiRequestWithoutToken = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error("Erro na requisição sem token:", error);
    throw error;
  }
};


export const apiRequestWithOptionalToken = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const token = getDecryptedToken();

  if (token) {
    const configWithAuth: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await api(configWithAuth);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error("Token expirado ou inválido");
          storeAuthData({ token: null, user: null });
          window.location.href = "/login";
          throw new Error("Token expirado");
        }
        console.error("Erro na requisição autenticada:", error.message);
        throw error;
      }
      console.error("Erro inesperado na requisição autenticada:", error);
      throw error;
    }
  } else {
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      console.error("Erro na requisição sem autenticação:", error);
      throw error;
    }
  }
};
