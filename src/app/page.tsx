"use client";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { user } = useUser();
  const { push } = useRouter();
  useEffect(() => {
    if (!user) push("/login");
  }, []);
  console.log(user?.username);
  return (
    <div>
      <div>
        {" "}
        <h1 className="font-semibold text-3xl fixed ">LAVDEV</h1>
      </div>
      <div className="p-7">HELLO{user?.username}</div>
    </div>
  );
}
