import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: { HF_API_TOKEN: process.env.HF_API_TOKEN ?? "" },
};

export default nextConfig;
