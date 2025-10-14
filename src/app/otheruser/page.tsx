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
import { Heart, HeartCrack } from "lucide-react";
import { toast } from "sonner";
type User = {
  _id: string;
  username: string;
  followers: any[];
  following: any[];
  email: string;
  password: string;
  bio: string | null;
  profilePicture: string | null;
};

export default function Page() {
  const { push } = useRouter();
  const { user, token } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [herglgc, setHerglgc] = useState<User | null>(null);

  if (user?._id === herglgc?._id) {
    push("/profile");
    return;
  }

  const viewpost = async () => {
    const response = await fetch(
      "http://localhost:5555/posts/otheruser/68de44080999506398872c64",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setPosts(data);
    console.log(data);
  };
  const viewdata = async () => {
    const response = await fetch(
      "http://localhost:5555/users/68de44080999506398872c64",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setHerglgc(data);
    console.log(data);
  };

  useEffect(() => {
    viewpost();
    viewdata();
  }, []);

  const usreh = () => {
    push("/");
  };
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
      toast.success("LIKED POST");
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
      toast.success("FOLLOWED");
      await viewpost();
    } else {
      toast.error("ARAICDE BRO");
    }
  };

  console.log(posts);
  return (
    <div>
      {" "}
      <div>
        {" "}
        <h1
          className="font-semibold text-3xl fixed m-0 p-0"
          onClick={() => {
            usreh();
          }}
        >
          LAVDEV
        </h1>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center">
          {" "}
          <h1 className="font-semibold text-2xl pt-10">{herglgc?.username}</h1>
          <img
            src="/IMG_0059.jpg"
            className="w-[77px] h-[77px] border rounded-full"
          />
        </div>
        <h1>{user?.bio}</h1>
        <div className="flex justify-center">
          <Button
            className="w-30 bg-green-500"
            onClick={() => follow(herglgc!._id)}
          >
            FOLLOW
          </Button>
        </div>

        <div>
          <div className="flex gap-5 justify-center items-center">
            <div>
              <h1 className="flex justify-center">{posts.length}</h1>
              <h1>POSTS</h1>
            </div>
            <div>
              <h1 className="flex justify-center">
                {herglgc?.followers.length}
              </h1>
              <h1>FOLLOWERS</h1>
            </div>
            <div>
              <h1 className="flex justify-center">
                {herglgc?.following.length}
              </h1>
              <h1>FOLLOWING</h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        {posts.map((pos, index) => {
          return (
            <div key={index} className="flex flex-col items-center ">
              <Card>
                <CardHeader>
                  <CardTitle>{herglgc?.username}</CardTitle>
                  <CardDescription className="text-black font-semibold text-2xl">
                    {pos.caption}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img src={pos.images} className="w-[400px] h-[400px]" />
                </CardContent>
                <CardFooter>
                  <div className="flex gap-5">
                    <div onClick={() => postlike(pos._id)}>
                      {pos.likes.includes(user?._id) ? (
                        <Heart color="red" fill="red" />
                      ) : (
                        <HeartCrack />
                      )}
                    </div>
                    <div>{pos.likes.length}</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-shell-icon lucide-shell"
                    >
                      <path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"
                    >
                      <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                      <path d="m21 3-9 9" />
                      <path d="M15 3h6v6" />
                    </svg>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
