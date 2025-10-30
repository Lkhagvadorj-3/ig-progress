"use client";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, HeartCrack, MessageCircle, Share } from "lucide-react";
import { toast } from "sonner";
import { Menu } from "@/_components/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type posttype = {
  _id: string;
  caption: string;
  createdAt: Date;
  images: string[];
  likes: string[];
  updatedAt: Date;
  user: User;
};

export default function Home() {
  const { push } = useRouter();
  const { user, token } = useUser();
  const [posts, setPosts] = useState<posttype[]>([]);

  const viewpost = async () => {
    const response = await fetch("http://localhost:5555/posts/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    viewpost();
  }, []);

  useEffect(() => {
    if (!user) push("/login");
  }, []);

  const postlike = async (postId: string) => {
    const response = await fetch(
      `http://localhost:5555/posts/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      toast.success("Liked Post");
      await viewpost();
    }
  };

  const follow = async (followedUserId: string) => {
    const response = await fetch(
      `http://localhost:5555/toggle-follow/${followedUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      toast.success("Followed");
      await viewpost();
    } else {
      toast.error("Something went wrong");
    }
  };
  console.log(posts);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      <h1
        className="text-4xl font-bold text-cyan-400 drop-shadow-neon fixed top-4 left-6 z-50"
        onClick={() => push("https://www.instagram.com/lkhagva.dorj_/")}
      >
        LAVDEV
      </h1>

      <div className="pt-20 text-center text-3xl font-semibold text-yellow-400">
        Hello, <span className="text-pink-400">{user?.username}</span>
      </div>

      <h2 className="text-center text-2xl mt-8 mb-6 font-bold text-white">
        Feed
      </h2>

      <div className="space-y-12 flex flex-col items-center">
        {posts.map((pos) => (
          <Card
            key={pos._id}
            className="w-full max-w-2xl backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-neon"
          >
            <CardHeader className="flex items-center gap-4">
              <Avatar
                onClick={() => push(`/otheruser/${pos.user._id}`)}
                className="cursor-pointer ring-2 ring-cyan-400 hover:ring-pink-500 transition-all"
              >
                <AvatarImage src={pos.user.profilePicture!} />
                <AvatarFallback>{pos.user.username[0]}</AvatarFallback>
              </Avatar>
              <CardTitle
                onClick={() => push(`/otheruser/${pos.user._id}`)}
                className="text-white transition-all"
              >
                {pos.user.username}
              </CardTitle>
            </CardHeader>
            <CardAction className="px-6 pb-2">
              <Button
                className={`transition-all ${
                  pos.user.followers.includes(user!._id)
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => follow(pos.user._id)}
              >
                {pos.user.followers.includes(user!._id) ? "Unfollow" : "Follow"}
              </Button>
            </CardAction>
            <CardDescription className="px-6 text-lg text-white font-light italic">
              {pos.caption}
            </CardDescription>

            <CardContent className="px-6 py-4">
              <img
                src={pos.images[0]}
                alt="Post"
                className="rounded-xl w-full h-[400px] object-cover border border-cyan-400 shadow-inner"
              />
            </CardContent>

            <CardFooter className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-5">
                <div
                  onClick={() => postlike(pos._id)}
                  className="cursor-pointer"
                >
                  {pos.likes.includes(user!._id) ? (
                    <Heart color="red" fill="red" />
                  ) : (
                    <HeartCrack color="white" />
                  )}
                </div>
                <span className="text-sm text-gray-300">
                  {pos.likes.length}
                </span>
                <MessageCircle
                  onClick={() => push(`/comment/${pos._id}`)}
                  className="text-white"
                />
                <Share className="text-white" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-4 w-full">
        <Menu />
      </div>
    </div>
  );
}
