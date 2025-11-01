"use client";

import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Menu } from "@/_components/page";

type Comment = {
  _id: string;
  comment: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string | null;
  };
  posts?: {
    _id: string;
    caption: string;
    user: {
      _id: string;
      username: string;
    };
  };
};

export default function Page() {
  const { push } = useRouter();
  const { token } = useUser();
  const params = useParams();
  const postId = params.postId as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [postDetails, setPostDetails] = useState<Comment["posts"] | null>(null);
  const [commentText, setCommentText] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `https://lavdev-backend.onrender.com/comment/get/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data: Comment[] = await res.json();
      setComments(data);
      if (data.length > 0) setPostDetails(data[0].posts ?? null);
    } catch (error) {
      toast.error("Failed to load comments");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const submitComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch(
        "https://lavdev-backend.onrender.com/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ postId, comment: commentText }),
        }
      );
      if (!res.ok) throw new Error("Failed to submit comment");
      toast.success("Comment posted!");
      setCommentText("");
      await fetchComments();
    } catch (error) {
      toast.error("Error posting comment");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-neon fixed top-4 left-6 z-50">
        LAVDEV
      </h1>

      {/* Post Info */}
      {postDetails && (
        <div className="pt-20 flex justify-center">
          <Card className="w-full max-w-2xl backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-neon">
            <CardHeader className="flex items-center gap-4">
              <Avatar
                onClick={() => push(`/otheruser/${postDetails.user._id}`)}
                className="cursor-pointer ring-2 ring-cyan-400 hover:ring-pink-500 transition-all"
              >
                <AvatarFallback>
                  {postDetails.user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle
                onClick={() => push(`/otheruser/${postDetails.user._id}`)}
                className="text-white text-xl"
              >
                {postDetails.user.username}
              </CardTitle>
            </CardHeader>
            <CardDescription className="px-6 text-lg text-white italic">
              {postDetails.caption}
            </CardDescription>
          </Card>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-10 flex flex-col items-center gap-8">
        <h2 className="text-2xl font-bold text-yellow-400">
          Comments ({comments.length})
        </h2>

        <div className="w-full max-w-2xl space-y-6">
          {comments.map((comment) => (
            <Card
              key={comment._id}
              className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-neon"
            >
              <CardHeader className="flex items-center gap-4">
                <Avatar
                  onClick={() => push(`/otheruser/${comment.user._id}`)}
                  className="cursor-pointer ring-2 ring-cyan-400 hover:ring-pink-500 transition-all"
                >
                  {comment.user.profilePicture ? (
                    <AvatarImage
                      src={comment.user.profilePicture}
                      alt={comment.user.username}
                    />
                  ) : (
                    <AvatarFallback>
                      {comment.user.username[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-white">
                  {comment.user.username}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 pl-2">{comment.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-15 left-0 right-0 flex gap-3 px-5 max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-lg py-3 shadow-lg border border-white/20">
        <Input
          placeholder="Write a comment..."
          value={commentText}
          onChange={handleInputChange}
          className="flex-grow text-black placeholder:text-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") submitComment();
          }}
        />
        <Send
          className="cursor-pointer text-cyan-400 hover:text-cyan-600 transition"
          size={24}
          onClick={submitComment}
        />
      </div>
      <Menu />
    </div>
  );
}
