import * as React from "react";
import { UserType } from "../types/auth/user";

interface AuthData {
  token: string | null;
  user: UserType | null;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  login: (token: string, user: UserType) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  user: UserType | null;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const LOCALSTORAGE_KEY = "user";

export function storeAuthData(data: AuthData) {
  if (data.token || data.user) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }
}

function loadAuthData(): AuthData {
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    return stored ? JSON.parse(stored) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = React.useState<AuthData>(() =>
    loadAuthData()
  );

  const isAuthenticated = !!authData.token;

  const login = React.useCallback(async (token: string, user: UserType) => {
    const newData = { token, user };
    storeAuthData(newData);
    setAuthData(newData);
  }, []);

  const logout = React.useCallback(async () => {
    storeAuthData({ token: null, user: null });
    setAuthData({ token: null, user: null });
    window.location.href = "/";
  }, []);

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCALSTORAGE_KEY) {
        setAuthData(loadAuthData());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  React.useEffect(() => {
    const data = loadAuthData();
    if (!data.token && authData.token) {
      logout();
    }
  }, [authData.token, logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token: authData.token,
        user: authData.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
