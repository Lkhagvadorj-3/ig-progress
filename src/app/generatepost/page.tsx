"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Page = () => {
  const router = useRouter();
  const [prompt, setPromt] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
            parameter: {
              negative_prompt: "blurry , bad quality,distorted",
              num_interfence_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error status:${response.status}`);
      }
      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setImageurl(imageURL);

      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "api/upload",
      });
    } catch (err) {
      setIsLoading(false);
    }
    console.log(imageurl);
  };
  return (
    <div className="flex flex-col gap-30">
      <div className="flex gap-30 p-3">
        <h1
          onClick={() => {
            router.push("/");
          }}
        >
          X
        </h1>
        <h1 className="font-semibold text-2xl">New photo post</h1>
      </div>
      <div>
        <h1 className="font-semibold text-3xl pl-3">
          Explore AI generated images
        </h1>
        <h2 className="font-semibold text-1xl opacity-50 pl-3">
          Describe whats on your mind.For best results , be specific{" "}
        </h2>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <Input
          placeholder="WHAT IS YOUR THOUGHT?"
          className="w-[250px] h-[250px]"
          id="prompt"
          value={prompt}
          onChange={(e) => setPromt(e.target.value)}
        />
        <Button
          onClick={createImage}
          disabled={!prompt.trim() || isLoading}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            !prompt.trim() || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Generating...
            </div>
          ) : (
            "Generate Image"
          )}
        </Button>
      </div>
      {/* {isLoading && (
      <div className="mt-8 text-center p-6 bg-purple-50 rounded-lg">
        <div className="text-purple-600 mb-3">Unshijishde...</div>
        <div className="text-sm text-purple-500">
          This may take 10–30 seconds
        </div>
      </div>
    )} */}
      {imageurl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Your created image:
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <img
              src={imageurl}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Page;
