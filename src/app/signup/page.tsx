"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";

type signuptype = {
  username: string;
  email: string;
  pass: string;
};
const Page = () => {
  const { push } = useRouter();
  const [inputValue, setInputValue] = useState<signuptype>({
    username: "",
    email: "",
    pass: "",
  });
  const handleLoginValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "username") {
      setInputValue({ ...inputValue, username: value });
    }
    if (name === "email") {
      setInputValue({ ...inputValue, email: value });
    }
    if (name === "pass") {
      setInputValue({ ...inputValue, pass: value });
    }
  };

  const signup = async () => {
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
    push("/login");
    toast.success("Created your account successfully");
  };

  const jump = () => {
    push("/login");
  };
  console.log(inputValue);
  return (
    <div className="flex flex-col justify-center items-center gap-20">
      <h1 className="font-semibold text-3xl ">LAVDEV</h1>

      <div className="flex flex-col gap-10">
        CREATE YOUR ACCOUNT
        <Input
          placeholder="USERNAME"
          className="w-[250px]"
          name="username"
          value={inputValue.username}
          onChange={(e) => handleLoginValues(e)}
        />
        <Input
          placeholder="EMAIL"
          className="w-[250px]"
          name="email"
          value={inputValue.email}
          onChange={(e) => handleLoginValues(e)}
        />
        <Input
          placeholder="PASSWORD"
          className="w-[250px]"
          name="pass"
          value={inputValue.pass}
          onChange={(e) => handleLoginValues(e)}
        />
        <Button
          className="w-[250px]"
          onClick={() => {
            signup();
          }}
        >
          SIGN UP
        </Button>
      </div>
      <div className="flex">
        <div>Already have an account ? </div>
        <div
          className="text-blue-400"
          onClick={() => {
            jump();
          }}
        >
          LOG IN
        </div>
      </div>
    </div>
  );
};
export default Page;
