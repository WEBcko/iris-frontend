import CryptoJS from "crypto-js";

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
console.log(encryptionKey)

export const decryptToken = (encryptedToken: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, encryptionKey);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  } catch (e) {
    console.error("Error decrypting token:", e);
    return null;
  }
};

export const encryptToken = (token: string): string => {
  console.log(encryptionKey)
  return CryptoJS.AES.encrypt(token, encryptionKey).toString();
};

export const getDecryptedToken = (): string | null => {
  const storedData = localStorage.getItem("user");
  if (!storedData) {
    return null;
  }

  try {
    const { token } = JSON.parse(storedData) as { token: string | null };
    if (!token) {
      return null;
    }
    return decryptToken(token);
  } catch (error) {
    console.error("Erro ao ler token do localStorage:", error);
    return null;
  }
};
