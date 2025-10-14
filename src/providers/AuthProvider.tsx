"use client";
import {
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  bio: string | null;
  profilePicture: string | null;
};
type AuthContext = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  setToken: Dispatch<SetStateAction<null | string>>;
  token: string | null;
};
type decodedTokenType = {
  data: User;
};
export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const localtoken = localStorage.getItem("token");
    if (localtoken) {
      const decodedToken: decodedTokenType = jwtDecode(localtoken);
      setUser(decodedToken.data);
      setToken(localtoken);
    }
  }, []);
  const values = { user, setUser, setToken, token };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "Auth context ashiglahin tuld zaaval provider dotor bh hergtei"
    );
  }
  return authContext;
};
