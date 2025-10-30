"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

type signuptype = {
  username: string;
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
  const { setUser, setToken } = useUser();

  const [inputValue, setInputValue] = useState<signuptype>({
    username: "",
    email: "",
    pass: "",
  });

  const handleLoginValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const signup = async () => {
    if (
      !inputValue.username.trim() ||
      !inputValue.email.trim() ||
      !inputValue.pass.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5555/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputValue.username,
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
        toast.success("Created your account successfully");
        push("/login");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const jump = () => {
    push("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center
      bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6"
    >
      <h1 className="text-5xl font-extrabold mb-16 text-cyan-400 drop-shadow-neon select-none">
        LAVDEV
      </h1>

      <div className="flex flex-col gap-8 w-full max-w-xs text-center">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300 drop-shadow-neon">
          CREATE YOUR ACCOUNT
        </h2>

        <Input
          placeholder="USERNAME"
          className="bg-[#121023] text-cyan-300 border-cyan-600 focus:border-pink-500 focus:ring-pink-500
            rounded-lg px-4 py-3 placeholder-cyan-500
            transition-shadow duration-300"
          name="username"
          value={inputValue.username}
          onChange={handleLoginValues}
          spellCheck={false}
        />
        <Input
          placeholder="EMAIL"
          className="bg-[#121023] text-cyan-300 border-cyan-600 focus:border-pink-500 focus:ring-pink-500
            rounded-lg px-4 py-3 placeholder-cyan-500
            transition-shadow duration-300"
          name="email"
          value={inputValue.email}
          onChange={handleLoginValues}
          type="email"
          autoComplete="email"
          spellCheck={false}
        />
        <Input
          placeholder="PASSWORD"
          className="bg-[#121023] text-cyan-300 border-cyan-600 focus:border-pink-500 focus:ring-pink-500
            rounded-lg px-4 py-3 placeholder-cyan-500
            transition-shadow duration-300"
          name="pass"
          value={inputValue.pass}
          onChange={handleLoginValues}
          type="password"
          autoComplete="new-password"
        />
        <Button
          onClick={signup}
          className="bg-gradient-to-r from-purple-600 to-blue-600
            shadow-neon hover:shadow-pink-600
            transition-transform duration-300 hover:scale-105
            rounded-lg py-3 font-semibold text-lg"
        >
          SIGN UP
        </Button>
      </div>

      <div className="mt-12 flex gap-2 text-cyan-300 text-sm select-none">
        <span>Already have an account?</span>
        <button
          className="text-pink-500 font-semibold hover:underline hover:scale-105 transition-transform duration-200"
          onClick={jump}
        >
          LOG IN
        </button>
      </div>
    </div>
  );
};

export default Page;
