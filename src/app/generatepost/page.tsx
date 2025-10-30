"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { Menu } from "@/_components/page";

const Page = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useUser();
  const [caption, setCaption] = useState("");
  const HF_API_TOKEN = process.env.HF_API_TOKEN;

  const createImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageurl("");
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${HF_API_TOKEN}`,
      };
      const response = await fetch(
        `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], "generated.png", { type: "image/png" });

      // Upload to Vercel Blob Storage
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "api/upload",
      });
      setImageurl(uploaded.url);
    } catch (err) {
      toast.error("Error generating image. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const postUusgeh = async () => {
    if (!imageurl) {
      toast.error("Please generate an image first!");
      return;
    }
    const response = await fetch("http://localhost:5555/posts/createPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        images: [imageurl],
        caption,
        userId: user?._id,
      }),
    });
    if (response.ok) {
      toast.success("POSTED SUCCESSFULLY");
      router.push("/");
    } else {
      toast.error("SOMETHING HAPPENED, PLEASE TRY AGAIN...");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center
      bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6"
    >
      {/* Header */}
      <header className="flex items-center justify-between w-full max-w-3xl mb-8">
        <button
          aria-label="Close"
          onClick={() => router.push("/")}
          className="text-4xl font-bold text-cyan-400 drop-shadow-neon hover:text-pink-500 transition-transform duration-300 hover:scale-110"
        >
          ×
        </button>
        <h1 className="text-3xl font-extrabold text-cyan-400 drop-shadow-neon select-none">
          New photo post
        </h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Intro */}
      <section className="w-full max-w-3xl mb-6">
        <h1 className="text-3xl font-semibold drop-shadow-neon mb-1">
          Explore AI generated images
        </h1>
        <p className="opacity-50 drop-shadow-neon">
          Describe whats on your mind. For best results, be specific.
        </p>
      </section>

      {/* Input and Generate */}
      <main className="flex flex-col items-center gap-6 w-full max-w-3xl">
        <Input
          placeholder="WHAT IS YOUR THOUGHT?"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-[300px] h-[250px] rounded-lg
          bg-[#121023] text-cyan-300 border-cyan-600
          focus:border-pink-500 focus:ring-pink-500
          transition-shadow duration-300"
          multiple={true}
          style={{ resize: "none" }}
        />

        <Button
          onClick={createImage}
          disabled={!prompt.trim() || isLoading}
          className={`w-[300px] py-4 rounded-lg font-semibold text-lg transition-all duration-200
          ${
            !prompt.trim() || isLoading
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-neon hover:shadow-pink-600 transform hover:scale-110"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </div>
          ) : (
            "Generate Image"
          )}
        </Button>
      </main>

      {/* Image Preview */}
      {imageurl && (
        <section
          className="mt-8 w-full max-w-3xl p-4 rounded-lg
          border border-cyan-500 shadow-neon bg-[#121023]"
        >
          <h2 className="text-xl font-semibold mb-4 text-cyan-400 drop-shadow-neon">
            Your created image:
          </h2>
          <img
            src={imageurl}
            alt="Generated AI"
            className="w-full h-auto rounded-lg shadow-neon"
          />
        </section>
      )}

      {/* Caption & Post */}
      <section className="flex flex-col gap-4 w-full max-w-3xl mt-8">
        <textarea
          placeholder="WRITE CAPTION"
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
          name="caption"
          rows={3}
          className="w-full bg-[#121023] text-cyan-300 p-3 rounded-lg
            border border-cyan-600 focus:border-pink-500 focus:ring-pink-500
            transition-shadow duration-300 resize-none"
        />

        <Button
          onClick={postUusgeh}
          className="w-full bg-cyan-600 hover:bg-pink-600 shadow-neon
          transition-transform duration-300 hover:scale-110"
        >
          CREATE POST
        </Button>
      </section>

      {/* Footer Menu */}
      <footer className="w-full max-w-3xl mt-12">
        <Menu />
      </footer>
    </div>
  );
};

export default Page;
