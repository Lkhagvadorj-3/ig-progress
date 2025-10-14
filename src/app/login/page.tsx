"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

type logintype = {
  email: string;
  pass: string;
};
type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  bio: string | null;
  profilePicture: string | null;
};

type decodedTokenType = {
  data: User;
};

const Page = () => {
  const { push } = useRouter();
  const { setUser, user, token, setToken } = useUser();
  const [inputValue, setInputValue] = useState<logintype>({
    email: "",
    pass: "",
  });
  const handleLoginValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setInputValue({ ...inputValue, email: value });
    }
    if (name === "pass") {
      setInputValue({ ...inputValue, pass: value });
    }
  };
  const login = async () => {
    const response = await fetch("http://localhost:5555/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: inputValue.email,
        password: inputValue.pass,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      toast.success("Logged in successfully");
      push("/");
    } else {
      toast.error("Email or Password incorrect .TRY AGAIN");
    }
  };

  useEffect(() => {
    if (user) push("/");
  }, []);

  const usreh = () => {
    push("/signup");
  };
  return (
    <div className="flex flex-col justify-center items-center gap-20">
      <h1 className="font-semibold text-3xl ">LAVDEV</h1>

      <div className="flex flex-col gap-10">
        <Input
          placeholder="ENTER YOUR EMAIL"
          className="w-[250px]"
          name="email"
          value={inputValue.email}
          onChange={(e) => handleLoginValues(e)}
        />
        <Input
          placeholder="ENTER YOUR PASSWORD"
          className="w-[250px]"
          name="pass"
          value={inputValue.pass}
          onChange={(e) => handleLoginValues(e)}
        />
        <Button
          className="w-[250px]"
          onClick={() => {
            login();
          }}
        >
          Log in
        </Button>
      </div>
      <div className="flex">
        <div>Dont have an account ?</div>
        <div
          className="text-blue-400"
          onClick={() => {
            usreh();
          }}
        >
          SIGN UP
        </div>
      </div>
    </div>
  );
};
export default Page;
