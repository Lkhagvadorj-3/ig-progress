"use client";

import { Menu } from "@/_components/page";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
type User = {
  _id: string;
  username: string;
  followers: string[]; // better to type as string[] if possible
  following: string[];
  email: string;
  password: string;
  bio: string | null;
  profilePicture: string | null;
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const { token } = useUser();
  const [users, setUsers] = useState([]);
  const { push } = useRouter();

  const getUsers = async () => {
    const response = await fetch(
      `http://localhost:5555/users/search/${inputValue}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const users = await response.json();
    setUsers(users);
  };

  useEffect(() => {
    if (token && inputValue.trim().length > 0) getUsers();
  }, [inputValue, token]);
  console.log(users);
  return (
    <div className="min-h-screen w-full px-6 py-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white relative">
      <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-neon fixed top-4 left-6 z-50">
        LAVDEV
      </h1>
      <div className="fixed bottom-15 left-1/2 transform -translate-x-1/2 w-[90%] max-w-lg z-50">
        <Input
          placeholder="SEARCH USER..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-[#0f0c29] border-cyan-500 text-cyan-300 placeholder-cyan-500 
          focus:ring-pink-500 focus:border-pink-500 rounded-lg shadow-md transition"
        />
      </div>
      <Menu />

      <div className="mt-32 space-y-6">
        {users.length > 0 ? (
          users.map((user: User) => (
            <Card
              key={user._id}
              onClick={() => push(`/otheruser/${user._id}`)}
              className="bg-[#1c1b2f] border border-cyan-400 hover:border-pink-500 
              transition-all duration-200 hover:scale-[1.02] cursor-pointer rounded-xl shadow-glow"
            >
              <CardHeader className="flex flex-row items-center gap-5 p-5">
                <Avatar className="w-12 h-12 ring-2 ring-cyan-400 hover:ring-pink-500 transition-all duration-300 transform hover:scale-110 rounded-full text-center">
                  <AvatarImage
                    src={user.profilePicture!}
                    className="rounded-full"
                  />
                  <AvatarFallback className="text-white">
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-cyan-300 text-xl font-semibold">
                  {user.username}
                </CardTitle>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="text-center text-cyan-400 text-lg mt-10">
            {inputValue.trim().length === 0
              ? "Start typing to search..."
              : "User not found"}
          </div>
        )}
      </div>
    </div>
  );
}
