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
type User = {
  username: string;
  email: string;
  password: string;
  bio: string | null;
  profilePicture: string | null;
};
type AuthContext = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  login: (password: string, email: string) => Promise<void>;
};
export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:5555/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const user = await response.json();
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  const values = { user: user, setUser: setUser, login: login };
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
