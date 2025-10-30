"use client";

import { Menu } from "@/_components/page";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center
      bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white
      p-6"
    >
      {/* Header */}
      <header className="flex items-center justify-between w-full max-w-3xl mb-8">
        <button
          aria-label="Close"
          onClick={() => push("/")}
          className="text-4xl font-bold text-cyan-400 drop-shadow-neon hover:text-pink-500 transition-transform duration-300 hover:scale-110"
        >
          ×
        </button>
        <h1 className="text-3xl font-extrabold text-cyan-400 drop-shadow-neon select-none">
          New photo post
        </h1>
        {/* spacer for alignment */}
        <div style={{ width: 40 }} />
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center gap-6 w-full max-w-3xl">
        <div
          className="relative rounded-lg ring-4 ring-cyan-500 hover:ring-pink-500 transition-all duration-500
          cursor-pointer transform hover:scale-105 drop-shadow-neon"
        >
          <img
            src="/photo.jpg"
            alt="Selected photo"
            className="rounded-lg w-full max-w-md object-cover"
          />
        </div>

        <Button
          className="w-[250px] bg-cyan-600 hover:bg-pink-600 shadow-neon hover:shadow-pink-600
          transition-transform duration-300 hover:scale-110"
          onClick={() => push("/localpost")}
        >
          Photo library
        </Button>

        <Button
          className="w-[250px] bg-cyan-600 hover:bg-pink-600 shadow-neon hover:shadow-pink-600
          transition-transform duration-300 hover:scale-110"
          onClick={() => push("/generatepost")}
        >
          Generate with AI
        </Button>
      </main>

      <footer className="w-full max-w-3xl mt-12">
        <Menu />
      </footer>
    </div>
  );
};

export default Page;
