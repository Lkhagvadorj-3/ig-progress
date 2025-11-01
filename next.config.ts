import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    HF_API_TOKEN: process.env.HF_API_TOKEN ?? "",
    backurl: process.env.backurl ?? "http://localhost:5555",
  },
};

export default nextConfig;
