"use client";
import { useUser } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, HeartCrack, MessageCircle, Share } from "lucide-react";
import { toast } from "sonner";
import { Menu } from "@/_components/page";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type User = {
  _id: string;
  username: string;
  followers: string[];
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

export default function Page() {
  const { push } = useRouter();
  const { user, token } = useUser();
  const [posts, setPosts] = useState<posttype[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const params = useParams();
  const userId = params.otheruserid;

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:5555/posts/otheruser/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPosts(data);
  };

  const fetchUserData = async () => {
    const res = await fetch(`http://localhost:5555/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setProfileUser(data);
  };

  useEffect(() => {
    fetchPosts();
    fetchUserData();
  }, [userId]);

  const goHome = () => push("/");
  const likePost = async (postId: string) => {
    const res = await fetch(
      `http://localhost:5555/posts/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      toast.success("Liked Post");
      await fetchPosts();
    }
  };

  const toggleFollow = async (followedUserId: string) => {
    const res = await fetch(
      `http://localhost:5555/toggle-follow/${followedUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      toast.success("Follow status updated");
      await fetchUserData();
    } else {
      toast.error("Error updating follow status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      <header className="fixed top-4 left-6 z-50">
        <h1
          className="text-4xl font-bold text-cyan-400 cursor-pointer drop-shadow-neon"
          onClick={goHome}
        >
          LAVDEV
        </h1>
      </header>

      <main className="pt-24 max-w-3xl mx-auto flex flex-col items-center gap-8">
        {/* User Info */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="ring-4 ring-cyan-500 hover:ring-pink-500 transition-all rounded-full w-[120px] h-[120px]">
            {profileUser?.profilePicture ? (
              <AvatarImage
                src={profileUser.profilePicture}
                alt={profileUser.username}
                className="rounded-full"
              />
            ) : (
              <AvatarFallback className="text-6xl font-bold text-cyan-400">
                {profileUser?.username?.[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <h2 className="text-3xl font-semibold text-white">
            {profileUser?.username}
          </h2>
          <p className="text-center text-gray-300 max-w-md italic">
            {profileUser?.bio || "No bio available"}
          </p>

          <Button
            className={`px-8 py-2 ${
              profileUser?.followers.includes(user!._id)
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-green-600 hover:bg-green-700"
            } transition-all rounded-full`}
            onClick={() => toggleFollow(profileUser!._id)}
          >
            {profileUser?.followers.includes(user!._id) ? "Unfollow" : "Follow"}
          </Button>

          {/* Stats */}
          <div className="flex gap-16 mt-4 text-center text-white/80 font-semibold">
            <div>
              <div className="text-2xl">{posts.length}</div>
              <div className="text-sm uppercase tracking-wide">Posts</div>
            </div>
            <div>
              <div className="text-2xl">{profileUser?.followers.length}</div>
              <div className="text-sm uppercase tracking-wide">Followers</div>
            </div>
            <div>
              <div className="text-2xl">{profileUser?.following.length}</div>
              <div className="text-sm uppercase tracking-wide">Following</div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <section className="w-full flex flex-col items-center gap-10">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="w-full max-w-2xl backdrop-blur-md bg-white/10 border border-cyan-500 rounded-xl shadow-neon transition hover:scale-[1.02]"
            >
              <CardHeader className="flex items-center gap-4">
                <Avatar className="ring-2 ring-cyan-400 rounded-full w-12 h-12 cursor-pointer">
                  {profileUser?.profilePicture ? (
                    <AvatarImage
                      src={profileUser.profilePicture}
                      alt={profileUser.username}
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="text-xl font-bold text-cyan-400">
                      {profileUser?.username?.[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-white font-semibold text-lg">
                  {profileUser?.username}
                </CardTitle>
              </CardHeader>

              <CardDescription className="px-6 text-white/90 text-lg font-light italic">
                {post.caption}
              </CardDescription>

              <CardContent className="px-6 py-4">
                <img
                  src={post.images[0]}
                  alt="Post Image"
                  className="rounded-xl w-full max-h-[400px] object-cover border border-cyan-500 shadow-inner"
                />
              </CardContent>

              <CardFooter className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-6">
                  <div
                    onClick={() => likePost(post._id)}
                    className="cursor-pointer"
                    title="Like Post"
                  >
                    {post.likes.includes(user!._id) ? (
                      <Heart color="red" fill="red" />
                    ) : (
                      <HeartCrack color="#ccc" />
                    )}
                  </div>
                  <span className="text-white/80">{post.likes.length}</span>
                  <MessageCircle
                    onClick={() => push(`/comment/${post?._id}`)}
                    className="text-white"
                  />
                  <Share className="text-white" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>

      <footer className="fixed bottom-4 w-full max-w-3xl mx-auto px-6">
        <Menu />
      </footer>
    </div>
  );
}
