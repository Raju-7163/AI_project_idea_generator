import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output only when explicitly requested (e.g. Docker builds)
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" } : {}),
};

export default nextConfig;
