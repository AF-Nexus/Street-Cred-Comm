import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  getCurrentUser, clearUserToken, setUserToken,
  type DecodedUser,
} from "@/lib/auth";

interface UserAuthContextValue {
  user: DecodedUser | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextValue | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedUser | null>(() => getCurrentUser());

  const login = useCallback((token: string) => {
    setUserToken(token);
    setUser(getCurrentUser());
  }, []);

  const logout = useCallback(() => {
    clearUserToken();
    setUser(null);
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, isLoggedIn: user !== null, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
}
